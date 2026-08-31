import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.calculators import SurvivalCalculators
from backend.rag_engine import OfflineRAGEngine

client = TestClient(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge", "curated_handbook")

def test_solar_energy_calculator_sustainable():
    res = SurvivalCalculators.calculate_solar_energy_iq(
        panel_watts=200,
        sun_hours=5,
        battery_ah=100,
        battery_voltage=12,
        battery_type="lifepo4",
        daily_load_wh=300
    )
    assert res["daily_solar_generation_wh"] == 750.0  # 200 * 5 * 0.75
    assert res["daily_load_wh"] == 300.0
    assert res["is_sustainable"] is True
    assert res["usable_stored_wh"] == 1020.0  # 1200 * 0.85

def test_solar_energy_calculator_deficit():
    res = SurvivalCalculators.calculate_solar_energy_iq(
        panel_watts=50,
        sun_hours=2,
        battery_ah=50,
        battery_voltage=12,
        battery_type="agm",
        daily_load_wh=500
    )
    assert res["daily_solar_generation_wh"] == 75.0 # 50 * 2 * 0.75
    assert res["is_sustainable"] is False
    assert res["usable_stored_wh"] == 300.0 # 600 * 0.50

def test_solar_iq_api_endpoint():
    payload = {
        "panel_watts": 150.0,
        "sun_hours": 4.0,
        "battery_ah": 100.0,
        "battery_voltage": 12.0,
        "battery_type": "lifepo4",
        "daily_load_wh": 200.0
    }
    response = client.post("/api/system/solar-iq", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["daily_solar_generation_wh"] == 450.0
    assert data["is_sustainable"] is True

def test_rag_engine_indexes_new_handbooks():
    rag = OfflineRAGEngine(KNOWLEDGE_DIR)
    assert len(rag.documents) >= 11

    # Test solar query
    solar_results = rag.search("mppt solar panel battery lifepo4", top_k=3)
    assert len(solar_results) > 0
    assert "solar_offgrid_power" in solar_results[0]["file_name"]

    # Test visual signaling query
    signal_results = rag.search("icao ground to air visual signal mirror heliograph", top_k=3)
    assert len(signal_results) > 0
    assert "visual_signaling" in signal_results[0]["file_name"]
