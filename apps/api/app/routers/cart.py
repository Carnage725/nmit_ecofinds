from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import CartItem, Listing, User
from app.schemas import CartItemCreate, CartItemUpdate, CartItemOut, CartOut
from app.auth import get_current_user

router = APIRouter()

@router.get("/cart", response_model=CartOut)
async def get_cart(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Get current user's cart."""
    result = await session.execute(
        select(CartItem, Listing)
        .join(Listing)
        .where(CartItem.user_id == current_user.id)
    )
    cart_data = result.all()
    
    items = []
    subtotal = 0.0
    
    for cart_item, listing in cart_data:
        line_total = cart_item.unit_price * cart_item.qty
        items.append(CartItemOut(
            id=cart_item.id,
            listing_id=cart_item.listing_id,
            title=listing.title,
            unit_price=cart_item.unit_price,
            qty=cart_item.qty,
            line_total=line_total
        ))
        subtotal += line_total
    
    return CartOut(items=items, subtotal=subtotal)

@router.post("/cart/items", response_model=CartItemOut)
async def add_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Add item to cart."""
    # Validate quantity
    if item_data.qty <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")
    
    # Get listing to verify it exists and get price
    result = await session.execute(select(Listing).where(Listing.id == item_data.listing_id))
    listing = result.scalar_one_or_none()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if item already in cart
    result = await session.execute(
        select(CartItem).where(
            CartItem.user_id == current_user.id,
            CartItem.listing_id == item_data.listing_id
        )
    )
    existing_item = result.scalar_one_or_none()
    
    if existing_item:
        # Update quantity
        existing_item.qty += item_data.qty
        await session.commit()
        await session.refresh(existing_item)
        
        line_total = existing_item.unit_price * existing_item.qty
        return CartItemOut(
            id=existing_item.id,
            listing_id=existing_item.listing_id,
            title=listing.title,
            unit_price=existing_item.unit_price,
            qty=existing_item.qty,
            line_total=line_total
        )
    else:
        # Add new item
        cart_item = CartItem(
            user_id=current_user.id,
            listing_id=item_data.listing_id,
            qty=item_data.qty,
            unit_price=listing.price
        )
        
        session.add(cart_item)
        await session.commit()
        await session.refresh(cart_item)
        
        line_total = cart_item.unit_price * cart_item.qty
        return CartItemOut(
            id=cart_item.id,
            listing_id=cart_item.listing_id,
            title=listing.title,
            unit_price=cart_item.unit_price,
            qty=cart_item.qty,
            line_total=line_total
        )

@router.patch("/cart/items/{item_id}", response_model=CartItemOut)
async def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Update cart item quantity."""
    # Validate quantity
    if item_data.qty <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")
    
    result = await session.execute(
        select(CartItem, Listing)
        .join(Listing)
        .where(CartItem.id == item_id, CartItem.user_id == current_user.id)
    )
    cart_data = result.first()
    
    if not cart_data:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    cart_item, listing = cart_data
    cart_item.qty = item_data.qty
    
    await session.commit()
    await session.refresh(cart_item)
    
    line_total = cart_item.unit_price * cart_item.qty
    return CartItemOut(
        id=cart_item.id,
        listing_id=cart_item.listing_id,
        title=listing.title,
        unit_price=cart_item.unit_price,
        qty=cart_item.qty,
        line_total=line_total
    )

@router.delete("/cart/items/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Remove item from cart."""
    result = await session.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.user_id == current_user.id)
    )
    cart_item = result.scalar_one_or_none()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    await session.delete(cart_item)
    await session.commit()
    
    return {"message": "Item removed from cart"}