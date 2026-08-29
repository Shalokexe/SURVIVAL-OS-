# ⚡ SurvivalOS — v1.0.0-beta.3 Release Notes

> **Offline-First Personal Survival Intelligence & Emergency Command Terminal**  
> *"Internet when available. Intelligence when unavailable."*

We are thrilled to release **Beta Update (`v1.0.0-beta.3`)** of **SurvivalOS**, introducing the **Apocalypse Minimal OS Mode** for extreme battery conservation and the **START First-Aid Triage & CPR Metronome** engine!

---

## 🌟 What's New in v1.0.0-beta.3?

### 🔋 1. Apocalypse Minimal OS Mode (0-Lux Battery Saver)
- **Deep Black OLED Theme (`#000000`)**: Designed specifically for multi-day blackouts and off-grid emergencies to eliminate display power consumption and minimize CPU/GPU load.
- **Customizable Survival Homescreen**: Pin and unpin your most critical survival apps (AI Copilot, Water IQ, First Aid & CPR, Map, Radio Deck).
- **Live Battery Telemetry**: Shows real-time battery percentage, charging state, and power warnings via `navigator.getBattery()`.
- **Emergency Tool Strip**: Instant one-tap access to a White Screen Flashlight, 800Hz SOS audio beacon, and quick tactical switch.

### 🩺 2. START First-Aid Triage & 110 BPM CPR Metronome
- **Interactive START Mass Casualty Flowchart**: Rapid 60-second triage algorithm evaluating ambulation, respiration rate, perfusion, and mental status into **RED (Immediate)**, **YELLOW (Delayed)**, **GREEN (Minor)**, and **BLACK (Expectant)** categories.
- **110 BPM Acoustic CPR Metronome**: AHA/ERC standardized audio beat with visual chest compression target and 30:2 rescue breath prompt.
- **Curated Offline Handbook Guide**: `start_triage_cpr.md` indexed for immediate local AI query citations.

---

## 🛡️ Existing Core Capabilities in Beta
- **Tactical Command HUD**: Dynamic preparedness score and 30-day expiration alerts.
- **Hybrid AI Copilot**: Dual-engine intelligence (Local Ollama neural model + deterministic rule fallback).
- **Offline Leaflet Map**: Interactive GIS spatial markers with confidence decay.
- **Water IQ & Food IQ**: Household quotas, rainwater catchment modeling, and smart ingredient substitutions.
- **Instant Cloudflare Live Demo**: One-click public HTTPS tunnel via `python run_cloudflare_demo.py`.

---

## 📦 Getting Started

### Quick Start
```bash
git clone https://github.com/Shalokexe/SURVIVAL-OS-.git
cd SURVIVAL-OS-

# Run the unified launcher:
python run_dev.py
```

### Live Demo via Cloudflare
```bash
python run_cloudflare_demo.py
```

---

## 💬 Feedback & Bug Reports
Since this is an active beta release, please report issues or feature ideas on our [GitHub Issues](https://github.com/Shalokexe/SURVIVAL-OS-/issues) tracker!
