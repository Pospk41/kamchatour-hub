from datetime import datetime, timedelta
import os
from typing import Annotated, Optional, Literal

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt import InvalidTokenError
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    JSON,
    Text,
    UniqueConstraint,
    CheckConstraint,
    and_,
    or_,
    func,
    desc,
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from passlib.context import CryptContext


SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(320), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False)  # 'traveler' | 'operator' | 'guide' | 'admin'
    display_name = Column(String(120), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    company_name = Column(String(200), nullable=True)  # for operators
    license_number = Column(String(100), nullable=True)  # for operators
    preferences = Column(JSON, nullable=True)  # for travelers
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    average_rating = Column(Float, default=0.0, nullable=False)
    ratings_count = Column(Integer, default=0, nullable=False)
    eco_points_balance = Column(Integer, default=0, nullable=False)

    given_ratings = relationship("Rating", back_populates="rater", foreign_keys="Rating.rater_id")
    received_ratings = relationship("Rating", back_populates="ratee", foreign_keys="Rating.ratee_id")
    eco_ledger = relationship("EcoPointLedger", back_populates="user")
    boosts = relationship("Boost", back_populates="user")


class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True)
    rater_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    ratee_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("score >= 1 AND score <= 5", name="score_between_1_5"),
        UniqueConstraint("rater_id", "ratee_id", name="uniq_rater_ratee"),
    )

    rater = relationship("User", foreign_keys=[rater_id], back_populates="given_ratings")
    ratee = relationship("User", foreign_keys=[ratee_id], back_populates="received_ratings")


class EcoPointLedger(Base):
    __tablename__ = "eco_point_ledger"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    delta = Column(Integer, nullable=False)  # can be positive or negative
    reason = Column(String(200), nullable=False)
    meta = Column(JSON, nullable=True)
    balance_after = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="eco_ledger")


class Boost(Base):
    __tablename__ = "boosts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    boost_type = Column(String(50), nullable=False)  # 'visibility' | 'badge' | 'priority' | ...
    level = Column(Integer, nullable=False, default=1)
    start_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_at = Column(DateTime, nullable=True)
    meta = Column(JSON, nullable=True)

    user = relationship("User", back_populates="boosts")


class Tour(Base):
    __tablename__ = "tours"
    id = Column(Integer, primary_key=True)
    operator_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, default=0.0)
    currency = Column(String(8), nullable=False, default="RUB")
    duration_hours = Column(Integer, nullable=True)
    difficulty = Column(String(50), nullable=True)
    location = Column(JSON, nullable=True)  # {city,country,lat,lng}
    images = Column(JSON, nullable=True)  # [urls]
    is_active = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class GuideActivity(Base):
    __tablename__ = "guide_activities"
    id = Column(Integer, primary_key=True)
    guide_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    duration_hours = Column(Integer, nullable=True)
    tags = Column(JSON, nullable=True)  # [strings]
    is_active = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


RoleLiteral = Literal["traveler", "operator", "guide", "admin"]


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=2, max_length=120)
    role: RoleLiteral
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    company_name: Optional[str] = None
    license_number: Optional[str] = None
    preferences: Optional[dict] = None


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserPublic(BaseModel):
    id: int
    email: EmailStr
    display_name: str
    role: RoleLiteral
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    company_name: Optional[str] = None
    license_number: Optional[str] = None
    preferences: Optional[dict] = None
    average_rating: float
    ratings_count: int
    eco_points_balance: int

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    company_name: Optional[str] = None
    license_number: Optional[str] = None
    preferences: Optional[dict] = None


class RatingCreate(BaseModel):
    ratee_id: int
    score: int = Field(ge=1, le=5)
    comment: Optional[str] = Field(default=None, max_length=2000)


class EcoEarnSpend(BaseModel):
    amount: int = Field(gt=0)
    reason: str = Field(min_length=2, max_length=200)
    meta: Optional[dict] = None


class BoostCreate(BaseModel):
    boost_type: str
    level: int = Field(ge=1, le=10)
    duration_hours: Optional[int] = Field(default=None, ge=1, le=24 * 90)
    meta: Optional[dict] = None


