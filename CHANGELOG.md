# Changelog 📋

All notable changes to **SurvivalOS** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0-beta.5] - 2026-09-01

### 🚀 Added
- **Solar & Off-Grid Energy IQ Calculator (`SolarEnergyIQ.tsx` & `solar_offgrid_power.md`)**:
  - Off-grid daily energy budget calculator, battery DoD depth limits (LiFePO4 85% vs AGM 50%), and zero-sun autonomy runway indicator.
  - Interactive load device simulator and solar panel capacity advisory.
- **Visual Emergency Signaling Deck (`VisualSignalingDeck.tsx` & `visual_signaling.md`)**:
  - Ground-to-Air ICAO / NATO emergency visual code matrix (V, X, N, Y, ->, LL).
  - High-visibility optical Morse code strobe transmitter (`... --- ...`) and signal mirror aiming guide.
- **Offline RAG & Standalone System Integration**:
  - Indexed 2 new handbooks into offline RAG BM25 engine (total 11 curated articles).
  - Wired quick launch widgets in pitch-black 0-lux Minimalist OLED OS mode.
- **Automated Pytest Suite**:
  - Added `test_solar_signaling.py` unit tests (27 total passing tests).

---

## [v1.0.0-beta.4] - 2026-08-31

### 🚀 Added
- **Extreme Weather & Improvised Shelter Guide (`extreme_weather_shelter.md`)**:
  - Off-grid thermal protection principles (radiation, conduction, convection, evaporation).
  - Construction blueprints for A-Frame Debris Shelters, Tarp Lean-Tos, Snow Trenches, and Double-Tarp Shade Flies for heatwaves.
- **Tactical Knots & Rigging Survival Guide (`knot_tying_rigging.md`)**:
  - Field guide covering top survival knots: Bowline, Taut-Line Hitch, Clove Hitch, Square Knot, and Figure-Eight.
  - Improvised lashings (Square & Shear) and 3:1 mechanical advantage Trucker's Hitch hauling system.
- **Standalone Offline RAG & Client Engine Updates (`standaloneMode.ts`)**:
  - Expanded in-browser rule engine topic evaluation for shelter, extreme weather, knot tying, and tactical rigging.
  - Updated offline handbook article count to 9.

---

## [v1.0.0-beta.3] - 2026-08-27

### 🚀 Added
- **Apocalypse Minimalist OS Mode (`MinimalistOS.tsx`)**:
  - Ultra-low power true pitch-black (`#000000`) OLED battery saver interface designed to maximize device runtime during multi-day grid collapses.
  - **Customizable Survival Apps Grid**: Pin/unpin essential widgets (AI Copilot, Water IQ, First Aid Triage & CPR, Radio Deck, Tasks, Map).
  - **Live Battery Telemetry**: Integrated with `navigator.getBattery()` API for real-time percentage and charging indicators.
  - **Emergency Fast-Action Bar**: One-tap White Screen Flashlight and SOS emergency triggers.
- **START First-Aid Triage & CPR Metronome (`FirstAidTriage.tsx`)**:
  - Interactive **Simple Triage and Rapid Treatment (START)** 60-second mass casualty decision flowchart (Ambulatory -> Respiration -> Perfusion -> Mentation -> RED / YELLOW / GREEN / BLACK categories).
  - **110 BPM Web Audio CPR Metronome**: AHA/ERC standardized acoustic audio pulse with 30:2 chest compression to rescue breath cycle counter.
- **Offline Triage & CPR Handbook (`start_triage_cpr.md`)**:
  - Curated guide indexed for immediate offline AI search and protocol citations.

---

## [v1.0.0-beta.2] - 2026-08-26

### 🚀 Added
- **Tactical Radio Frequency Deck (`RadioFrequencyDeck.tsx`)**:
  - Curated frequency matrix covering NOAA Weather Radio (WX1–WX7), Marine VHF Ch 16 & Ch 9, HAM 2m/70cm National Simplex Calling, FRS/GMRS emergency channels, Citizen Band (CB Ch 9/19), and International Air Distress (121.500 MHz).
  - Built-in **Web Audio API 800Hz SOS Beacon** (`... --- ...` Morse code synthesizer) with live play/stop audio controls.
  - Interactive **NATO Phonetic Alphabet** quick-reference decoder for spelling coordinates through radio static.
  - Standardized **MAYDAY / PAN-PAN** distress transmission protocol checklist.
- **Offline Communications Handbook (`emergency_radio_comms.md`)**:
  - Full protocol documentation indexed by the offline BM25 RAG engine for immediate AI citation.
- **Automated Backend Pytest Suite (`backend/tests/`)**:
  - `test_calculators.py`: Complete test coverage for Water IQ quotas, Food IQ calories, and Readiness scoring.
  - `test_decision_engine.py`: Tests scenario matching and fallback JSON schemas across power outages, floods, and earthquakes.
  - `test_rag_engine.py`: Validates term-frequency search accuracy over curated markdown handbooks.
  - `test_api_endpoints.py`: Integration testing for FastAPI endpoints with `TestClient`.
- **CI Workflow Enhancement**:
  - Updated `.github/workflows/ci.yml` to automatically execute the `pytest` test suite on all branches and pull requests.

---

## [v1.0.0-beta.1] - 2026-08-24

### 🚀 Added
- **Tactical Command HUD**: Central command interface with dynamic 0–100 preparedness score, supply deficit alarms, and system telemetry ticker.
- **Dual-Engine AI Copilot**:
  - Local neural LLM integration via **Ollama** (`qwen2.5`, `qwen3`, `llama3`).
  - Zero-latency, zero-GPU deterministic fallback rule engine for instant emergency triage.
- **Interactive Tactical Survival Map**:
  - Leaflet-powered GIS map canvas with custom hazard pins, safe zones, water points, and medical stations.
  - Built-in confidence decay rating (`CONFIRMED`, `RECENTLY_CHECKED`, `OLD_INFO`).
- **Resource Intelligence Calculators**:
  - **Water IQ**: Household daily consumption model, rainfall catchment simulator, and chemical/thermal purification dosing.
  - **Food IQ**: Total kilocalorie stockpile runway tracker and culinary/medicinal smart substitutions.
- **Emergency Vault & ICE Contact Deck**:
  - Offline encrypted medical profiles (blood types, allergies, emergency prescriptions).
  - Emergency contact manager with one-touch dialing for family and civil authorities.
- **Curated Offline Survival Handbook (RAG)**:
  - Local BM25-indexed retrieval engine over 5 core disaster response guides (*First Aid Triage, Water Purification, Disaster Evacuation, Food Storage, Off-Grid Power*).
- **Offline Synchronization Queue**:
  - Service worker asset caching and local mutation queue for seamless off-grid operation.
- **Cloudflare Live Demo & Pages Integration**:
  - One-click Cloudflare Tunnel script (`run_cloudflare_demo.py`) for live instant demos.
  - Cloudflare Pages configuration (`wrangler.toml`, `_headers`, `_redirects`).
- **Developer & CI Workflows**:
  - GitHub Actions automated release packager and CI test pipeline.
  - GitHub Issue and PR templates.

---

[v1.0.0-beta.1]: https://github.com/Shalokexe/SURVIVAL-OS-/releases/tag/v1.0.0-beta.1
