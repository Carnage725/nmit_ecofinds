import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# Read DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://eco:eco@localhost:5432/nmit_ecofinds")

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=False)

# Create session factory
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for models
class Base(DeclarativeBase):
    pass

# Dependency to get database session
async def get_session():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()