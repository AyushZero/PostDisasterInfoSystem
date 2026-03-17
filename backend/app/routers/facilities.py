from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import Facility
from app.schemas import FacilityResponse

router = APIRouter(prefix="/api/facilities", tags=["Facilities"])


@router.get("", response_model=list[FacilityResponse])
def list_facilities(
    facility_type: Optional[str] = Query(None, description="Filter by type: shelter, hospital, evacuation, missing_persons"),
    operational: Optional[str] = Query(None, description="Filter by operational status"),
    db: Session = Depends(get_db),
):
    """List all emergency facilities with optional filters."""
    query = db.query(Facility)

    if facility_type:
        query = query.filter(Facility.facility_type == facility_type)
    if operational:
        query = query.filter(Facility.is_operational == operational)

    facilities = query.order_by(Facility.name).all()
    return facilities


@router.get("/{facility_id}", response_model=FacilityResponse)
def get_facility(facility_id: int, db: Session = Depends(get_db)):
    """Get a single facility by ID."""
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility
