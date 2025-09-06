from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Category schemas
class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    
    class Config:
        from_attributes = True

# Listing schemas
class ListingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    price: float

class ListingOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    price: float
    owner_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Cart schemas
class CartItemCreate(BaseModel):
    listing_id: int
    qty: int

class CartItemUpdate(BaseModel):
    qty: int

class CartItemOut(BaseModel):
    id: int
    listing_id: int
    title: str
    unit_price: float
    qty: int
    line_total: float
    
    class Config:
        from_attributes = True

class CartOut(BaseModel):
    items: List[CartItemOut]
    subtotal: float

# Order schemas
class OrderItemOut(BaseModel):
    id: int
    listing_id: int
    title_snapshot: str
    price_snapshot: float
    qty: int
    
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    user_id: int
    total: float
    created_at: datetime
    items: List[OrderItemOut]
    
    class Config:
        from_attributes = True
        