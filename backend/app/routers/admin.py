import json
import csv
import io
import ijson
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement

from app.database import get_db
from app.models import Disaster, Zone, Facility, Alert, AdminUser
from app.schemas import (
    LoginRequest, TokenResponse,
    DisasterCreate, DisasterListResponse,
    FacilityCreate, FacilityResponse,
    AlertCreate, AlertResponse,
    UploadResponse,
)
from app.auth import (
    verify_password, create_access_token,
    hash_password, get_current_admin,
)

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# ─── Authentication ──────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def admin_login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate admin and return JWT token."""
    user = db.query(AdminUser).filter(AdminUser.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


# ─── Disaster Management ────────────────────────────────────

@router.post("/disasters", response_model=DisasterListResponse, status_code=201)
def create_disaster(
    data: DisasterCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Create a new disaster entry."""
    disaster = Disaster(**data.model_dump())
    db.add(disaster)
    db.commit()
    db.refresh(disaster)
    return disaster


@router.put("/disasters/{disaster_id}", response_model=DisasterListResponse)
def update_disaster(
    disaster_id: int,
    data: DisasterCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update an existing disaster."""
    disaster = db.query(Disaster).filter(Disaster.id == disaster_id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster not found")
    for key, value in data.model_dump().items():
        setattr(disaster, key, value)
    db.commit()
    db.refresh(disaster)
    return disaster


@router.delete("/disasters/{disaster_id}", status_code=204)
def delete_disaster(
    disaster_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Delete a disaster and its zones."""
    disaster = db.query(Disaster).filter(Disaster.id == disaster_id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster not found")
    db.delete(disaster)
    db.commit()


# ─── Facility Management ────────────────────────────────────

@router.post("/facilities", response_model=FacilityResponse, status_code=201)
def create_facility(
    data: FacilityCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Create a new facility."""
    facility = Facility(**data.model_dump())
    db.add(facility)
    db.commit()
    db.refresh(facility)
    return facility


@router.put("/facilities/{facility_id}", response_model=FacilityResponse)
def update_facility(
    facility_id: int,
    data: FacilityCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update an existing facility."""
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    for key, value in data.model_dump().items():
        setattr(facility, key, value)
    db.commit()
    db.refresh(facility)
    return facility


@router.delete("/facilities/{facility_id}", status_code=204)
def delete_facility(
    facility_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Delete a facility."""
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    db.delete(facility)
    db.commit()


# ─── Alert Management ───────────────────────────────────────

@router.post("/alerts", response_model=AlertResponse, status_code=201)
def create_alert(
    data: AlertCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Create a new alert."""
    alert = Alert(**data.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.put("/alerts/{alert_id}", response_model=AlertResponse)
def update_alert(
    alert_id: int,
    data: AlertCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Update an existing alert."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    for key, value in data.model_dump().items():
        setattr(alert, key, value)
    db.commit()
    db.refresh(alert)
    return alert


@router.delete("/alerts/{alert_id}", status_code=204)
def delete_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Delete an alert."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()


# ─── Data Upload ─────────────────────────────────────────────

@router.post("/upload/facilities", response_model=UploadResponse)
async def upload_facilities(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Upload facilities data via CSV or JSON file incrementally."""
    records_created = 0

    if file.filename.endswith(".json"):
        # Use ijson to parse the JSON file iteratively
        try:
            # We assume the structure is either a list of facilities OR an object with a "facilities" key
            objects = ijson.items(file.file, 'facilities.item')
            # If the wrapper doesn't exist, we fall back to streaming the top-level list
            has_items = False
            for item in objects:
                has_items = True
                facility = Facility(**item)
                db.add(facility)
                records_created += 1
            
            if not has_items:
                # Seek back to start and try parsing as a top-level list
                file.file.seek(0)
                objects = ijson.items(file.file, 'item')
                for item in objects:
                    facility = Facility(**item)
                    db.add(facility)
                    records_created += 1
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")

    elif file.filename.endswith(".csv"):
        # Stream the CSV line by line
        try:
            wrapper = io.TextIOWrapper(file.file, encoding='utf-8')
            reader = csv.DictReader(wrapper)
            for row in reader:
                facility = Facility(
                    name=row["name"],
                    facility_type=row["facility_type"],
                    latitude=float(row["latitude"]),
                    longitude=float(row["longitude"]),
                    address=row.get("address"),
                    contact=row.get("contact"),
                    capacity=int(row["capacity"]) if row.get("capacity") else None,
                )
                db.add(facility)
                records_created += 1
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid CSV format: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Only CSV and JSON files are supported")

    db.commit()
    return {"message": "Facilities uploaded successfully", "records_created": records_created}


@router.post("/upload/alerts", response_model=UploadResponse)
async def upload_alerts(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    """Upload alerts data via JSON file incrementally."""
    records_created = 0
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Only JSON files are supported for alerts")

    try:
        objects = ijson.items(file.file, 'alerts.item')
        has_items = False
        for item in objects:
            has_items = True
            alert = Alert(**item)
            db.add(alert)
            records_created += 1
            
        if not has_items:
            file.file.seek(0)
            objects = ijson.items(file.file, 'item')
            for item in objects:
                alert = Alert(**item)
                db.add(alert)
                records_created += 1
                
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")

    db.commit()
    return {"message": "Alerts uploaded successfully", "records_created": records_created}
