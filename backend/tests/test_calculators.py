import pytest
from calculators import SurvivalCalculators

def test_water_iq_calculation_normal():
    # 45L for 2 adults (3.5L ea) and 1 child (2.5L) = 9.5L/day -> ~4.7 days
    res = SurvivalCalculators.calculate_water_iq(total_liters=45.0, adults=2, children=1, elderly=0)
    assert res["household_size"] == 3
    assert res["daily_consumption_liters"] == 9.5
    assert res["days_remaining"] == 4.7
    assert len(res["recommendations"]) > 0

def test_water_iq_calculation_critical():
    # 5L for 2 adults (7L/day) -> < 1 day (critical)
    res = SurvivalCalculators.calculate_water_iq(total_liters=5.0, adults=2, children=0, elderly=0)
    assert res["days_remaining"] == 0.7
    assert any("URGENT" in r for r in res["recommendations"])

def test_food_iq_calculation():
    inventory_items = [
        {"name": "Rice Grains", "category": "food", "quantity": 10.0, "unit": "kg", "calories_per_unit": 3500},
        {"name": "Canned Beans", "category": "food", "quantity": 10.0, "unit": "cans", "calories_per_unit": 450}
    ]
    # Total kcal: (10*3500) + (10*450) = 35,000 + 4,500 = 39,500 kcal
    # 2 adults (4000 kcal/day)
    res = SurvivalCalculators.calculate_food_iq(inventory_items, adults=2, children=0, elderly=0)
    assert res["total_calories"] == 39500.0
    assert res["daily_calories_needed"] == 4000
    assert res["days_remaining"] == pytest.approx(9.9, 0.1)

def test_preparedness_scores():
    scores = SurvivalCalculators.calculate_preparedness_scores(
        water_days=5.0,
        food_days=15.0,
        has_medical=True,
        has_power=True,
        has_comm=True,
        has_map=True,
        has_sanitation=True,
        has_shelter=True
    )
    assert "overall_score" in scores
    assert 0 <= scores["overall_score"] <= 100
    assert "water_score" in scores
    assert "food_score" in scores
    assert "medical_score" in scores

def test_resource_substitution():
    subs = SurvivalCalculators.get_resource_substitution("water filter")
    assert subs["matched_category"] == "water filter"
    assert len(subs["alternatives"]) > 0
    assert any("boil" in str(s).lower() or "bleach" in str(s).lower() for s in subs["alternatives"])
