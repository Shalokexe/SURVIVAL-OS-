# ⚡ SURVIVAL-OS // EMERGENCY COMMAND TERMINAL 🛡️

<div align="center">

<img src="./docs/assets/survival_os_pixel_banner.jpg" alt="SurvivalOS 16-Bit Pixelated Tactical HUD Banner" width="100%" style="border-radius: 8px; border: 2px solid #00f0ff;" />

<br/><br/>

[![Pixel Engine](https://img.shields.io/badge/PIXELATED-16--BIT_RETRO_HUD-00F0FF?style=for-the-badge&logo=gamepad&logoColor=black)](README.md)
[![Offline First](https://img.shields.io/badge/OFFLINE--FIRST-READY-39FF14?style=for-the-badge&logo=pwa&logoColor=black)](README.md)
[![Tactical Intelligence](https://img.shields.io/badge/TACTICAL-SURVIVAL_IQ-FF0055?style=for-the-badge&logo=shield&logoColor=white)](README.md)

**Resilient 16-Bit Pixelated Emergency Command HUD & Survival Intelligence System**

> *"Internet when available. Intelligence when unavailable."*

[![Release](https://img.shields.io/badge/Release-v1.0.0--beta.5-orange?style=flat-square&logo=github)](RELEASE_NOTES.md)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React%2018-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_AI-black?style=flat-square&logo=ollama&logoColor=white)](https://ollama.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Overview](#overview) • [Core Features](#core-features) • [Feature Modules](#feature-modules) • [System Architecture](#system-architecture) • [Quick Start](#quick-start)

</div>

```text
 ⚡ 🛡️ ═════════════════════════════════════════════════════════════════════════════ 🛡️ ⚡
  ███████╗██╗   ██╗██████╗ ██╗   ██╗██╗██╗   ██╗██████╗  ██████╗ ███████╗
  ██╔════╝██║   ██║██╔══██╗██║   ██║██║██║   ██║██╔══██╗██╔═══██╗██╔════╝
  ███████╗██║   ██║██████╔╝██║   ██║██║██║   ██║██████╔╝██║   ██║███████╗
  ╚════██║██║   ██║██╔══██╗╚██╗ ██╔╝██║██║   ██║██╔══██╗██║   ██║╚════██║
  ███████║╚██████╔╝██║  ██║ ╚████╔╝ ██║╚██████╔╝██║  ██║╚██████╔╝███████║
  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
  [ ⚡ SURVIVAL-OS // 16-BIT PIXELATED EMERGENCY COMMAND HUD v1.0.0-BETA.5 🛡️ ]
 ⚡ 🛡️ ═════════════════════════════════════════════════════════════════════════════ 🛡️ ⚡

┌──────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ SURVIVAL-OS TACTICAL HUD  |  POWER: 89% ⚡ |  CRT SCANLINES: ACTIVE [ON] │
├──────────────────────────────────────────────────────────────────────────────┤
│ 💧 H2O: 75% (4.5 DAYS)                     | 🥫 FOOD: 60% (12 DAYS)         │
│ 💊 MED SCANNER: OTC ANALGESIC / ORS READY  | 📡 MESH FREQ: 433.92 MHz (CH 04)│
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐  ┌─────────────────────────────┐ │
│ │ 📷 OPTICAL SCANNER & FLORA / MED HUD   │  │ 🏆 SURVIVOR PREPAREDNESS    │ │
│ │ ┌─────────────────────────────────────┐ │  │ ⚡ READINESS SCORE: 88/100  │ │
│ │ │ [PIXEL VISION] OCR CAM & RADAR      │ │  │ 🏆 EXP STREAK: 14 DAYS      │ │
│ │ │ > FLORA: EDIBLE WILD PLANT IDENTIFIED│ │  ├─────────────────────────────┤ │
│ │ │ > MEDS : PARACETAMOL & ANTIBIOTIC   │ │  │ UNLOCKED CAPABILITIES       │ │
│ │ │ > RADAR: PERIMETER TRIPWIRE ACTIVE  │ │  │  [💊] MED OCR SCANNER       │ │
│ │ └─────────────────────────────────────┘ │  │  [🌿] FLORA EDIBILITY       │ │
│ │                                         │  │  [📡] P2P MESH BROADCAST    │ │
│ └─────────────────────────────────────────┘  └─────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ 🤖 BOT DEBRIEF: "System online. Water, food, medical, and mesh active."     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Overview

SurvivalOS is a resilient, offline-first emergency command center built to help people act decisively when communications, power, and cloud infrastructure fail. It combines a tactical dashboard, deterministic emergency calculators, offline knowledge retrieval, and optional local AI inference to turn uncertainty into structured action.

The project is designed for natural disasters, blackouts, remote field use, household readiness, and emergency planning. It runs locally without sending personal data to external services, making it useful in low-connectivity or no-connectivity environments.

---

## Core Features

- ☣️ **CBRN Hazmat Decontamination & Shelter Sealing**: Step-by-step radiological, chemical & biological 4-zone decon protocol wizard + plastic sheeting & duct tape calculator for air-sealing shelters
- ⚡ **Solar Array Tilt Angle & Power Autonomy Optimizer**: Solar panel inclination angle calculator based on latitude/season (+25% yield boost), battery DoD autonomy simulator & device load budget
- 📲 **Offline QR Emergency Vault Sync & Printable Field Card**: Camera-scannable QR code generator for phone-to-phone data transfer without network & 1-page printable pocket cheat sheet
- 🗺️ **Offline Evacuation Route & Naismith Terrain Planner**: Multi-waypoint evacuation planner using Naismith's Rule time calculations (elevation gain penalty, pack weight fatigue & slope hazard alerts)
- 📻 **Emergency Acoustic & Siren Frequency Radar**: FFT microphone spectrum analyzer for EAS 1000Hz alert tones, 3000Hz SOS whistles, siren pitch sweeps & decibel spikes
- 🪢 **Tactical Knot & Rigging Studio**: Step-by-step visual guides for core survival knots (*Bowline, Taut-Line, Trucker's 3:1 Hitch*), Paracord load rating calculators, and tarp shelter rigging templates
- 💊 **Medication Photo Scanner & Emergency Drug Guide**: Camera OCR scanner for medicine blister packs/boxes, symptom-to-medicine offline lookup wizard, dosage calculator & contraindication safety alerts
- 🌿 **Wild Flora & Photo Edibility Scanner**: Live camera plant snapshot scanner, 8-stage Universal Edibility Test (UET) wizard, and toxic plant red-flag checklist
- 🌐 **Offline Mesh Emergency Comms**: Client-side P2P BroadcastChannel relay network for offline survivor-to-survivor messaging and SOS beacons
- ⚖️ **Wasteland Barter Matrix**: Post-collapse currency-free supply trade value calculator with deal fairness evaluation
- ☣️ **Atmospheric Fallout & Wet-Bulb Physics**: 7-10 Fallout radiation decay calculator and hyperthermia exposure index
- 🚨 **Perimeter Defense Radar & Motion Tripwire**: WebCam frame-difference & decibel noise sensor tripwire with siren alerts for shelter security
- 📡 **Optical Morse Code Beacon & Signal Strobe**: Text-to-Morse optical generator, torch pulses, and audio pulse synthesizer for rescue signaling
- 📹 **Doomsday Chronicles & Daily Vlogs**: WebCam video studio with CRT/Night Vision HUD, voice recorder & survival module mastery tracker
- ⚡ **Zero-cloud operation** with local IndexedDB/LocalStorage persistence





- 🔋 **Apocalypse Minimal OS mode** for low-power, blackout-friendly UI
- 🤖 **Hybrid AI emergency copilot** with Ollama + deterministic fallback
- 🩺 **START triage workflow** and CPR metronome
- 📊 **Preparedness score tracking** across food, water, medical, power, and shelter
- 💧 **Water and food runway calculators**
- 🗺️ **Offline survival map** with custom hazard, shelter, and resource markers
- 📻 **Radio frequency deck** and SOS audio beacon
- 📚 **Curated offline survival handbook** with fast local retrieval
- 🔒 **Privacy-focused local-first design** for medical and contact data


---

## Feature Modules

### 1. Command Center & Readiness HUD

- Real-time preparedness score from 0 to 100
- Urgent action radar for the first 15 minutes, 1 hour, and 24 hours
- Expiration warnings and supply deficiency tracking
- Local operating state display for AI, database, and connectivity

### 2. Hybrid AI Emergency Copilot

- Context-aware emergency triage
- Structured responses with assessment, immediate actions, warnings, and bibliography
- Primary local AI path using Ollama models
- Deterministic fallback engine when LLM access is unavailable

### 3. Tactical Survival Map

- Leaflet-based offline map interactions
- Marker categories for shelter, water, food, medical, power, fuel, hazard, and checkpoints
- Confidence and status labeling for each discovery
- Built for local and low-network use

### 4. Water IQ & Purification

- Household water requirement calculations
- Boiling, bleach, iodine, SODIS, and filter-based guidance
- Rainwater harvesting estimates based on roof area and precipitation

### 5. Food IQ & Caloric Planning

- Inventory calorie tracking
- Days of food remaining calculations
- Resource substitution and ration planning support

### 6. Inventory Matrix & Vault

- Room-by-room and bin-by-bin organization
- Medical profile and ICE contact storage
- Bug-out checklist and emergency contact access

### 7. Offline Knowledge Base

Bundled survival manuals include:

- first_aid_triage.md
- water_purification.md
- disaster_evacuation.md
- food_storage.md
- power_lighting.md
- emergency_radio_comms.md
- start_triage_cpr.md

### 8. Doomsday Chronicles & Daily Vlogs

- **Live WebCam Studio**: Video vlog recorder with CRT scanline filters, HUD coordinate stamps, and Night Vision toggle
- **Hands-Free Audio Recorder**: Voice note memos for low-battery or blackout scenarios
- **Survival Module Reflection**: Tag daily learnings (*Water IQ, CPR Triage, Solar Power, Radio Comms*) with AI debriefing
- **Doomsday Timeline & Badges**: Day-by-day survival streak tracker and unlockable milestone trophies

### 9. Shelter Perimeter Defense Radar

- **Motion Variance Tripwire**: Real-time WebCam frame-difference calculation to detect entry while sleeping
- **Decibel Spike Detector**: Audio level analyser for glass breaking or footsteps
- **Radar Target Display & Siren Alert**: Visual radar sweeper HUD with intrusion log and audible siren alarms

### 10. Optical Morse Beacon & Rescue Strobe

- **Text-to-Morse Optical Flasher**: Converts any emergency message (e.g., `SOS TRAPPED FLAT 4B`) into Morse light bursts
- **Hardware Torch & Audio Beeper**: Synchronizes screen color pulses, camera flashlight torch, and 750Hz audio tones
- **Manual Telegraph Key**: Touch/click telegraph pad for sending custom manual Morse code

### 11. Wasteland Barter & Atmospheric Physics

- **Post-Collapse Barter Matrix**: Evaluates trade fairness values for survival goods without currency
- **Nuclear Fallout 7-10 Decay Rule**: Calculates radiation decay over time ($R_t = R_1 \cdot t^{-1.2}$) and safe exit times
- **Wet-Bulb Exposure Index**: Calculates hyperthermia and frostbite risks based on temperature and humidity

### 12. Offline Mesh Emergency Comms

- **P2P Local Relay Network**: Cross-window/tab message propagation using HTML5 `BroadcastChannel` APIs without servers
- **SOS Emergency Broadcast**: One-tap distress beacon dispatch with GPS coordinates and supply requests
- **Node Topology Visualizer**: Displays connected survivor relay nodes, signal RSSI (dBm), and multi-hop relay distances

### 13. Medication Photo Scanner & Emergency Drug Guide

- **Live Camera OCR & Photo Scanner**: Scans packaging, blister packs, and labels using client-side OCR
- **Symptom-to-Medicine Search**: Instant matching for fever, severe pain, bacterial infection, diarrhea, and dehydration
- **Dosage & Safety Contraindications**: Adult/pediatric dosage guidelines, 24h limits, and organ toxicity alerts

### 14. Wild Flora & Photo Edibility Scanner

- **Botanical Camera Identifier**: Identifies wild plants, berries, mushrooms, and roots from photos
- **8-Stage Universal Edibility Test (UET)**: Guided safety protocol before consuming wild vegetation
- **Toxicity Warnings**: Red-flag indicators for poison hemlock, deadly nightshade, and toxic lookalikes

### 15. Tactical Knot & Rigging Studio

- **Visual Step-by-Step Rigging**: Interactive diagrams for Bowline, Taut-Line Hitch, Trucker's 3:1 Hitch, and Square Knots
- **Paracord Load Ratings**: Working Load Limit (WLL) calculator for 550 paracord and climbing ropes
- **Tarp Shelter Templates**: Step-by-step rigging setups for A-Frame, Lean-To, and Diamond shelters

---

## System Architecture

```mermaid
graph TD
    subgraph Frontend["Frontend (React + TypeScript + Vite)"]
        UI[Command Center UI]
        MAP[Survival Map]
        SW[Offline Service Worker]
    end

    subgraph Backend["Backend (FastAPI + Python)"]
        API[FastAPI API]
        ORCH[Agent Orchestrator]
        CALC[Calculation Engine]
        RAG[RAG Knowledge Engine]
        RULES[Decision Engine]
        TOOLS[Safe Tool Registry]
    end

    subgraph Storage["Local Runtime"]
        DB[(SQLite DB)]
        OLLAMA[Ollama Model]
        KB[Curated Handbook]
    end

    UI --> API
    MAP --> API
    API --> ORCH
    API --> CALC
    API --> DB
    ORCH --> TOOLS
    ORCH --> RAG
    ORCH --> RULES
    ORCH -.-> OLLAMA
    RAG --> KB
    RULES --> DB
```

---

## Technology Stack

| Layer | Stack | Purpose |
| :--- | :--- | :--- |
| Frontend | React 18, TypeScript, Vite | Interactive emergency dashboard |
| Styling | Tailwind CSS | High-contrast tactical UI |
| Mapping | Leaflet, OpenStreetMap | Offline spatial overlays |
| Backend | FastAPI, Uvicorn, Pydantic | Fast API services |
| Storage | SQLAlchemy, SQLite | Local embedded data layer |
| AI | Ollama + custom orchestration | Local AI reasoning |
| Fallback | Deterministic rule engine | Safe offline response path |
| Knowledge | Local handbook index | Fast emergency lookup |

---

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Optional: [Ollama](https://ollama.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Shalokexe/SURVIVAL-OS-.git
cd SURVIVAL-OS-
```

### 2. Install backend dependencies

```bash
cd backend
python -m pip install -r requirements.txt
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Run the app

From the project root:

```bash
python run_dev.py
```

The app starts:

- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/docs

### 5. Optional local AI setup

1. Install and start Ollama.
2. Pull a model:

```bash
ollama run qwen2.5:latest
```

3. SurvivalOS will detect it automatically at localhost:11434.

### 6. Cloudflare demo

```bash
python run_cloudflare_demo.py
```

This launches a secure demo tunnel for quick sharing.

---

## Project Structure

```text
SURVIVAL-OS-/
├── backend/
│   ├── routers/
│   ├── agent_orchestrator.py
│   ├── calculators.py
│   ├── database.py
│   ├── decision_engine.py
│   ├── llm_provider.py
│   ├── main.py
│   ├── models.py
│   ├── rag_engine.py
│   ├── schemas.py
│   └── tool_registry.py
├── data/
│   └── apocalypse.db
├── docs/
│   ├── AI_AGENT.md
│   ├── ARCHITECTURE.md
│   ├── CLOUDFLARE_DEMO.md
│   ├── MAPS.md
│   ├── OFFLINE_MODE.md
│   ├── SECURITY.md
│   └── UI_UX_ENHANCEMENTS.md
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── knowledge/
│   └── curated_handbook/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── RELEASE_NOTES.md
├── run_cloudflare_demo.py
├── run_dev.py
└── .gitignore
```

---

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/system/status | System health and score summary |
| GET | /api/system/preparedness_score | Detailed readiness audit |
| POST | /api/agent/query | Send an emergency query |
| GET | /api/inventory/items | List inventory |
| POST | /api/inventory/items | Add inventory item |
| GET | /api/inventory/water_iq | Water planning calculator |
| GET | /api/inventory/food_iq | Food runway calculator |
| GET | /api/maps/markers | Retrieve map markers |
| POST | /api/maps/markers | Add a new survivor marker |
| GET | /api/tasks/list | Fetch task list |
| POST | /api/tasks/{task_id}/toggle | Update task status |
| GET | /api/emergency/contacts | Show emergency contacts |
| GET | /api/knowledge/search?q={query} | Search local handbook |

---

## Privacy & Reliability

- 🔒 No third-party trackers or analytics
- 💾 Data remains on-device in SQLite
- 🛡️ AI tool use is restricted to safe operation boundaries
- ⚡ Deterministic fallback ensures the app keeps working even when AI fails

---

## Roadmap

- [x] Tactical emergency dashboard
- [x] Hybrid AI + fallback engine
- [x] Offline survival map
- [x] Curated offline knowledge database
- [ ] Battery saver / blackout UI mode
- [ ] Mesh radio integration
- [ ] Printable bug-out emergency cards

---

## Contributing

Contributions are welcome from developers, emergency planners, and survivalists who care about offline-first reliability and practical readiness.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

---

## Author

**Shalok**

- GitHub: [@Shalokexe](https://github.com/Shalokexe)
- Repository: [SURVIVAL-OS-](https://github.com/Shalokexe/SURVIVAL-OS-)

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
For now there is no as such license but in future yeah we will make a whole big license for us ☺️.


Stay here and we will update for pur app as soon as possible.
les meet some other day man 
---

<div align="center">
  <sub>Built for resilience. Prepared for anything. 🛡️</sub>
</div>
