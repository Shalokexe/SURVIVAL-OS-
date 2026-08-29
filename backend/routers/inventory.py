from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime
from database import get_db
import models
import schemas
from calculators import SurvivalCalculators

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

ESSENTIAL_CATEGORIES = {
    "water": "Drinking water",
    "food": "Shelf-stable food",
    "medical": "Medical supplies",
    "power": "Backup power or lighting",
    "sanitation": "Sanitation supplies",
}

@router.get("/items", response_model=List[schemas.InventoryItemResponse])
def get_inventory_items(category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.InventoryItem)
    if category:
        query = query.filter(models.InventoryItem.category.ilike(f"%{category}%"))
    return query.all()

@router.get("/alerts", response_model=schemas.InventoryAlertsResponse)
def get_inventory_alerts(db: Session = Depends(get_db)):
    today = date.today()
    soon_limit = 30
    alerts = []
    expired_count = 0
    expiring_soon_count = 0

    items = db.query(models.InventoryItem).all()
    present_categories = {item.category.lower() for item in items if item.quantity > 0}

    for item in items:
        if item.expiration_date:
            try:
                expiry = date.fromisoformat(item.expiration_date)
                days_until_expiry = (expiry - today).days
            except ValueError:
                continue

            if days_until_expiry < 0:
                expired_count += 1
                alerts.append(schemas.InventoryAlert(
                    type="expired", severity="critical", item_id=item.id,
                    item_name=item.name, message=f"{item.name} expired {abs(days_until_expiry)} days ago.",
                    days_until_expiry=days_until_expiry
                ))
            elif days_until_expiry <= soon_limit:
                expiring_soon_count += 1
                alerts.append(schemas.InventoryAlert(
                    type="expiring_soon", severity="warning", item_id=item.id,
                    item_name=item.name, message=f"{item.name} expires in {days_until_expiry} days.",
                    days_until_expiry=days_until_expiry
                ))

    for category, label in ESSENTIAL_CATEGORIES.items():
        if not any(category in present_category for present_category in present_categories):
            alerts.append(schemas.InventoryAlert(
                type="shortage", severity="critical", message=f"No {label.lower()} recorded in inventory."
            ))

    alerts.sort(key=lambda alert: (0 if alert.severity == "critical" else 1, alert.type, alert.item_name or ""))
    return schemas.InventoryAlertsResponse(
        generated_at=datetime.utcnow(),
        expired_count=expired_count,
        expiring_soon_count=expiring_soon_count,
        shortage_count=sum(1 for alert in alerts if alert.type == "shortage"),
        alerts=alerts
    )

@router.post("/items", response_model=schemas.InventoryItemResponse)
def add_inventory_item(item: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    db_item = models.InventoryItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/items/{item_id}", response_model=schemas.InventoryItemResponse)
def update_inventory_item(item_id: int, item: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/items/{item_id}")
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"status": "success", "message": "Item deleted"}

@router.get("/water_iq", response_model=schemas.WaterIQResponse)
def get_water_iq(db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    adults = profile.household_adults if profile else 2
    children = profile.household_children if profile else 1
    elderly = profile.household_elderly if profile else 0

    water_items = db.query(models.InventoryItem).filter(models.InventoryItem.category.ilike("%water%")).all()
    total_liters = sum(item.quantity for item in water_items) if water_items else 0.0

    res = SurvivalCalculators.calculate_water_iq(total_liters, adults, children, elderly)
    return schemas.WaterIQResponse(**res)

@router.get("/food_iq", response_model=schemas.FoodIQResponse)
def get_food_iq(db: Session = Depends(get_db)):
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

    res = SurvivalCalculators.calculate_food_iq(items_dict, adults, children, elderly)
    return schemas.FoodIQResponse(**res)

@router.get("/substitute")
def get_substitution(missing_item: str):
    return SurvivalCalculators.get_resource_substitution(missing_item)
