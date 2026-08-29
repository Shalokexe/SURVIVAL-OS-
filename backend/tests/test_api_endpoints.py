import pytest
from fastapi.testclient import TestClient
from main import app, startup_db_seed

@pytest.fixture(scope="module")
def client():
    startup_db_seed()
    with TestClient(app) as c:
        yield c

def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "app" in data
    assert "status" in data

def test_system_status(client):
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert "is_online" in data
    assert "overall_readiness_score" in data

def test_system_profile(client):
    response = client.get("/api/system/profile")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "household_adults" in data

def test_inventory_endpoints(client):
    res_items = client.get("/api/inventory/items")
    assert res_items.status_code == 200
    assert isinstance(res_items.json(), list)

    res_water = client.get("/api/inventory/water_iq")
    assert res_water.status_code == 200
    assert "days_remaining" in res_water.json()

    res_food = client.get("/api/inventory/food_iq")
    assert res_food.status_code == 200
    assert "days_remaining" in res_food.json()

def test_map_markers(client):
    response = client.get("/api/maps/markers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_tasks_list(client):
    response = client.get("/api/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_emergency_contacts(client):
    response = client.get("/api/emergency/contacts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_knowledge_search(client):
    response = client.get("/api/knowledge/search?query=water")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_knowledge_articles(client):
    response = client.get("/api/knowledge/articles")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
