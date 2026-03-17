from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ─── Disaster Schemas ────────────────────────────────────────

class ZoneBase(BaseModel):
    severity: str
    label: Optional[str] = None
    geometry: dict  # GeoJSON polygon
    population_affected: Optional[int] = None


class ZoneCreate(ZoneBase):
    disaster_id: int


class ZoneResponse(ZoneBase):
    id: int
    disaster_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DisasterBase(BaseModel):
    name: str
    disaster_type: str
    magnitude: Optional[float] = None
    affected_region: str
    status: str = "active"
    description: Optional[str] = None
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)


class DisasterCreate(DisasterBase):
    pass


class DisasterResponse(DisasterBase):
    id: int
    created_at: datetime
    updated_at: datetime
    zones: list[ZoneResponse] = []

    class Config:
        from_attributes = True


class DisasterListResponse(DisasterBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Facility Schemas ────────────────────────────────────────

class FacilityBase(BaseModel):
    name: str
    facility_type: str
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    address: Optional[str] = None
    contact: Optional[str] = None
    capacity: Optional[int] = None
    current_occupancy: int = 0
    is_operational: str = "true"


class FacilityCreate(FacilityBase):
    pass


class FacilityResponse(FacilityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Alert Schemas ───────────────────────────────────────────

class AlertBase(BaseModel):
    title: str
    message: str
    severity: str = "info"
    disaster_id: Optional[int] = None
    is_active: str = "true"


class AlertCreate(AlertBase):
    pass


class AlertResponse(AlertBase):
    id: int
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Auth Schemas ────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserCreate(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None


class AdminUserResponse(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Upload Schema ───────────────────────────────────────────

class UploadResponse(BaseModel):
    message: str
    records_created: int