class BoostPublic(BaseModel):
    id: int
    boost_type: str
    level: int
    start_at: datetime
    end_at: Optional[datetime]
    meta: Optional[dict]

    model_config = ConfigDict(from_attributes=True)


class TourCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: Optional[str] = None
    price: float = Field(ge=0)
    currency: str = Field(default="RUB", min_length=3, max_length=8)
    duration_hours: Optional[int] = Field(default=None, ge=1, le=24*30)
    difficulty: Optional[str] = None
    location: Optional[dict] = None
    images: Optional[list[str]] = None


class TourPublic(BaseModel):
    id: int
    operator_id: int
    title: str
    description: Optional[str]
    price: float
    currency: str
    duration_hours: Optional[int]
    difficulty: Optional[str]
    location: Optional[dict]
    images: Optional[list[str]]
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GuideActivityCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    duration_hours: Optional[int] = Field(default=None, ge=1, le=24*30)
    tags: Optional[list[str]] = None


class GuideActivityPublic(BaseModel):
    id: int
    guide_id: int
    title: str
    description: Optional[str]
    price: Optional[float]
    duration_hours: Optional[int]
    tags: Optional[list[str]]
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = db.get(User, int(user_id))
    if user is None or not user.is_active:
        raise credentials_exception
    return user


def require_role(required: RoleLiteral):
    async def dependency(current_user: Annotated[User, Depends(get_current_user)]) -> User:
        if current_user.role != required:
            raise HTTPException(status_code=403, detail="Insufficient role")
        return current_user

    return dependency


