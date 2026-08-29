# 🗺️ Tactical GIS & Offline Map Engine

## 1. Overview

The **SurvivalOS Map Engine** is built with **Leaflet** and **React-Leaflet**, designed to provide immediate spatial awareness, hazard avoidance, and supply depot navigation without depending on persistent satellite or cellular data connections.

---

## 2. Marker Taxonomy & Color Codes

| Category | Icon / Type | Default Status | Recommended Use |
| :--- | :--- | :--- | :--- |
| **Shelter** | `SHELTER` | `SAFE` | Primary household, bug-out cabin, fallout bunker, reinforced structure |
| **Water** | `WATER` | `SAFE` | Clean borewells, natural springs, rainwater tanks, filtration points |
| **Medical** | `MEDICAL` | `UNKNOWN` | Field hospitals, local pharmacies, emergency rooms, trauma kits |
| **Food** | `FOOD` | `SAFE` | Grain silos, foraging groves, emergency food pantries, orchards |
| **Power** | `POWER` | `SAFE` | Solar charging stations, micro-hydro generators, battery banks |
| **Fuel** | `FUEL` | `UNKNOWN` | Gas stations, diesel stores, firewood reserves, propane tanks |
| **Hazard** | `HAZARD` | `DANGER` | Flooded roads, structural collapses, toxic spills, downed power lines |
| **Checkpoint**| `CHECKPOINT`| `UNKNOWN` | Military checkpoints, roadblock barriers, civil defense stations |

---

## 3. Confidence Decay Model

In crisis situations, old intelligence becomes dangerous intelligence. Markers support three confidence levels:

1. **`CONFIRMED`** (Green badge): Verified on-site within the last 24 hours.
2. **`RECENTLY_CHECKED`** (Amber badge): Inspected within the last 7 days; conditions may have changed.
3. **`OLD_INFO`** (Red/Gray badge): Untrusted / stale report (>7 days ago); requires scout reconnaissance before approaching.

---

## 4. Geospatial Data Schema

All markers are persisted in SQLite via SQLAlchemy with the following schema:

```sql
CREATE TABLE map_markers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    marker_type VARCHAR(50) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    status VARCHAR(20) DEFAULT 'UNKNOWN',
    confidence VARCHAR(30) DEFAULT 'CONFIRMED',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
