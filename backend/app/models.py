from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime, timezone
import enum

from app.database import Base


class DisasterStatus(str, enum.Enum):
    ACTIVE = "active"
    MONITORING = "monitoring"
    RESOLVED = "resolved"


class SeverityLevel(str, enum.Enum):
    EXTREME = "extreme"
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"
    SAFE = "safe"


class FacilityType(str, enum.Enum):
    SHELTER = "shelter"
    HOSPITAL = "hospital"
    EVACUATION = "evacuation"
    MISSING_PERSONS = "missing_persons"


class AlertSeverity(str, enum.Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"


class Disaster(Base):
    __tablename__ = "disasters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    disaster_type = Column(String(100), nullable=False)  # earthquake, flood, cyclone
    magnitude = Column(Float, nullable=True)
    affected_region = Column(String(255), nullable=False)
    status = Column(SQLEnum(DisasterStatus), default=DisasterStatus.ACTIVE)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    zones = relationship("Zone", back_populates="disaster", cascade="all, delete-orphan")


class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    disaster_id = Column(Integer, ForeignKey("disasters.id"), nullable=False)
    severity = Column(SQLEnum(SeverityLevel), nullable=False)
    label = Column(String(255), nullable=True)
    geometry = Column(Geometry("POLYGON", srid=4326), nullable=False)
    population_affected = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    disaster = relationship("Disaster", back_populates="zones")


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    facility_type = Column(SQLEnum(FacilityType), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    contact = Column(String(100), nullable=True)
    capacity = Column(Integer, nullable=True)
    current_occupancy = Column(Integer, default=0)
    is_operational = Column(String(10), default="true")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(SQLEnum(AlertSeverity), default=AlertSeverity.INFO)
    disaster_id = Column(Integer, ForeignKey("disasters.id"), nullable=True)
    is_active = Column(String(10), default="true")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