app = FastAPI(title="Travel AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.post("/auth/signup", response_model=UserPublic)
def signup(user_in: UserCreate, db: Annotated[Session, Depends(get_db)]):
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if user_in.role not in ("traveler", "operator", "guide", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
        display_name=user_in.display_name,
        avatar_url=user_in.avatar_url,
        bio=user_in.bio,
        company_name=user_in.company_name,
        license_number=user_in.license_number,
        preferences=user_in.preferences,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=Token)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[Session, Depends(get_db)],
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=UserPublic)
def read_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@app.patch("/me", response_model=UserPublic)
def update_me(
    updates: UserUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    if updates.display_name is not None:
        current_user.display_name = updates.display_name
    if updates.avatar_url is not None:
        current_user.avatar_url = updates.avatar_url
    if updates.bio is not None:
        current_user.bio = updates.bio
    if current_user.role == "operator":
        if updates.company_name is not None:
            current_user.company_name = updates.company_name
        if updates.license_number is not None:
            current_user.license_number = updates.license_number
    if current_user.role == "traveler":
        if updates.preferences is not None:
            current_user.preferences = updates.preferences
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@app.get("/users/{user_id}", response_model=UserPublic)
def get_user(user_id: int, db: Annotated[Session, Depends(get_db)]):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users", response_model=list[UserPublic])
def list_users(role: Optional[RoleLiteral] = None, db: Session = Depends(get_db)):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    return q.order_by(User.created_at.desc()).limit(100).all()


# Ratings

def _recompute_user_rating(db: Session, user_id: int) -> None:
    stats = db.query(func.count(Rating.id), func.avg(Rating.score)).filter(Rating.ratee_id == user_id).one()
    count, avg = stats
    user = db.get(User, user_id)
    if user is None:
        return
    user.ratings_count = int(count or 0)
    user.average_rating = float(avg or 0.0)
    db.add(user)
    db.commit()


@app.post("/ratings")
def create_or_update_rating(
    rating_in: RatingCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    if rating_in.ratee_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot rate yourself")
    ratee = db.get(User, rating_in.ratee_id)
    if not ratee:
        raise HTTPException(status_code=404, detail="Ratee not found")
    if current_user.role == ratee.role:
        raise HTTPException(status_code=403, detail="Cannot rate same role")

    existing = db.query(Rating).filter(
        and_(Rating.rater_id == current_user.id, Rating.ratee_id == ratee.id)
    ).first()
    if existing:
        existing.score = rating_in.score
        existing.comment = rating_in.comment
        db.add(existing)
        db.commit()
    else:
        r = Rating(rater_id=current_user.id, ratee_id=ratee.id, score=rating_in.score, comment=rating_in.comment)
        db.add(r)
        db.commit()
    _recompute_user_rating(db, ratee.id)
    return {"ok": True}


@app.get("/ratings/{user_id}")
def get_user_rating(user_id: int, db: Annotated[Session, Depends(get_db)]):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user.id,
        "average_rating": user.average_rating,
        "ratings_count": user.ratings_count,
    }


# Eco Points

def _apply_eco_points(db: Session, user: User, delta: int, reason: str, meta: Optional[dict]):
    new_balance = user.eco_points_balance + delta
    if new_balance < 0:
        raise HTTPException(status_code=400, detail="Insufficient eco points")
    user.eco_points_balance = new_balance
    entry = EcoPointLedger(
        user_id=user.id, delta=delta, reason=reason, meta=meta, balance_after=new_balance
    )
    db.add_all([user, entry])
    db.commit()


@app.post("/eco/earn")
def eco_earn(
    payload: EcoEarnSpend,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    _apply_eco_points(db, current_user, payload.amount, payload.reason, payload.meta)
    return {"balance": current_user.eco_points_balance}


@app.post("/eco/spend")
def eco_spend(
    payload: EcoEarnSpend,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    _apply_eco_points(db, current_user, -payload.amount, payload.reason, payload.meta)
    return {"balance": current_user.eco_points_balance}


@app.get("/eco/ledger")
def eco_ledger(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    items = (
        db.query(EcoPointLedger)
        .filter(EcoPointLedger.user_id == current_user.id)
        .order_by(EcoPointLedger.created_at.desc())
        .limit(200)
        .all()
    )
    return [
        {
            "id": it.id,
            "delta": it.delta,
            "reason": it.reason,
            "meta": it.meta,
            "balance_after": it.balance_after,
            "created_at": it.created_at,
        }
        for it in items
    ]


# Boosts

@app.post("/boosts", response_model=BoostPublic)
def create_boost(
    payload: BoostCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    start_at = datetime.utcnow()
    end_at = None
    if payload.duration_hours:
        end_at = start_at + timedelta(hours=payload.duration_hours)
    b = Boost(
        user_id=current_user.id,
        boost_type=payload.boost_type,
        level=payload.level,
        start_at=start_at,
        end_at=end_at,
        meta=payload.meta,
    )
    db.add(b)
    db.commit()
    db.refresh(b)
    return b


@app.get("/boosts/my", response_model=list[BoostPublic])
def list_my_boosts(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    now = datetime.utcnow()
    q = db.query(Boost).filter(Boost.user_id == current_user.id)
    q = q.filter(
        or_(
            Boost.end_at == None,  # noqa: E711
            Boost.end_at > now,
        )
    )
    return q.order_by(Boost.start_at.desc()).all()


# Cabinet summary

@app.get("/cabinet/summary")
def cabinet_summary(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    now = datetime.utcnow()
    active_boosts = (
        db.query(Boost)
        .filter(Boost.user_id == current_user.id)
        .filter(or_(Boost.end_at == None, Boost.end_at > now))  # noqa: E711
        .order_by(Boost.start_at.desc())
        .all()
    )
    recent_eco = (
        db.query(EcoPointLedger)
        .filter(EcoPointLedger.user_id == current_user.id)
        .order_by(EcoPointLedger.created_at.desc())
        .limit(10)
        .all()
    )
    return {
        "user": UserPublic.model_validate(current_user),
        "active_boosts": [BoostPublic.model_validate(b) for b in active_boosts],
        "recent_eco": [
            {
                "id": it.id,
                "delta": it.delta,
                "reason": it.reason,
                "meta": it.meta,
                "balance_after": it.balance_after,
                "created_at": it.created_at,
            }
            for it in recent_eco
        ],
    }


# Operator tours

@app.post("/operator/tours", response_model=TourPublic)
def operator_create_tour(
    payload: TourCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role("operator"))],
):
    tour = Tour(
        operator_id=current_user.id,
        title=payload.title,
        description=payload.description,
        price=payload.price,
        currency=payload.currency,
        duration_hours=payload.duration_hours,
        difficulty=payload.difficulty,
        location=payload.location,
        images=payload.images,
        is_active=False,
    )
    db.add(tour)
    db.commit()
    db.refresh(tour)
    return tour


@app.get("/operator/tours", response_model=list[TourPublic])
def operator_list_tours(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role("operator"))],
):
    return (
        db.query(Tour)
        .filter(Tour.operator_id == current_user.id)
        .order_by(Tour.created_at.desc())
        .all()
    )


@app.post("/operator/tours/{tour_id}/publish", response_model=TourPublic)
def operator_publish_tour(
    tour_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role("operator"))],
):
    tour = db.get(Tour, tour_id)
    if not tour or tour.operator_id != current_user.id:
        raise HTTPException(status_code=404, detail="Tour not found")
    tour.is_active = True
    db.add(tour)
    db.commit()
    db.refresh(tour)
    return tour


# Guide activities

@app.post("/guide/activities", response_model=GuideActivityPublic)
def guide_create_activity(
    payload: GuideActivityCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role("guide"))],
):
    activity = GuideActivity(
        guide_id=current_user.id,
        title=payload.title,
        description=payload.description,
        price=payload.price,
        duration_hours=payload.duration_hours,
        tags=payload.tags,
        is_active=False,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


@app.get("/guide/activities", response_model=list[GuideActivityPublic])
def guide_list_activities(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role("guide"))],
):
    return (
        db.query(GuideActivity)
        .filter(GuideActivity.guide_id == current_user.id)
        .order_by(GuideActivity.created_at.desc())
        .all()
    )


