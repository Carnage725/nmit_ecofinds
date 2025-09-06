# folder: ~/nmit_ecofinds/apps/api/main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from typing import List, Optional, AsyncGenerator
from datetime import datetime
from passlib.context import CryptContext
import jwt
from jwt.exceptions import InvalidTokenError

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, Float, DateTime, Boolean, ForeignKey, select, or_, func, desc
import os

# ---- config (.env) ----
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://eco:eco@localhost:5432/nmit_ecofinds")
CORS_ORIGINS = [os.getenv("CORS_ORIGINS", "http://localhost:3000")]
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

# ---- password hashing ----
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---- db setup ----
engine = create_async_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    hashed_password: Mapped[str] = mapped_column(String(255))
    eco_points: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Listing(Base):
    __tablename__ = "listings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(60))
    price: Mapped[float] = mapped_column(Float)
    seller_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    total_amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    shipping_address: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"))
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("listings.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sender_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    receiver_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    listing_id: Mapped[int] = mapped_column(Integer, ForeignKey("listings.id"))
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

# ---- schemas ----
class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    eco_points: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ListingOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    price: float
    seller_id: int
    image_url: Optional[str] = None
    is_available: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ListingCreate(BaseModel):
    title: str
    description: str
    category: str
    price: float
    image_url: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[dict]
    shipping_address: str

class OrderOut(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_address: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ChatMessageCreate(BaseModel):
    receiver_id: int
    listing_id: int
    message: str

class ChatMessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    listing_id: int
    message: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ---- auth helpers ----
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except InvalidTokenError:
        return None

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
        # Check if users exist
        user_exists = (await s.execute(select(User))).scalars().first()
        if not user_exists:
            # Create demo users
            demo_users = [
                User(
                    email="seller@demo.com",
                    full_name="Demo Seller",
                    hashed_password=get_password_hash("password123"),
                    eco_points=250
                ),
                User(
                    email="buyer@demo.com", 
                    full_name="Demo Buyer",
                    hashed_password=get_password_hash("password123"),
                    eco_points=150
                )
            ]
            s.add_all(demo_users)
            await s.commit()
            
            # Refresh to get IDs
            await s.refresh(demo_users[0])
            
            # Create demo listings
            demo_listings = [
                Listing(title="Used Laptop", description="Dell i5, 8GB RAM, excellent condition", 
                       category="Electronics", price=22000.0, seller_id=demo_users[0].id,
                       image_url="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"),
                Listing(title="Dining Chair", description="Solid wood dining chair with minor scratches", 
                       category="Furniture", price=1500.0, seller_id=demo_users[0].id,
                       image_url="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400"),
                Listing(title="Novel Collection", description="5 bestselling novels bundle", 
                       category="Books", price=999.0, seller_id=demo_users[0].id,
                       image_url="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"),
                Listing(title="Bamboo Water Bottle", description="Eco-friendly bamboo water bottle", 
                       category="Home & Garden", price=599.0, seller_id=demo_users[0].id,
                       image_url="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"),
                Listing(title="Yoga Mat", description="Natural rubber yoga mat, lightly used", 
                       category="Sports", price=1200.0, seller_id=demo_users[0].id,
                       image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"),
            ]
            s.add_all(demo_listings)
            await s.commit()

# ---- auth endpoints ----
@app.post("/auth/register", response_model=UserOut)
async def register(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    # Check if user exists
    existing_user = (await session.execute(
        select(User).where(User.email == user_data.email)
    )).scalars().first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password
    )
    
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

@app.post("/auth/login")
async def login(user_data: UserLogin, session: AsyncSession = Depends(get_session)):
    user = (await session.execute(
        select(User).where(User.email == user_data.email)
    )).scalars().first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "user": UserOut.model_validate(user)}

# ---- main endpoints ----
@app.get("/healthz")
async def healthz():
    return {"ok": True}

@app.get("/listings", response_model=List[ListingOut])
async def list_listings(
    q: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=50),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Listing).where(Listing.is_available == True)
    
    if q:
        stmt = stmt.where(or_(
            Listing.title.ilike(f"%{q}%"), 
            Listing.description.ilike(f"%{q}%")
        ))
    if category:
        stmt = stmt.where(Listing.category.ilike(f"%{category}%"))
    if min_price is not None:
        stmt = stmt.where(Listing.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Listing.price <= max_price)
    
    # Add pagination
    offset = (page - 1) * per_page
    stmt = stmt.order_by(desc(Listing.created_at)).offset(offset).limit(per_page)
    
    rows = (await session.execute(stmt)).scalars().all()
    return rows

@app.get("/listings/categories")
async def get_categories(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Listing.category, func.count(Listing.id).label('count'))
        .where(Listing.is_available == True)
        .group_by(Listing.category)
    )
    categories = [{"name": row[0], "count": row[1]} for row in result]
    return categories

@app.get("/listings/{lid}", response_model=ListingOut)
async def get_listing(lid: int, session: AsyncSession = Depends(get_session)):
    row = await session.get(Listing, lid)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return row

@app.post("/listings", response_model=ListingOut, status_code=201)
async def create_listing(payload: ListingCreate, session: AsyncSession = Depends(get_session)):
    # In a real app, you'd get seller_id from the authenticated user
    row = Listing(**payload.model_dump(), seller_id=1)
    session.add(row)
    await session.commit()
    await session.refresh(row)
    return row

# ---- order endpoints ----
@app.post("/orders", response_model=OrderOut)
async def create_order(order_data: OrderCreate, session: AsyncSession = Depends(get_session)):
    # Calculate total
    total_amount = sum(item['price'] * item['quantity'] for item in order_data.items)
    
    # Create order (using user_id=2 for demo, in real app get from auth)
    order = Order(
        user_id=2,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        status="confirmed"
    )
    
    session.add(order)
    await session.commit()
    await session.refresh(order)
    
    # Create order items
    for item in order_data.items:
        order_item = OrderItem(
            order_id=order.id,
            listing_id=item['id'],
            quantity=item['quantity'],
            price=item['price']
        )
        session.add(order_item)
    
    await session.commit()
    return order

@app.get("/orders", response_model=List[OrderOut])
async def get_orders(session: AsyncSession = Depends(get_session)):
    # In real app, filter by authenticated user
    stmt = select(Order).order_by(desc(Order.created_at))
    orders = (await session.execute(stmt)).scalars().all()
    return orders

# ---- chat endpoints ----
@app.post("/chat/messages", response_model=ChatMessageOut)
async def send_message(message_data: ChatMessageCreate, session: AsyncSession = Depends(get_session)):
    message = ChatMessage(
        sender_id=2,  # Demo user, get from auth in real app
        **message_data.model_dump()
    )
    session.add(message)
    await session.commit()
    await session.refresh(message)
    return message

@app.get("/chat/messages/{listing_id}", response_model=List[ChatMessageOut])
async def get_messages(listing_id: int, session: AsyncSession = Depends(get_session)):
    stmt = select(ChatMessage).where(
        ChatMessage.listing_id == listing_id
    ).order_by(ChatMessage.created_at)
    
    messages = (await session.execute(stmt)).scalars().all()
    return messages