from typing import Dict, Any, List
from sqlalchemy.orm import Session
import models
from calculators import SurvivalCalculators
from rag_engine import OfflineRAGEngine
import os

class ToolRegistry:
    def __init__(self, rag_engine: OfflineRAGEngine):
        self.rag_engine = rag_engine

    def calculate_water(self, db: Session) -> Dict[str, Any]:
        profile = db.query(models.UserProfile).first()
        adults = profile.household_adults if profile else 2
        children = profile.household_children if profile else 1
        elderly = profile.household_elderly if profile else 0

        water_items = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%water%")).all()
        total_liters = sum(item.quantity for item in water_items) if water_items else 0.0

        return SurvivalCalculators.calculate_water_iq(total_liters, adults, children, elderly)

    def calculate_food(self, db: Session) -> Dict[str, Any]:
        profile = db.query(models.UserProfile).first()
        adults = profile.household_adults if profile else 2
        children = profile.household_children if profile else 1
        elderly = profile.household_elderly if profile else 0

        food_items = db.query(models.InventoryItem).filter(
            (models.InventoryItem.category.ilike("%food%")) | 
            (models.InventoryItem.category.ilike("%grain%")) |
            (models.InventoryItem.category.ilike("%can%"))
        ).all()
        items_dict = [{"name": i.name, "category": i.category, "quantity": i.quantity, "unit": i.unit, "calories_per_unit": i.calories_per_unit} for i in food_items]

        return SurvivalCalculators.calculate_food_iq(items_dict, adults, children, elderly)

    def get_resource_substitution(self, missing_item: str) -> Dict[str, Any]:
        return SurvivalCalculators.get_resource_substitution(missing_item)

    def search_knowledge(self, query: str) -> List[Dict[str, Any]]:
        return self.rag_engine.search(query, top_k=3)

    def check_inventory(self, db: Session, category: str = None) -> List[Dict[str, Any]]:
        query = db.query(models.InventoryItem)
        if category:
            query = query.filter(models.InventoryItem.category.ilike(f"%{category}%"))
        items = query.all()
        return [{"id": i.id, "name": i.name, "category": i.category, "quantity": i.quantity, "unit": i.unit} for i in items]

    def find_saved_markers(self, db: Session, marker_type: str = None) -> List[Dict[str, Any]]:
        query = db.query(models.MapMarker)
        if marker_type:
            query = query.filter(models.MapMarker.marker_type.ilike(f"%{marker_type}%"))
        markers = query.all()
        return [{
            "id": m.id,
            "title": m.title,
            "marker_type": m.marker_type,
            "latitude": m.latitude,
            "longitude": m.longitude,
            "status": m.status,
            "confidence": m.confidence,
            "notes": m.notes,
            "last_verified": m.last_verified.strftime("%Y-%m-%d %H:%M") if m.last_verified else None
        } for m in markers]

    def calculate_readiness(self, db: Session) -> Dict[str, float]:
        water_res = self.calculate_water(db)
        food_res = self.calculate_food(db)
        
        has_med = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%medical%")).count() > 0
        has_pow = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%power%")).count() > 0
        has_comm = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%comm%")).count() > 0
        has_map = db.query(models.MapMarker).count() > 0
        has_san = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%sanitation%")).count() > 0
        has_shelter = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%shelter%")).count() > 0

        return SurvivalCalculators.calculate_preparedness_scores(
            water_res["days_remaining"],
            food_res["days_remaining"],
            has_med, has_pow, has_comm, has_map, has_san, has_shelter
        )
