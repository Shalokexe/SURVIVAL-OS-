# ⚙️ SurvivalOS — Backend API Engine

The backend for **SurvivalOS** is built with **FastAPI**, **SQLAlchemy**, and **SQLite**. It handles offline data persistence, deterministic survival calculation engines, curated offline RAG knowledge retrieval, and local neural AI orchestration via Ollama.

---

## 🏗️ Architecture & Modules

- **`agent_orchestrator.py`**: Coordinates incoming emergency prompts, gathers local context (household members, water/food reserves, nearby map hazards), and routes queries to Ollama or the deterministic rule engine.
- **`calculators.py`**: Core mathematical calculations for Water IQ, Food IQ, calorie runways, and the overall Preparedness Score (0–100).
- **`decision_engine.py`**: Zero-latency deterministic rule engine providing structured safety guidelines when an LLM is offline.
- **`tool_registry.py`**: Safe, sandboxed tool definitions available to the agent.
- **`rag_engine.py`**: Offline BM25/term-frequency search engine indexing markdown files in `../knowledge/curated_handbook/`.
- **`models.py` & `database.py`**: SQLAlchemy models for user profiles, inventory items, map markers, tasks, and emergency contacts.
- **`routers/`**:
  - `agent.py`: `/api/agent` triage queries
  - `system.py`: `/api/system` health and preparedness metrics
  - `inventory.py`: `/api/inventory` items, alerts, Water IQ, and Food IQ
  - `maps.py`: `/api/maps` spatial markers and risk points
  - `tasks.py`: `/api/tasks` time-phased action checklist
  - `emergency.py`: `/api/emergency` ICE contacts and medical vault
  - `knowledge.py`: `/api/knowledge` offline handbook search

---

## 🚀 Getting Started

### 1. Install Requirements
```bash
pip install -r requirements.txt
# Or manually:
pip install fastapi uvicorn sqlalchemy pydantic jinja2
```

### 2. Run the Development Server
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Interactive API Documentation
Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for Swagger UI.
