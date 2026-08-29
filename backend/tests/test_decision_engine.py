import pytest
from decision_engine import DecisionEngine

def test_evaluate_power_outage():
    res = DecisionEngine.evaluate("The power went out and the fridge is getting warm", "power_outage")
    assert res is not None
    assert res["scenario"] == "power_outage"
    assert res["risk_level"] in ["MODERATE", "HIGH", "CRITICAL"]
    assert len(res["actions"]) > 0
    assert len(res["avoid"]) > 0

def test_evaluate_flood():
    res = DecisionEngine.evaluate("Water rising in street flash flood warning", "flood")
    assert res is not None
    assert res["scenario"] == "flood"
    assert res["risk_level"] == "CRITICAL"
    assert len(res["actions"]) > 0
    assert any("ground" in step.lower() or "electrical" in step.lower() for step in res["actions"])

def test_evaluate_earthquake():
    res = DecisionEngine.evaluate("Ground shaking earthquake tremor", "earthquake")
    assert res is not None
    assert res["scenario"] == "earthquake"
    assert res["risk_level"] in ["CRITICAL", "HIGH"]
    assert len(res["actions"]) > 0

def test_schema_validity():
    res = DecisionEngine.evaluate("General emergency help", "power_outage")
    required_keys = ["scenario", "risk_level", "immediate_priority", "actions", "avoid"]
    for key in required_keys:
        assert key in res, f"Missing required key: {key}"
