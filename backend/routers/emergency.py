from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/emergency", tags=["emergency"])

@router.get("/contacts", response_model=List[schemas.EmergencyContactResponse])
def get_emergency_contacts(category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.EmergencyContact)
    if category:
        query = query.filter(models.EmergencyContact.category == category)
    return query.all()

@router.post("/contacts", response_model=schemas.EmergencyContactResponse)
def create_emergency_contact(contact: schemas.EmergencyContactCreate, db: Session = Depends(get_db)):
    db_contact = models.EmergencyContact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.get("/outbreak_protocol")
def get_outbreak_protocol() -> Dict[str, Any]:
    return {
        "title": "OUTBREAK MODE — Disease Mitigation Protocol",
        "focus_areas": [
            "Exposure Reduction & Personal Physical Distance",
            "N95 / FFP2 Respiratory Protection in Enclosed Spaces",
            "Active Room Ventilation (HVAC filter + HEPA / Cross-breeze)",
            "Isolation Zone setup for symptomatic household members",
            "Hydration & Electrolyte Replacement (ORS)",
            "Monitoring Oxygen Levels (Pulse Oximeter > 94%)"
        ],
        "warning_signs": [
            "Severe shortness of breath or persistent chest pressure",
            "Confusion or inability to wake / stay alert",
            "Bluish lips or face (Cyanosis)",
            "Fever unresponsive to Paracetamol exceeding 39.5°C (103°F)"
        ],
        "prohibited_actions": [
            "Creating or modifying pathogens",
            "Biological experimentation",
            "Intentional disease spread",
            "Ingesting dangerous non-medical industrial chemicals"
        ]
    }

@router.post("/simulate_scenario")
def simulate_what_if_scenario(scenario_name: str, days: int = 3, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    adults = profile.household_adults if profile else 2
    children = profile.household_children if profile else 1

    water_items = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%water%")).all()
    total_water = sum(i.quantity for i in water_items) if water_items else 0.0

    food_items = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%food%")).all()
    total_calories = sum(i.quantity * (i.calories_per_unit or 2000) for i in food_items) if food_items else 0.0

    daily_water_req = (adults * 3.5) + (children * 2.5)
    daily_cal_req = (adults * 2000) + (children * 1500)

    projected_water_left = max(0.0, total_water - (daily_water_req * days))
    projected_cal_left = max(0.0, total_calories - (daily_cal_req * days))

    water_status = "CRITICAL DEFICIT" if projected_water_left == 0 else "SUFFICIENT"
    food_status = "CRITICAL DEFICIT" if projected_cal_left == 0 else "SUFFICIENT"

    return {
        "simulation_notice": "PLANNING SIMULATION — NOT A REAL PREDICTION",
        "scenario": scenario_name,
        "duration_days": days,
        "household_size": adults + children,
        "projected_water_remaining_liters": projected_water_left,
        "projected_food_remaining_calories": projected_cal_left,
        "water_status": water_status,
        "food_status": food_status,
        "recommendations": [
            f"If {scenario_name} persists for {days} days, your household will consume {round(daily_water_req * days, 1)}L water.",
            "Establish secondary water collection before day 2 of disruption.",
            "Verify backup lighting and battery reserves for key communications."
        ]
    }
