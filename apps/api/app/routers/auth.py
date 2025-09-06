from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_session
from app.models import User
from app.schemas import UserCreate, UserLogin, UserOut, Token
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

@router.post("/auth/register", response_model=Token)
async def register(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    """Register a new user and return access token."""
    # Check if user already exists
    result = await session.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_password
    )
    
    session.add(user)
    await session.commit()
    await session.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/login", response_model=Token)
async def login(
    user_data: UserLogin,
    session: AsyncSession = Depends(get_session)
):
    """Login user and return access token."""
    # Get user by email
    result = await session.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserOut)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user