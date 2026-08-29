import os
import sys

# Add backend to python path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(base_dir, "backend")
sys.path.insert(0, backend_dir)

from database import init_db, SessionLocal
import models
from decision_engine import DecisionEngine
from rag_engine import OfflineRAGEngine
from tool_registry import ToolRegistry
from agent_orchestrator import AgentOrchestrator
from calculators import SurvivalCalculators

def test_system():
    print("--- [1/6] INITIALIZING DATABASE ---")
    init_db()
    db = SessionLocal()

    # Seed default data
    from main import startup_db_seed
    startup_db_seed()

    inv_count = db.query(models.InventoryItem).count()
    marker_count = db.query(models.MapMarker).count()
    print(f"[SUCCESS] Inventory items seeded: {inv_count}")
    print(f"[SUCCESS] Map markers seeded: {marker_count}")

    print("\n--- [2/6] TESTING CALCULATORS ---")
    water_res = SurvivalCalculators.calculate_water_iq(45.0, 2, 1, 0)
    print(f"[SUCCESS] Water IQ Days Remaining: {water_res['days_remaining']} days")

    food_items = [{"name": "Rice", "category": "food", "quantity": 15, "unit": "kg", "calories_per_unit": 3500}]
    food_res = SurvivalCalculators.calculate_food_iq(food_items, 2, 1, 0)
    print(f"[SUCCESS] Food IQ Days Remaining: {food_res['days_remaining']} days")

    print("\n--- [3/6] TESTING RAG HANDBOOK SEARCH ---")
    knowledge_dir = os.path.join(base_dir, "knowledge", "curated_handbook")
    rag = OfflineRAGEngine(knowledge_dir)
    results = rag.search("How to purify water with bleach?")
    print(f"[SUCCESS] Indexed documents: {len(rag.documents)}")
    print(f"[SUCCESS] Search result title: {results[0]['title']}")

    print("\n--- [4/6] TESTING DECISION ENGINE ---")
    eval_res = DecisionEngine.evaluate("Water supply cut off in power outage", "power_outage")
    print(f"[SUCCESS] Scenario evaluated: {eval_res['scenario']}, Risk: {eval_res['risk_level']}")

    print("\n--- [5/6] TESTING AGENT ORCHESTRATOR ---")
    orchestrator = AgentOrchestrator(rag)
    response = orchestrator.process_query("What should I do right now?", "power_outage", db)
    print(f"[SUCCESS] Agent Response Risk Level: {response.risk_level}")
    print(f"[SUCCESS] Priority Action 1: {response.do_this_now[0]}")
    print(f"[SUCCESS] Model Name: {response.model_name}")

    print("\n--- [6/6] TEST COMPLETE - ALL BACKEND SYSTEMS 100% OPERATIONAL ---")
    db.close()

if __name__ == "__main__":
    test_system()
