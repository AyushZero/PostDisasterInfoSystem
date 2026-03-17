from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape

from app.database import get_db
from app.models import Disaster, Zone
from app.schemas import DisasterResponse, DisasterListResponse, ZoneResponse

router = APIRouter(prefix="/api/disasters", tags=["Disasters"])


def zone_to_response(zone: Zone) -> dict:
    """Convert a Zone model to response dict with GeoJSON geometry."""
    shape = to_shape(zone.geometry)
    coords = list(shape.exterior.coords)
    return {
        "id": zone.id,
        "disaster_id": zone.disaster_id,
        "severity": zone.severity.value if hasattr(zone.severity, 'value') else zone.severity,
        "label": zone.label,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[c[0], c[1]] for c in coords]]
        },
        "population_affected": zone.population_affected,
        "created_at": zone.created_at,
    }


@router.get("", response_model=list[DisasterListResponse])
def list_disasters(
    status: str = None,
    db: Session = Depends(get_db),
):
    """List all disasters, optionally filtered by status."""
    query = db.query(Disaster)
    if status:
        query = query.filter(Disaster.status == status)
    disasters = query.order_by(Disaster.updated_at.desc()).all()
    return disasters


@router.get("/{disaster_id}")
def get_disaster(disaster_id: int, db: Session = Depends(get_db)):
    """Get a single disaster with its severity zones."""
    disaster = db.query(Disaster).filter(Disaster.id == disaster_id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster not found")

    zones_data = [zone_to_response(z) for z in disaster.zones]

    return {
        "id": disaster.id,
        "name": disaster.name,
        "disaster_type": disaster.disaster_type,
        "magnitude": disaster.magnitude,
        "affected_region": disaster.affected_region,
        "status": disaster.status.value if hasattr(disaster.status, 'value') else disaster.status,
        "description": disaster.description,
        "latitude": disaster.latitude,
        "longitude": disaster.longitude,
        "created_at": disaster.created_at,
        "updated_at": disaster.updated_at,
        "zones": zones_data,
    }
