from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from datetime import datetime
from database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Survivor")
    household_adults = Column(Integer, default=2)
    household_children = Column(Integer, default=1)
    household_elderly = Column(Integer, default=0)
    household_pets = Column(Integer, default=0)
    home_latitude = Column(Float, nullable=True)
    home_longitude = Column(Float, nullable=True)
    selected_region = Column(String, default="Local District")
    preferred_language = Column(String, default="English")
    offline_mode_override = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True) # water, food, medical, power, tools, sanitation, shelter, communication
    name = Column(String, index=True)
    quantity = Column(Float, default=1.0)
    unit = Column(String, default="pcs") # Liters, kg, cans, packs, pcs, units
    calories_per_unit = Column(Float, default=0.0) # for food items
    expiration_date = Column(String, nullable=True)
    location_note = Column(String, default="Pantry / Shelter")
    is_essential = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

class TaskItem(Base):
    __tablename__ = "task_items"

    id = Column(Integer, primary_key=True, index=True)
    timeframe = Column(String, index=True) # first_15_min, first_hour, first_24_hours, ongoing
    title = Column(String)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False)
    priority = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    created_at = Column(DateTime, default=datetime.utcnow)

class MapMarker(Base):
    __tablename__ = "map_markers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    marker_type = Column(String, index=True) # SAFE, DANGER, UNKNOWN, WATER, MEDICAL, FOOD, SHELTER, FUEL, COMMUNICATION, EXIT, HAZARD, CHECKPOINT, RESOURCE, PEOPLE
    latitude = Column(Float)
    longitude = Column(Float)
    notes = Column(Text, nullable=True)
    status = Column(String, default="SAFE")
    confidence = Column(String, default="CONFIRMED") # CONFIRMED, RECENTLY_CHECKED, OLD_INFO, UNVERIFIED, UNKNOWN
    last_verified = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String, default="USER")

class MapRoute(Base):
    __tablename__ = "map_routes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    route_type = Column(String, default="PRIMARY") # PRIMARY, BACKUP, EVACUATION, DANGER
    waypoints_json = Column(Text) # JSON string of [[lat, lng], ...]
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    relation = Column(String)
    phone = Column(String)
    alt_phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    category = Column(String, default="FAMILY") # FAMILY, FRIEND, DOCTOR, HOSPITAL, POLICE, FIRE, AUTHORITY

class KnowledgeCache(Base):
    __tablename__ = "knowledge_cache"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    source = Column(String)
    content = Column(Text)
    region = Column(String, nullable=True)
    downloaded_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow)
    expiration_date = Column(String, nullable=True)

class PreparednessMetric(Base):
    __tablename__ = "preparedness_metrics"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, unique=True, index=True) # Water, Food, Medical, Shelter, Power, Communication, Navigation, Sanitation, Emergency Planning
    score = Column(Float, default=0.0) # 0 to 100
    details_json = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

class EmergencyVaultItem(Base):
    __tablename__ = "emergency_vault"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String) # DOCUMENT, PRESCRIPTION, ID, MANUAL, NOTE
    encrypted_content = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow)
