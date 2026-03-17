from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import Alert
from app.schemas import AlertResponse

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("", response_model=list[AlertResponse])
def list_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity: critical, warning, info"),
    active_only: bool = Query(True, description="Return only active alerts"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List alerts, most recent first."""
    query = db.query(Alert)

    if active_only:
        query = query.filter(Alert.is_active == "true")
    if severity:
        query = query.filter(Alert.severity == severity)

    alerts = query.order_by(Alert.created_at.desc()).limit(limit).all()
    return alerts
