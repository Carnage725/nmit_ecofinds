import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import engine, Base, SessionLocal
from app.models import User, Category, Listing
from app.auth import hash_password
from app.routers import listings, categories, auth, cart, orders, items_compat, transactions_compat

# Create FastAPI app
app = FastAPI(title="EcoFinds API", description="Sustainable resale marketplace backend")

# CORS setup
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["auth"])
app.include_router(categories.router, tags=["categories"])
app.include_router(listings.router, tags=["listings"])
app.include_router(cart.router, tags=["cart"])
app.include_router(orders.router, tags=["orders"])
app.include_router(items_compat.router, tags=["items-compat"])
app.include_router(transactions_compat.router, tags=["transactions-compat"])

@app.get("/healthz")
async def health_check():
    """Health check endpoint."""
    return {"ok": True}

async def create_tables_and_seed():
    """Create tables and seed initial data."""
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed data
    async with SessionLocal() as session:
        # Check if data already exists
        result = await session.execute(select(User).where(User.email == "john@example.com"))
        if result.scalar_one_or_none():
            print("Data already seeded, skipping...")
            return
        
        # Seed demo user
        demo_user = User(
            email="john@example.com",
            username="john",
            password_hash=hash_password("secret")
        )
        session.add(demo_user)
        await session.flush()  # Get user ID
        
        # Seed categories
        categories_data = [
            {"name": "Electronics", "slug": "electronics"},
            {"name": "Furniture", "slug": "furniture"},
            {"name": "Books", "slug": "books"},
            {"name": "Fashion", "slug": "fashion"},
            {"name": "Sports", "slug": "sports"},
            {"name": "Home", "slug": "home"}
        ]
        
        for cat_data in categories_data:
            category = Category(**cat_data)
            session.add(category)
        
        # Seed sample listings
        listings_data = [
            {
                "title": "MacBook Air M2",
                "description": "Excellent condition, barely used",
                "category": "electronics",
                "price": 45000.0,
                "owner_id": demo_user.id
            },
            {
                "title": "Wooden Dining Table",
                "description": "Solid oak, seats 6 people",
                "category": "furniture", 
                "price": 12000.0,
                "owner_id": demo_user.id
            },
            {
                "title": "Programming Books Collection",
                "description": "Python, JavaScript, and React books",
                "category": "books",
                "price": 2500.0,
                "owner_id": demo_user.id
            },
            {
                "title": "Vintage Leather Jacket",
                "description": "Genuine leather, size M",
                "category": "fashion",
                "price": 8000.0,
                "owner_id": demo_user.id
            }
        ]
        
        for listing_data in listings_data:
            listing = Listing(**listing_data)
            session.add(listing)
        
        await session.commit()
        print("Database seeded successfully!")

@app.on_event("startup")
async def startup_event():
    """Run on app startup."""
    await create_tables_and_seed()