"""
Seed script to populate the database with realistic sample disaster data.
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
    """Populate database with sample data."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if already seeded
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

    # ─── Disaster: Gujarat Earthquake ────────────────────────
    disaster = Disaster(
        name="Gujarat Earthquake 2025",
        disaster_type="earthquake",
        magnitude=7.2,
        affected_region="Gujarat, India",
        status="active",
        description="A major earthquake struck the Kutch region of Gujarat, causing widespread damage to infrastructure and displacing thousands of residents. Emergency services are actively responding.",
        latitude=23.2420,
        longitude=69.6669,
    )
    db.add(disaster)
    db.flush()

    # ─── Severity Zones ─────────────────────────────────────
    zones_data = [
        {
            "severity": "extreme",
            "label": "Epicenter Zone - Bhuj",
            "population_affected": 45000,
            "wkt": "POLYGON((69.60 23.20, 69.75 23.20, 69.75 23.30, 69.60 23.30, 69.60 23.20))",
        },
        {
            "severity": "high",
            "label": "High Risk - Anjar Region",
            "population_affected": 78000,
            "wkt": "POLYGON((69.50 23.10, 69.85 23.10, 69.85 23.35, 69.50 23.35, 69.50 23.10))",
        },
        {
            "severity": "moderate",
            "label": "Moderate Risk - Gandhidham",
            "population_affected": 120000,
            "wkt": "POLYGON((69.35 23.00, 70.00 23.00, 70.00 23.45, 69.35 23.45, 69.35 23.00))",
        },
        {
            "severity": "low",
            "label": "Low Risk - Outer Region",
            "population_affected": 250000,
            "wkt": "POLYGON((69.15 22.80, 70.20 22.80, 70.20 23.60, 69.15 23.60, 69.15 22.80))",
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
            "name": "Bhuj Relief Camp",
            "facility_type": "shelter",
            "latitude": 23.2533,
            "longitude": 69.6692,
            "address": "Near Jubilee Ground, Bhuj, Gujarat",
            "contact": "+91-2832-250100",
            "capacity": 500,
            "current_occupancy": 342,
        },
        {
            "name": "G.K. General Hospital",
            "facility_type": "hospital",
            "latitude": 23.2420,
            "longitude": 69.6520,
            "address": "Hospital Road, Bhuj, Gujarat",
            "contact": "+91-2832-220034",
            "capacity": 200,
            "current_occupancy": 187,
        },
        {
            "name": "Anjar Community Shelter",
            "facility_type": "shelter",
            "latitude": 23.1140,
            "longitude": 70.0245,
            "address": "Government School Complex, Anjar",
            "contact": "+91-2836-243200",
            "capacity": 300,
            "current_occupancy": 215,
        },
        {
            "name": "Gandhidham Civil Hospital",
            "facility_type": "hospital",
            "latitude": 23.0753,
            "longitude": 70.1337,
            "address": "Sector 1, Gandhidham, Gujarat",
            "contact": "+91-2836-220678",
            "capacity": 350,
            "current_occupancy": 290,
        },
        {
            "name": "Bhuj Evacuation Point A",
            "facility_type": "evacuation",
            "latitude": 23.2610,
            "longitude": 69.6750,
            "address": "National Highway 8A, Bhuj Outskirts",
            "contact": "+91-2832-250200",
            "capacity": 1000,
            "current_occupancy": 450,
        },
        {
            "name": "Madhapar Evacuation Center",
            "facility_type": "evacuation",
            "latitude": 23.2200,
            "longitude": 69.7100,
            "address": "Madhapar Village, Kutch District",
            "contact": "+91-2832-287600",
            "capacity": 600,
            "current_occupancy": 180,
        },
        {
            "name": "Missing Persons Center - Bhuj",
            "facility_type": "missing_persons",
            "latitude": 23.2490,
            "longitude": 69.6600,
            "address": "District Collectorate, Bhuj",
            "contact": "+91-2832-250300",
            "capacity": 50,
            "current_occupancy": 12,
        },
        {
            "name": "Kutch Medical Center",
            "facility_type": "hospital",
            "latitude": 23.2350,
            "longitude": 69.6800,
            "address": "Mirzapur Road, Bhuj, Gujarat",
            "contact": "+91-2832-256789",
            "capacity": 150,
            "current_occupancy": 134,
        },
        {
            "name": "Rapar Relief Shelter",
            "facility_type": "shelter",
            "latitude": 23.5726,
            "longitude": 70.1110,
            "address": "Government Warehouse, Rapar, Kutch",
            "contact": "+91-2839-222100",
            "capacity": 400,
            "current_occupancy": 278,
        },
        {
            "name": "Bhachau Evacuation Hub",
            "facility_type": "evacuation",
            "latitude": 23.2980,
            "longitude": 70.3430,
            "address": "Railway Station Road, Bhachau",
            "contact": "+91-2837-222500",
            "capacity": 800,
            "current_occupancy": 320,
        },
    ]
    for f in facilities_data:
        facility = Facility(**f)
        db.add(facility)

    # ─── Alerts ──────────────────────────────────────────────
    alerts_data = [
        {
            "title": "EARTHQUAKE ALERT: 7.2 Magnitude",
            "message": "A major earthquake of magnitude 7.2 has struck the Kutch region. All residents in the affected zone are urged to move to designated evacuation points immediately.",
            "severity": "critical",
            "disaster_id": disaster.id,
        },
        {
            "title": "Evacuation Order - Bhuj City",
            "message": "Mandatory evacuation ordered for all residents within 5km of the epicenter. Report to nearest evacuation point with essential belongings only.",
            "severity": "critical",
            "disaster_id": disaster.id,
        },
        {
            "title": "Aftershock Warning",
            "message": "Strong aftershocks expected in the next 48 hours. Stay away from damaged buildings and infrastructure. Keep emergency supplies ready.",
            "severity": "warning",
            "disaster_id": disaster.id,
        },
        {
            "title": "Relief Supplies Distribution",
            "message": "Food, water, and medical supplies being distributed at Bhuj Relief Camp and Anjar Community Shelter. Bring identification documents if available.",
            "severity": "info",
            "disaster_id": disaster.id,
        },
        {
            "title": "Road Closures - NH8A",
            "message": "National Highway 8A is partially closed between Bhuj and Anjar due to structural damage. Use alternative routes via Gandhidham.",
            "severity": "warning",
            "disaster_id": disaster.id,
        },
        {
            "title": "Emergency Helpline Active",
            "message": "Disaster management helpline is active at 1070. Report missing persons, request medical assistance, or get evacuation guidance.",
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
    print("  Admin credentials: admin / admin123")
    print(f"  Disaster: Gujarat Earthquake 2025")
    print(f"  Zones: {len(zones_data)}")
    print(f"  Facilities: {len(facilities_data)}")
    print(f"  Alerts: {len(alerts_data)}")


if __name__ == "__main__":
    seed_database()
