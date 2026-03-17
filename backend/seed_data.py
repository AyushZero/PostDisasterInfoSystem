"""
Seed script to populate the database with sample disaster data.
Scenario: Earthquake centered at Kanchipuram, Tamil Nadu.
Run: python seed_data.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement
from app.database import engine, Base, SessionLocal
from app.models import Disaster, Zone, Facility, Alert, AdminUser
from app.auth import hash_password


def seed_database():
    """Populate database with Chennai earthquake sample data."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    if db.query(Disaster).first():
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("Seeding database...")

    # ─── Admin User ──────────────────────────────────────────
    admin = AdminUser(
        username="admin",
        hashed_password=hash_password("admin123"),
        full_name="System Administrator",
    )
    db.add(admin)

    # ─── Disaster: Chennai Earthquake (Kanchipuram epicenter) ──
    # Kanchipuram center: 12.8342, 79.7036
    disaster = Disaster(
        name="Chennai Earthquake 2025",
        disaster_type="earthquake",
        magnitude=6.8,
        affected_region="Kanchipuram, Tamil Nadu",
        status="active",
        description="A 6.8 magnitude earthquake struck near Kanchipuram, approximately 70km southwest of Chennai. Severe damage in Kanchipuram town and surrounding villages. Shaking felt across Chennai metropolitan area.",
        latitude=12.8342,
        longitude=79.7036,
    )
    db.add(disaster)
    db.flush()

    # ─── Severity Zones (irregular, following geography) ──────
    zones_data = [
        {
            "severity": "extreme",
            "label": "Epicenter — Kanchipuram",
            "population_affected": 38000,
            # Irregular polygon around Kanchipuram town center
            "wkt": "POLYGON((79.66 12.81, 79.68 12.79, 79.72 12.78, 79.75 12.80, 79.76 12.84, 79.74 12.87, 79.70 12.88, 79.67 12.86, 79.66 12.81))",
        },
        {
            "severity": "high",
            "label": "Severe — Sriperumbudur corridor",
            "population_affected": 95000,
            # Extends NE towards Sriperumbudur along NH
            "wkt": "POLYGON((79.74 12.87, 79.78 12.85, 79.88 12.90, 79.95 12.95, 79.92 12.98, 79.84 12.96, 79.76 12.92, 79.74 12.87))",
        },
        {
            "severity": "moderate",
            "label": "Moderate — South Chennai",
            "population_affected": 210000,
            # Extends east towards Tambaram / Chromepet
            "wkt": "POLYGON((79.92 12.98, 79.98 12.93, 80.06 12.94, 80.10 12.98, 80.08 13.04, 80.02 13.06, 79.95 13.02, 79.92 12.98))",
        },
        {
            "severity": "low",
            "label": "Minor — North Chennai",
            "population_affected": 450000,
            # Wider Chennai area to the north
            "wkt": "POLYGON((80.08 13.04, 80.14 13.00, 80.22 13.02, 80.28 13.08, 80.26 13.14, 80.18 13.16, 80.10 13.12, 80.08 13.04))",
        },
        {
            "severity": "low",
            "label": "Minor — Vellore direction",
            "population_affected": 60000,
            # Extends NW from epicenter
            "wkt": "POLYGON((79.58 12.86, 79.66 12.81, 79.67 12.86, 79.64 12.94, 79.56 12.96, 79.52 12.92, 79.54 12.88, 79.58 12.86))",
        },
    ]
    for z in zones_data:
        zone = Zone(
            disaster_id=disaster.id,
            severity=z["severity"],
            label=z["label"],
            geometry=WKTElement(z["wkt"], srid=4326),
            population_affected=z["population_affected"],
        )
        db.add(zone)

    # ─── Facilities ──────────────────────────────────────────
    facilities_data = [
        {
            "name": "Kanchipuram Relief Camp",
            "facility_type": "shelter",
            "latitude": 12.8385,
            "longitude": 79.7000,
            "address": "Government Higher Secondary School, Kanchipuram",
            "contact": "+91-44-2722-3100",
            "capacity": 600,
            "current_occupancy": 412,
        },
        {
            "name": "Kanchipuram Government Hospital",
            "facility_type": "hospital",
            "latitude": 12.8310,
            "longitude": 79.7120,
            "address": "Gandhi Road, Kanchipuram",
            "contact": "+91-44-2722-2034",
            "capacity": 300,
            "current_occupancy": 267,
        },
        {
            "name": "Sriperumbudur Community Shelter",
            "facility_type": "shelter",
            "latitude": 12.9585,
            "longitude": 79.9410,
            "address": "Town Hall Complex, Sriperumbudur",
            "contact": "+91-44-2716-3200",
            "capacity": 400,
            "current_occupancy": 285,
        },
        {
            "name": "Chromepet Government Hospital",
            "facility_type": "hospital",
            "latitude": 12.9516,
            "longitude": 80.1413,
            "address": "GST Road, Chromepet, Chennai",
            "contact": "+91-44-2265-0678",
            "capacity": 500,
            "current_occupancy": 380,
        },
        {
            "name": "Tambaram Evacuation Center",
            "facility_type": "evacuation",
            "latitude": 12.9249,
            "longitude": 80.1000,
            "address": "Railway Station Road, Tambaram",
            "contact": "+91-44-2223-9200",
            "capacity": 1200,
            "current_occupancy": 560,
        },
        {
            "name": "Kanchipuram Evacuation Point",
            "facility_type": "evacuation",
            "latitude": 12.8450,
            "longitude": 79.7250,
            "address": "NH 4 Junction, Kanchipuram Outskirts",
            "contact": "+91-44-2722-4500",
            "capacity": 800,
            "current_occupancy": 310,
        },
        {
            "name": "Missing Persons — Kanchipuram",
            "facility_type": "missing_persons",
            "latitude": 12.8360,
            "longitude": 79.7060,
            "address": "District Collectorate, Kanchipuram",
            "contact": "+91-44-2722-5000",
            "capacity": 40,
            "current_occupancy": 18,
        },
        {
            "name": "Chengalpattu District Hospital",
            "facility_type": "hospital",
            "latitude": 12.6921,
            "longitude": 79.9759,
            "address": "NH 45, Chengalpattu",
            "contact": "+91-44-2742-2100",
            "capacity": 250,
            "current_occupancy": 198,
        },
        {
            "name": "Anna Nagar Relief Shelter",
            "facility_type": "shelter",
            "latitude": 13.0850,
            "longitude": 80.2101,
            "address": "Anna Nagar Community Hall, Chennai",
            "contact": "+91-44-2628-1000",
            "capacity": 350,
            "current_occupancy": 120,
        },
        {
            "name": "Guindy Evacuation Hub",
            "facility_type": "evacuation",
            "latitude": 13.0067,
            "longitude": 80.2206,
            "address": "Guindy Industrial Estate, Chennai",
            "contact": "+91-44-2234-5600",
            "capacity": 900,
            "current_occupancy": 240,
        },
    ]
    for f in facilities_data:
        facility = Facility(**f)
        db.add(facility)

    # ─── Alerts ──────────────────────────────────────────────
    alerts_data = [
        {
            "title": "Earthquake: 6.8 Magnitude — Kanchipuram",
            "message": "A 6.8 magnitude earthquake struck near Kanchipuram. All residents in affected zones should evacuate immediately.",
            "severity": "critical",
            "disaster_id": disaster.id,
        },
        {
            "title": "Evacuation Order — Kanchipuram Town",
            "message": "Mandatory evacuation for residents within 10km of epicenter. Report to nearest evacuation point.",
            "severity": "critical",
            "disaster_id": disaster.id,
        },
        {
            "title": "Aftershock Warning — Next 72 Hours",
            "message": "Significant aftershocks expected. Stay in open areas. Do not enter damaged structures.",
            "severity": "warning",
            "disaster_id": disaster.id,
        },
        {
            "title": "MRTS / Metro Services Suspended",
            "message": "Chennai Metro and MRTS services suspended for safety inspections. Use road transport.",
            "severity": "warning",
            "disaster_id": disaster.id,
        },
        {
            "title": "Relief Distribution — Multiple Locations",
            "message": "Food and water at Kanchipuram Relief Camp, Sriperumbudur Shelter, and Tambaram Evacuation Center.",
            "severity": "info",
            "disaster_id": disaster.id,
        },
        {
            "title": "Emergency Helpline — 1070",
            "message": "State disaster helpline active. Report missing persons, request rescue, or get medical assistance.",
            "severity": "info",
            "disaster_id": disaster.id,
        },
    ]
    for a in alerts_data:
        alert = Alert(**a)
        db.add(alert)

    db.commit()
    db.close()
    print("Database seeded successfully!")
    print("  Admin: admin / admin123")
    print(f"  Disaster: Chennai Earthquake 2025 (Kanchipuram epicenter)")
    print(f"  Zones: {len(zones_data)}")
    print(f"  Facilities: {len(facilities_data)}")
    print(f"  Alerts: {len(alerts_data)}")


if __name__ == "__main__":
    seed_database()
