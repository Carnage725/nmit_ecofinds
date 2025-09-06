from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import Category
from app.schemas import CategoryOut

router = APIRouter()

@router.get("/categories", response_model=List[CategoryOut])
async def get_categories(session: AsyncSession = Depends(get_session)):
    """Get all categories."""
    result = await session.execute(select(Category))
    categories = result.scalars().all()
    return categories