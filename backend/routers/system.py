from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from llm_provider import OllamaProvider
from rag_engine import OfflineRAGEngine
from calculators import SurvivalCalculators
import os

router = APIRouter(prefix="/api/system", tags=["system"])

KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "knowledge", "curated_handbook")
rag_engine = OfflineRAGEngine(KNOWLEDGE_DIR)
ollama_provider = OllamaProvider()

@router.get("/status", response_model=schemas.SystemStatusResponse)
def get_system_status(db: Session = Depends(get_db)):
    ollama_info = ollama_provider.check_status()
    
    inv_count = db.query(models.InventoryItem).count()
    marker_count = db.query(models.MapMarker).count()
    
    # Calculate preparedness score
    profile = db.query(models.UserProfile).first()
    adults = profile.household_adults if profile else 2
    children = profile.household_children if profile else 1
    elderly = profile.household_elderly if profile else 0

    water_items = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%water%")).all()
    total_water = sum(item.quantity for item in water_items) if water_items else 0.0
    water_res = SurvivalCalculators.calculate_water_iq(total_water, adults, children, elderly)

    food_items = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%food%")).all()
    items_dict = [{"name": i.name, "category": i.category, "quantity": i.quantity, "unit": i.unit, "calories_per_unit": i.calories_per_unit} for i in food_items]
    food_res = SurvivalCalculators.calculate_food_iq(items_dict, adults, children, elderly)

    has_med = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%medical%")).count() > 0
    has_pow = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%power%")).count() > 0
    has_comm = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%comm%")).count() > 0
    has_map = marker_count > 0
    has_san = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%sanitation%")).count() > 0
    has_shelter = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%shelter%")).count() > 0

    scores = SurvivalCalculators.calculate_preparedness_scores(
        water_res["days_remaining"],
        food_res["days_remaining"],
        has_med, has_pow, has_comm, has_map, has_san, has_shelter
    )

    return schemas.SystemStatusResponse(
        is_online=True,
        local_ai_installed=ollama_info.get("installed", False),
        local_ai_status=ollama_info.get("status", "unavailable"),
        active_model=ollama_info.get("active_model", "RuleEngine Fallback"),
        database_ready=True,
        handbook_indexed=len(rag_engine.documents) > 0,
        total_knowledge_articles=len(rag_engine.documents),
        offline_maps_cached=True,
        inventory_items_count=inv_count,
        map_markers_count=marker_count,
        overall_readiness_score=scores["overall_score"]
    )

@router.get("/profile", response_model=schemas.UserProfileResponse)
def get_user_profile(db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        profile = models.UserProfile(
            name="Survivor",
            household_adults=2,
            household_children=1,
            household_elderly=0,
            home_latitude=31.3260,
            home_longitude=75.5762,
            selected_region="Jalandhar District",
            preferred_language="English"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=schemas.UserProfileResponse)
def update_user_profile(profile_data: schemas.UserProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        profile = models.UserProfile(**profile_data.dict())
        db.add(profile)
    else:
        for k, v in profile_data.dict().items():
            setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/solar-iq", response_model=schemas.SolarEnergyIQResponse)
def calculate_solar_iq(req: schemas.SolarEnergyIQRequest):
    return SurvivalCalculators.calculate_solar_energy_iq(
        panel_watts=req.panel_watts,
        sun_hours=req.sun_hours,
        battery_ah=req.battery_ah,
        battery_voltage=req.battery_voltage,
        battery_type=req.battery_type,
        daily_load_wh=req.daily_load_wh
    )

