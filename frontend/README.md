# 🖥️ SurvivalOS — Tactical Frontend HUD

The frontend for **SurvivalOS** is built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Leaflet**. It delivers a high-contrast tactical dark command interface optimized for emergency telemetry, map marking, and offline resiliency.

---

## 🎨 Features & Views

- 🛡️ **Command Center (`CommandCenter.tsx`)**: Central tactical dashboard showing real-time preparedness score, critical tasks, deficit alerts, and system health.
- 🤖 **AI Copilot Console (`AIAgentView.tsx`)**: Split-terminal interface for emergency triage, structured action steps, hazard avoidance warnings, and handbook citations.
- 🗺️ **Survival Map (`SurvivalMap.tsx`)**: Leaflet OpenStreetMap canvas supporting custom marker pins (`SHELTER`, `WATER`, `FOOD`, `MEDICAL`, `HAZARD`, etc.) with confidence decay ratings.
- 💧 **Water IQ (`WaterIQ.tsx`)**: Household quota estimator, purification method guides (boiling, chlorination, SODIS, filtration), and rainwater catchment calculator.
- 🥫 **Food IQ (`FoodIQ.tsx`)**: Caloric runway counter, shelf-life tracker, and culinary/medicinal resource substitution finder.
- 📦 **Inventory Manager (`InventoryManager.tsx`)**: Inventory catalog with storage location tags, expiration warnings, and deficit alerts.
- ⚡ **Emergency Vault (`EmergencyVault.tsx`)**: Offline personal medical profiles, allergy alerts, blood group records, and ICE contact deck.
- 📖 **Survival Handbook (`SurvivalHandbook.tsx`)**: Built-in reader for bundled offline disaster manuals.
- 📋 **Task Board (`TaskBoard.tsx`)**: Triage workflow organized into *First 15 Min*, *First Hour*, and *First 24 Hours*.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Vite Dev Server
```bash
npm run dev
```

The application will be accessible at [http://localhost:5173](http://localhost:5173).

### 3. Production Build
```bash
npm run build
npm run preview
```
