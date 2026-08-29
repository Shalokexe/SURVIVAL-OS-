import os
import pytest
from rag_engine import OfflineRAGEngine

@pytest.fixture
def rag_instance():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    knowledge_dir = os.path.join(base_dir, "knowledge", "curated_handbook")
    return OfflineRAGEngine(knowledge_dir)

def test_handbook_indexing(rag_instance):
    assert len(rag_instance.documents) >= 5
    titles = [doc["title"] for doc in rag_instance.documents]
    assert any("Water" in t for t in titles)
    assert any("First Aid" in t or "Triage" in t for t in titles)

def test_search_water_purification(rag_instance):
    results = rag_instance.search("bleach chlorine drops water disinfection", top_k=3)
    assert len(results) > 0
    assert any("water" in r["title"].lower() or "purification" in r["title"].lower() for r in results)

def test_search_radio_communications(rag_instance):
    results = rag_instance.search("channel 16 noaa weather marine distress frequency", top_k=3)
    assert len(results) > 0
    assert any("radio" in r["title"].lower() or "emergency" in r["title"].lower() for r in results)

def test_empty_search_returns_documents(rag_instance):
    results = rag_instance.search("", top_k=2)
    assert len(results) > 0
