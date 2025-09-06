from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import Order, OrderItem, CartItem, Listing, User
from app.schemas import OrderOut
from app.auth import get_current_user

router = APIRouter()

@router.post("/orders/checkout", response_model=OrderOut)
async def checkout(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create order from cart items and clear cart."""
    # Get cart items
    result = await session.execute(
        select(CartItem, Listing)
        .join(Listing)
        .where(CartItem.user_id == current_user.id)
    )
    cart_data = result.all()
    
    if not cart_data:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total
    total = sum(cart_item.unit_price * cart_item.qty for cart_item, _ in cart_data)
    
    # Create order
    order = Order(user_id=current_user.id, total=total)
    session.add(order)
    await session.flush()  # Get order ID
    
    # Create order items
    order_items = []
    for cart_item, listing in cart_data:
        order_item = OrderItem(
            order_id=order.id,
            listing_id=cart_item.listing_id,
            title_snapshot=listing.title,
            price_snapshot=cart_item.unit_price,
            qty=cart_item.qty
        )
        session.add(order_item)
        order_items.append(order_item)
    
    # Clear cart
    for cart_item, _ in cart_data:
        await session.delete(cart_item)
    
    await session.commit()
    await session.refresh(order)
    
    # Refresh order items
    for item in order_items:
        await session.refresh(item)
    
    return OrderOut(
        id=order.id,
        user_id=order.user_id,
        total=order.total,
        created_at=order.created_at,
        items=[
            {
                "id": item.id,
                "listing_id": item.listing_id,
                "title_snapshot": item.title_snapshot,
                "price_snapshot": item.price_snapshot,
                "qty": item.qty
            }
            for item in order_items
        ]
    )

@router.get("/orders/mine", response_model=List[OrderOut])
async def get_my_orders(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Get current user's orders."""
    result = await session.execute(
        select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    
    # Get order items for each order
    orders_with_items = []
    for order in orders:
        items_result = await session.execute(
            select(OrderItem).where(OrderItem.order_id == order.id)
        )
        items = items_result.scalars().all()
        
        orders_with_items.append(OrderOut(
            id=order.id,
            user_id=order.user_id,
            total=order.total,
            created_at=order.created_at,
            items=[
                {
                    "id": item.id,
                    "listing_id": item.listing_id,
                    "title_snapshot": item.title_snapshot,
                    "price_snapshot": item.price_snapshot,
                    "qty": item.qty
                }
                for item in items
            ]
        ))
    
    return orders_with_items