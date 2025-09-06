from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import Listing, User, Order, OrderItem
from app.schemas import ListingCreate, ListingOut
from app.auth import get_current_user

router = APIRouter()

@router.get("/items", response_model=List[ListingOut])
async def get_items(session: AsyncSession = Depends(get_session)):
    """Get all items (compatibility endpoint for /listings)."""
    result = await session.execute(select(Listing))
    listings = result.scalars().all()
    return listings

@router.get("/items/{item_id}", response_model=ListingOut)
async def get_item(
    item_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get a specific item by ID (compatibility endpoint for /listings/{id})."""
    result = await session.execute(select(Listing).where(Listing.id == item_id))
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return listing

@router.post("/items", response_model=ListingOut)
async def create_item(
    item_data: ListingCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new item (compatibility endpoint for /listings)."""
    listing = Listing(
        title=item_data.title,
        description=item_data.description,
        category=item_data.category,
        price=item_data.price,
        owner_id=current_user.id
    )
    
    session.add(listing)
    await session.commit()
    await session.refresh(listing)
    
    return listing

@router.get("/items/user/{user_id}", response_model=List[ListingOut])
async def get_user_items(
    user_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get all items by a specific user."""
    result = await session.execute(select(Listing).where(Listing.owner_id == user_id))
    listings = result.scalars().all()
    return listings

@router.post("/items/{item_id}/purchase")
async def purchase_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Purchase an item directly (creates a single-item order)."""
    # Get the item
    result = await session.execute(select(Listing).where(Listing.id == item_id))
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if listing.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot purchase your own item")
    
    # Create order
    order = Order(user_id=current_user.id, total=listing.price)
    session.add(order)
    await session.flush()  # Get order ID
    
    # Create order item
    order_item = OrderItem(
        order_id=order.id,
        listing_id=listing.id,
        title_snapshot=listing.title,
        price_snapshot=listing.price,
        qty=1
    )
    session.add(order_item)
    
    await session.commit()
    await session.refresh(order)
    await session.refresh(order_item)
    
    return {
        "message": "Purchase successful",
        "order_id": order.id,
        "item": listing.title,
        "total": order.total
    }