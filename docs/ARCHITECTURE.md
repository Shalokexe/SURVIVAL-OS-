# ARCHITECTURE DOCUMENTATION

## SYSTEM ARCHITECTURE OVERVIEW

```text
┌─────────────────────────────────────────────────────────────┐
│                     REACT + TYPESCRIPT UI                   │
│  [Command Center] [AI Agent] [My Map] [Water/Food IQ] [Vault]│
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API Calls
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND ROUTERS                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   AGENT ORCHESTRATOR LAYER                  │
│ Intent Detection -> Scenario Extraction -> Risk Assessment  │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│DECISION ENGINE│      │  RAG ENGINE   │       │ TOOL REGISTRY│
│Deterministic │       │  Handbook    │       │ Water/Food   │
│Rules         │       │  Search      │       │ Calculators  │
└──────┬───────┘       └──────┬───────┘       └──────┬───────┘
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │    LOCAL MODEL PROVIDER      │
               │  Ollama (Qwen3) / RuleEngine │
               └──────────────┬───────────────┘
                              │
                              ▼
                 STRUCTURED SURVIVAL RESPONSE
```

## KEY MODULE DESIGN
1. **Agent Orchestrator**: Collects prompt, household profile, water/food reserves, and map marker count to construct an emergency context.
2. **Local Model Provider**: Dynamically checks Ollama status at `http://localhost:11434`. If available, passes Qwen prompt; if unavailable, falls back to the deterministic Rule-Engine.
3. **Offline RAG Engine**: Indexes local markdown files in `knowledge/curated_handbook/*.md` by sections, performing fast term-frequency and BM25 matching.
4. **Interactive Leaflet Map**: Uses OpenStreetMap-derived offline tiles with personal marker legends (Safe, Danger, Water, Medical, Food, Shelter, Fuel, Hazard, Checkpoint) and confidence rating decay.
