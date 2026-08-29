from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/maps", tags=["maps"])

@router.get("/markers", response_model=List[schemas.MapMarkerResponse])
def get_map_markers(marker_type: str = None, db: Session = Depends(get_db)):
    query = db.query(models.MapMarker)
    if marker_type:
        query = query.filter(models.MapMarker.marker_type == marker_type)
    markers = query.all()

    # Apply confidence decay check based on time
    now = datetime.utcnow()
    for m in markers:
        if m.last_verified:
            diff = now - m.last_verified
            if diff > timedelta(hours=48):
                m.confidence = "OLD_INFO"
            elif diff > timedelta(hours=12):
                m.confidence = "RECENTLY_CHECKED"
            else:
                m.confidence = "CONFIRMED"
    return markers

@router.post("/markers", response_model=schemas.MapMarkerResponse)
def create_map_marker(marker: schemas.MapMarkerCreate, db: Session = Depends(get_db)):
    db_marker = models.MapMarker(**marker.dict())
    db_marker.last_verified = datetime.utcnow()
    db.add(db_marker)
    db.commit()
    db.refresh(db_marker)
    return db_marker

@router.delete("/markers/{marker_id}")
def delete_map_marker(marker_id: int, db: Session = Depends(get_db)):
    db_marker = db.query(models.MapMarker).filter(models.MapMarker.id == marker_id).first()
    if not db_marker:
        raise HTTPException(status_code=404, detail="Marker not found")
    db.delete(db_marker)
    db.commit()
    return {"status": "success", "message": "Marker removed"}

@router.post("/mark_location")
def mark_current_location(
    title: str = "Location Checkpoint",
    marker_type: str = "SAFE",
    lat: float = 31.3260,
    lng: float = 75.5762,
    notes: str = "I WAS HERE - Rapid observation log.",
    db: Session = Depends(get_db)
):
    marker = models.MapMarker(
        title=title,
        marker_type=marker_type,
        latitude=lat,
        longitude=lng,
        notes=notes,
        status="CHECKED",
        confidence="CONFIRMED",
        last_verified=datetime.utcnow()
    )
    db.add(marker)
    db.commit()
    db.refresh(marker)
    return {"status": "success", "marker": schemas.MapMarkerResponse.from_orm(marker)}

@router.get("/routes", response_model=List[schemas.MapRouteResponse])
def get_map_routes(db: Session = Depends(get_db)):
    return db.query(models.MapRoute).all()

@router.post("/routes", response_model=schemas.MapRouteResponse)
def create_map_route(route: schemas.MapRouteCreate, db: Session = Depends(get_db)):
    db_route = models.MapRoute(**route.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

@router.get("/regions")
def get_offline_map_regions():
    return [
        {"id": "jalandhar", "name": "Jalandhar District", "size_mb": 42.5, "status": "DOWNLOADED"},
        {"id": "ludhiana", "name": "Ludhiana Region", "size_mb": 58.1, "status": "AVAILABLE"},
        {"id": "amritsar", "name": "Amritsar Zone", "size_mb": 49.3, "status": "AVAILABLE"},
        {"id": "chandigarh", "name": "Chandigarh Capital Area", "size_mb": 34.8, "status": "AVAILABLE"}
    ]
