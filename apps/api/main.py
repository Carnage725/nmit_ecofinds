# folder: ~/nmit_ecofinds/apps/api
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from typing import List, Optional, AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Text, Float, select, or_
import os

# ---- config (.env) ----
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://eco:eco@localhost:5432/nmit_ecofinds")
CORS_ORIGINS = [os.getenv("CORS_ORIGINS", "http://localhost:3000")]

# ---- db setup ----
engine = create_async_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class Listing(Base):
    __tablename__ = "listings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(60))
    price: Mapped[float] = mapped_column(Float)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

# ---- schemas ----
class ListingOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    price: float
    model_config = ConfigDict(from_attributes=True)

class ListingCreate(BaseModel):
    title: str
    description: str
    category: str
    price: float

# ---- app ----
app = FastAPI(title="EcoFinds API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup() -> None:
    # create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # seed if empty
    async with SessionLocal() as s:
        exists = (await s.execute(select(Listing))).scalars().first()
        if not exists:
            s.add_all([
                Listing(title="Used Laptop", description="i5, 8GB RAM", category="Electronics", price=22000.0),
                Listing(title="Dining Chair", description="Solid wood, minor scratches", category="Furniture", price=1500.0),
                Listing(title="Novel Set", description="5 bestsellers bundle", category="Books", price=999.0),
            ])
            await s.commit()

@app.get("/healthz")
async def healthz():
    return {"ok": True}

@app.get("/listings", response_model=List[ListingOut])
async def list_listings(
    q: Optional[str] = None,
    category: Optional[str] = None,
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Listing)
    if q:
        stmt = stmt.where(or_(Listing.title.ilike(f"%{q}%"), Listing.description.ilike(f"%{q}%")))
    if category:
        stmt = stmt.where(Listing.category.ilike(category))
    rows = (await session.execute(stmt)).scalars().all()
    return rows

@app.get("/listings/{lid}", response_model=ListingOut)
async def get_listing(lid: int, session: AsyncSession = Depends(get_session)):
    row = await session.get(Listing, lid)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return row

@app.post("/listings", response_model=ListingOut, status_code=201)
async def create_listing(payload: ListingCreate, session: AsyncSession = Depends(get_session)):
    row = Listing(**payload.model_dump())
    session.add(row)
    await session.commit()
    await session.refresh(row)
    return row
