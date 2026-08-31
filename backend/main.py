import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, SessionLocal
import models
from routers import agent, inventory, maps, tasks, emergency, knowledge, system

app = FastAPI(
    title="APOCALYPSE AI AGENT",
    description="Offline-First Personal Survival Intelligence & Decision Support API",
    version="1.0.0-beta.5"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router)
app.include_router(agent.router)
app.include_router(inventory.router)
app.include_router(maps.router)
app.include_router(tasks.router)
app.include_router(emergency.router)
app.include_router(knowledge.router)

@app.on_event("startup")
def startup_db_seed():
    init_db()
    db = SessionLocal()
    try:
        # Seed default profile if missing
        if db.query(models.UserProfile).count() == 0:
            profile = models.UserProfile(
                name="Chief Survivor",
                household_adults=2,
                household_children=1,
                household_elderly=0,
                household_pets=1,
                home_latitude=31.3260,
                home_longitude=75.5762,
                selected_region="Jalandhar District, Punjab",
                preferred_language="English"
            )
            db.add(profile)

        # Seed initial inventory items if empty
        if db.query(models.InventoryItem).count() == 0:
            default_items = [
                models.InventoryItem(category="water", name="Drinking Water Containers", quantity=45.0, unit="Liters", location_note="Pantry Shelf A"),
                models.InventoryItem(category="food", name="Rice Grains", quantity=15.0, unit="kg", calories_per_unit=3500, location_note="Dry Store Bin"),
                models.InventoryItem(category="food", name="Lentils (Dal)", quantity=10.0, unit="kg", calories_per_unit=3400, location_note="Dry Store Bin"),
                models.InventoryItem(category="food", name="Canned Vegetables & Beans", quantity=24.0, unit="cans", calories_per_unit=450, location_note="Pantry Shelf B"),
                models.InventoryItem(category="medical", name="Trauma First Aid Kit", quantity=2.0, unit="kits", location_note="Hallway Cabinet"),
                models.InventoryItem(category="medical", name="Paracetamol & Painkillers", quantity=3.0, unit="packs", location_note="Medical Box"),
                models.InventoryItem(category="power", name="Heavy Duty Power Bank 30,000mAh", quantity=2.0, unit="pcs", location_note="Desk Drawer"),
                models.InventoryItem(category="power", name="Solar Portable Charger 20W", quantity=1.0, unit="pcs", location_note="Emergency Backpack"),
                models.InventoryItem(category="tools", name="Multi-tool & Army Knife", quantity=2.0, unit="pcs", location_note="Tool Belt"),
                models.InventoryItem(category="tools", name="Tactical High-Lumen Flashlight", quantity=3.0, unit="pcs", location_note="Bedroom & Kitchen"),
                models.InventoryItem(category="sanitation", name="Unscented Bleach (5%)", quantity=2.0, unit="Liters", location_note="Sanitation Box"),
            ]
            db.add_all(default_items)

        # Seed default tasks if empty
        if db.query(models.TaskItem).count() == 0:
            default_tasks = [
                models.TaskItem(timeframe="first_15_min", title="Check household safety & physical injuries", priority="CRITICAL", completed=False),
                models.TaskItem(timeframe="first_15_min", title="Identify immediate environmental hazards (gas/water leak)", priority="CRITICAL", completed=False),
                models.TaskItem(timeframe="first_15_min", title="Secure emergency drinking water supply", priority="HIGH", completed=False),
                models.TaskItem(timeframe="first_hour", title="Inventory food, water, and medical reserves", priority="HIGH", completed=False),
                models.TaskItem(timeframe="first_hour", title="Switch mobile devices to battery saver mode", priority="MEDIUM", completed=False),
                models.TaskItem(timeframe="first_hour", title="Check Offline Survival Map & verify safe markers", priority="HIGH", completed=False),
                models.TaskItem(timeframe="first_24_hours", title="Establish rainwater collection catchment", priority="MEDIUM", completed=False),
                models.TaskItem(timeframe="first_24_hours", title="Verify emergency contact meeting points", priority="HIGH", completed=False),
            ]
            db.add_all(default_tasks)

        # Seed initial map markers if empty
        if db.query(models.MapMarker).count() == 0:
            default_markers = [
                models.MapMarker(title="Primary Household Shelter", marker_type="SHELTER", latitude=31.3260, longitude=75.5762, status="SAFE", confidence="CONFIRMED", notes="Primary home base. Water & dry food stored."),
                models.MapMarker(title="Civil Hospital Medical Point", marker_type="MEDICAL", latitude=31.3295, longitude=75.5810, status="UNKNOWN", confidence="RECENTLY_CHECKED", notes="Emergency room access on ground floor."),
                models.MapMarker(title="Clean Groundwater Borewell", marker_type="WATER", latitude=31.3210, longitude=75.5715, status="SAFE", confidence="CONFIRMED", notes="Submersible pump with solar backup."),
                models.MapMarker(title="Bridge Obstruction Hazard", marker_type="HAZARD", latitude=31.3320, longitude=75.5680, status="DANGER", confidence="OLD_INFO", notes="Debris reported near canal crossing."),
            ]
            db.add_all(default_markers)

        # Seed default emergency contacts if empty
        if db.query(models.EmergencyContact).count() == 0:
            default_contacts = [
                models.EmergencyContact(name="Family Emergency Contact", relation="Sibling", phone="+91 98765 43210", category="FAMILY", notes="Primary meeting point contact."),
                models.EmergencyContact(name="District Emergency Control Room", relation="Authority", phone="108", category="AUTHORITY", notes="Government disaster helpline."),
                models.EmergencyContact(name="Dr. Sharma (Family Doctor)", relation="Physician", phone="+91 98123 45678", category="DOCTOR", notes="Prescription guidance."),
            ]
            db.add_all(default_contacts)

        db.commit()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "app": "APOCALYPSE AI AGENT",
        "status": "ONLINE / OFFLINE READY",
        "philosophy": "INTERNET WHEN AVAILABLE. INTELLIGENCE WHEN UNAVAILABLE."
    }
