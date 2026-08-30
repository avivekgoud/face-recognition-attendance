from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserRole
from ..schemas.auth import UserLogin, Token, UserOut, UserCreate, PasswordChange
from ..services.auth_service import auth_service, get_current_user, require_super_admin
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(payload: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not auth_service.verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    user.last_login = datetime.utcnow()
    db.commit()

    token_str = auth_service.create_access_token(data={
        "sub": user.username,
        "role": user.role.value,
        "id": user.id
    })

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="USER_LOGIN",
        user=user,
        details=f"Successful login for user '{user.username}'",
        ip_address=client_ip
    )

    return Token(
        access_token=token_str,
        role=user.role,
        username=user.username,
        full_name=user.full_name
    )

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=List[UserOut])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.post("/users", response_model=UserOut)
def create_user(
    payload: UserCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_super_admin)
):
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=payload.username,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=auth_service.hash_password(payload.password),
        role=payload.role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="USER_CREATED",
        user=current_user,
        target_type="User",
        target_id=str(new_user.id),
        details=f"Created new user account '{new_user.username}' with role '{new_user.role.value}'",
        ip_address=client_ip
    )

    return new_user

@router.post("/change-password")
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not auth_service.verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid current password")
    
    current_user.hashed_password = auth_service.hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
