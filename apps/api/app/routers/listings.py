from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import Listing, User
from app.schemas import ListingCreate, ListingOut
from app.auth import get_current_user

router = APIRouter()

@router.get("/listings", response_model=List[ListingOut])
async def get_listings(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    session: AsyncSession = Depends(get_session)
):
    """Get all listings with optional search and category filter."""
    query = select(Listing)
    
    if q:
        query = query.where(Listing.title.ilike(f"%{q}%"))
    
    if category:
        query = query.where(Listing.category == category)
    
    result = await session.execute(query)
    listings = result.scalars().all()
    return listings

@router.get("/listings/{listing_id}", response_model=ListingOut)
async def get_listing(
    listing_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get a specific listing by ID."""
    result = await session.execute(select(Listing).where(Listing.id == listing_id))
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    return listing

@router.post("/listings", response_model=ListingOut)
async def create_listing(
    listing_data: ListingCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new listing (authentication required)."""
    listing = Listing(
        title=listing_data.title,
        description=listing_data.description,
        category=listing_data.category,
        price=listing_data.price,
        owner_id=current_user.id
    )
    
    session.add(listing)
    await session.commit()
    await session.refresh(listing)
    
    return listing