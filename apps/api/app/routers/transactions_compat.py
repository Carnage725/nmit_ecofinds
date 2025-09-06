from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import Order, OrderItem, User
from app.auth import get_current_user

router = APIRouter()

@router.get("/transactions", response_model=List[Dict[str, Any]])
async def get_transactions(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Get user's transaction history (orders with item details)."""
    # Get user's orders
    orders_result = await session.execute(
        select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    )
    orders = orders_result.scalars().all()
    
    transactions = []
    
    for order in orders:
        # Get order items for this order
        items_result = await session.execute(
            select(OrderItem).where(OrderItem.order_id == order.id)
        )
        order_items = items_result.scalars().all()
        
        transaction = {
            "id": order.id,
            "total": float(order.total),
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "listing_id": item.listing_id,
                    "title": item.title_snapshot,
                    "price": float(item.price_snapshot),
                    "qty": item.qty,
                    "line_total": float(item.price_snapshot * item.qty)
                }
                for item in order_items
            ]
        }
        transactions.append(transaction)
    
    return transactions