from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserProfileBase(BaseModel):
    name: str = "Survivor"
    household_adults: int = 2
    household_children: int = 1
    household_elderly: int = 0
    household_pets: int = 0
    home_latitude: Optional[float] = 31.3260
    home_longitude: Optional[float] = 75.5762
    selected_region: str = "Jalandhar / Punjab"
    preferred_language: str = "English"
    offline_mode_override: bool = False

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class InventoryItemBase(BaseModel):
    category: str
    name: str
    quantity: float
    unit: str = "pcs"
    calories_per_unit: float = 0.0
    expiration_date: Optional[str] = None
    location_note: str = "Shelter Pantry"
    is_essential: bool = True

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemResponse(InventoryItemBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class InventoryAlert(BaseModel):
    type: str
    severity: str
    item_id: Optional[int] = None
    item_name: Optional[str] = None
    message: str
    days_until_expiry: Optional[int] = None

class InventoryAlertsResponse(BaseModel):
    generated_at: datetime
    expired_count: int
    expiring_soon_count: int
    shortage_count: int
    alerts: List[InventoryAlert]

class TaskItemBase(BaseModel):
    timeframe: str # first_15_min, first_hour, first_24_hours, ongoing
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "HIGH"

class TaskItemCreate(TaskItemBase):
    pass

class TaskItemResponse(TaskItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MapMarkerBase(BaseModel):
    title: str
    marker_type: str # SAFE, DANGER, UNKNOWN, WATER, MEDICAL, FOOD, SHELTER, FUEL, COMMUNICATION, EXIT, HAZARD, CHECKPOINT, RESOURCE, PEOPLE
    latitude: float
    longitude: float
    notes: Optional[str] = None
    status: str = "SAFE"
    confidence: str = "CONFIRMED" # CONFIRMED, RECENTLY_CHECKED, OLD_INFO, UNVERIFIED, UNKNOWN

class MapMarkerCreate(MapMarkerBase):
    pass

class MapMarkerResponse(MapMarkerBase):
    id: int
    last_verified: datetime
    created_by: str

    class Config:
        from_attributes = True

class MapRouteBase(BaseModel):
    name: str
    route_type: str = "PRIMARY" # PRIMARY, BACKUP, EVACUATION, DANGER
    waypoints_json: str
    notes: Optional[str] = None

class MapRouteCreate(MapRouteBase):
    pass

class MapRouteResponse(MapRouteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class EmergencyContactBase(BaseModel):
    name: str
    relation: str
    phone: str
    alt_phone: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    category: str = "FAMILY"

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactResponse(EmergencyContactBase):
    id: int

    class Config:
        from_attributes = True

class PreparednessScoreResponse(BaseModel):
    overall_score: float
    water_score: float
    food_score: float
    medical_score: float
    shelter_score: float
    power_score: float
    communication_score: float
    navigation_score: float
    sanitation_score: float
    emergency_planning_score: float
    category_scores: Dict[str, float]

class StructuredAgentResponse(BaseModel):
    situation: str
    risk_level: str # CRITICAL, HIGH, MODERATE, LOW
    do_this_now: List[str]
    why: str
    what_you_have: List[str]
    what_you_may_need: List[str]
    avoid: List[str]
    next_check: str
    sources_used: List[str] = []
    is_offline: bool = True
    model_name: str = "RuleEngine / LocalQwen3"

class AgentQueryRequest(BaseModel):
    prompt: str
    scenario: Optional[str] = "Power Outage" # power_outage, flood, earthquake, pandemic, evacuation, zombie_simulation, custom
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    force_offline: bool = True

class WaterIQResponse(BaseModel):
    total_water_liters: float
    household_size: int
    daily_consumption_liters: float
    days_remaining: float
    dew_collection_estimate: str
    rainwater_collection_estimate: str
    recommendations: List[str]

class FoodIQResponse(BaseModel):
    total_calories: float
    household_size: int
    daily_calories_needed: float
    days_remaining: float
    items_breakdown: List[Dict[str, Any]]
    recommendations: List[str]

class SystemStatusResponse(BaseModel):
    is_online: bool
    local_ai_installed: bool
    local_ai_status: str
    active_model: str
    database_ready: bool
    handbook_indexed: bool
    total_knowledge_articles: int
    offline_maps_cached: bool
    inventory_items_count: int
    map_markers_count: int
    overall_readiness_score: float

class SolarEnergyIQRequest(BaseModel):
    panel_watts: float = 100.0
    sun_hours: float = 4.0
    battery_ah: float = 100.0
    battery_voltage: float = 12.0
    battery_type: str = "lifepo4"
    daily_load_wh: float = 300.0

class SolarEnergyIQResponse(BaseModel):
    battery_capacity_ah: float
    battery_voltage: float
    battery_type: str
    max_dod_percent: int
    total_stored_wh: float
    usable_stored_wh: float
    panel_wattage: float
    peak_sun_hours: float
    daily_solar_generation_wh: float
    daily_load_wh: float
    net_daily_wh_balance: float
    autonomy_hours_zero_sun: float
    autonomy_days_zero_sun: float
    is_sustainable: bool
    recommended_panel_watts: int
    recommendations: List[str]