@app.post("/guide/activities/{activity_id}/publish", response_model=GuideActivityPublic)
def guide_publish_activity(
    activity_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_role("guide"))],
):
    activity = db.get(GuideActivity, activity_id)
    if not activity or activity.guide_id != current_user.id:
        raise HTTPException(status_code=404, detail="Activity not found")
    activity.is_active = True
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


# Public storefront

@app.get("/public/tours", response_model=list[TourPublic])
def public_list_tours(db: Annotated[Session, Depends(get_db)], limit: int = 100, q: Optional[str] = None):
    query = db.query(Tour).filter(Tour.is_active == True)  # noqa: E712
    if q:
        query = query.filter(Tour.title.ilike(f"%{q}%"))
    return query.order_by(Tour.created_at.desc()).limit(min(max(limit, 1), 500)).all()


@app.get("/public/activities", response_model=list[GuideActivityPublic])
def public_list_activities(db: Annotated[Session, Depends(get_db)], limit: int = 100, q: Optional[str] = None):
    query = db.query(GuideActivity).filter(GuideActivity.is_active == True)  # noqa: E712
    if q:
        query = query.filter(GuideActivity.title.ilike(f"%{q}%"))
    return query.order_by(GuideActivity.created_at.desc()).limit(min(max(limit, 1), 500)).all()


# Discover counterpart users

@app.get("/discover")
def discover(
    role: Optional[RoleLiteral] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_role: RoleLiteral
    if role is not None:
        target_role = role
    else:
        target_role = "operator" if current_user.role == "traveler" else "traveler"

    active_boosts_sq = (
        db.query(Boost.user_id.label("user_id"), func.coalesce(func.sum(Boost.level), 0).label("boost_score"))
        .group_by(Boost.user_id)
        .subquery()
    )

    boost_score_expr = func.coalesce(active_boosts_sq.c.boost_score, 0)
    rows = (
        db.query(
            User,
            boost_score_expr.label("boost_score"),
        )
        .outerjoin(active_boosts_sq, User.id == active_boosts_sq.c.user_id)
        .filter(User.role == target_role)
        .order_by(
            desc(boost_score_expr),
            desc(User.average_rating),
            desc(User.ratings_count),
            desc(User.created_at),
        )
        .limit(min(max(limit, 1), 200))
        .all()
    )

    return [
        {"user": UserPublic.model_validate(u), "boost_score": int(bs or 0)} for (u, bs) in rows
    ]


@app.get("/healthz")
def healthcheck():
    return {"status": "ok"}