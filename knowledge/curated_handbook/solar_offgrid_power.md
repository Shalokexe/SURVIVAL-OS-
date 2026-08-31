# Off-Grid Solar Power & Battery Storage Survival Guide ☀️🔋

## 1. Core Principles of Off-Grid Solar Energy

During multi-day grid failure or total infrastructure blackout, solar energy paired with battery storage provides sustainable, zero-fuel electrical power for critical life-support devices:
- **Radio Transceivers** (HAM / VHF / FRS)
- **Water Purification Devices** (UV sterilizers, electric boil kettles)
- **Emergency Medical Equipment** (CPAP, pulse oximeters, refrigeration for temperature-sensitive insulin/vaccines)
- **Illumination & Signaling** (OLED low-wattage lighting, visual emergency strobes)

---

## 2. Solar Panel & Battery Sizing Sizing Formulas

### Daily Load Budget (Watt-Hours / Wh)
$$\text{Wh Daily} = \sum (\text{Device Wattage} \times \text{Hours Run per Day})$$

*Example emergency budget:*
- 10W LED Lighting x 4h = 40 Wh
- 15W VHF Radio x 3h = 45 Wh
- 5W Phone Charging x 4h = 20 Wh
- 45W 12V Portable Cooler x 8h = 360 Wh
- **Total Daily Energy Budget**: **465 Wh/day**

### Panel Wattage Sizing
$$\text{Required Panel Array (Watts)} = \frac{\text{Daily Wh Budget}}{\text{Peak Sun Hours} \times 0.75 \text{ (System Derating Factor)}}$$

*If receiving 4 Peak Sun Hours:*
$$\text{Panel Array} = \frac{465}{4 \times 0.75} = \frac{465}{3} \approx 155\text{ Watts}$$

### Battery Bank Capacity Sizing
$$\text{Battery Capacity (Ah)} = \frac{\text{Daily Wh Budget} \times \text{Days of Autonomy}}{\text{System Voltage} \times \text{Max Usable DoD}}$$

*For 12V LiFePO4 (80% Max Depth of Discharge - DoD) with 2 Days Autonomy:*
$$\text{Battery Capacity} = \frac{465 \times 2}{12 \times 0.80} = \frac{930}{9.6} \approx 96.8\text{ Ah @ 12V}$$

---

## 3. Battery Chemistries Comparison

| Feature | LiFePO4 (Lithium Iron Phosphate) | AGM / Lead-Acid | Gel Lead-Acid |
| :--- | :--- | :--- | :--- |
| **Usable DoD** | 80% – 90% | 50% max | 50% max |
| **Cycle Life** | 3000–5000 cycles | 300–500 cycles | 500–800 cycles |
| **Weight** | Extremely Lightweight (~1/3 AGM) | Heavy | Heavy |
| **Freezing Charge Danger** | **DO NOT CHARGE below 0°C (32°F)** without internal heater | Can charge below freezing | Can charge below freezing |
| **Thermal Runaway Risk** | Extremely Safe / Stable | Minimal (venting gas) | Minimal |

---

## 4. Charge Controllers: MPPT vs PWM

1. **MPPT (Maximum Power Point Tracking)**:
   - **Efficiency**: 93%–98%.
   - Converts excess voltage into extra charging current.
   - Essential for cold climates or high-voltage solar panels connected to lower-voltage battery banks.
2. **PWM (Pulse Width Modulation)**:
   - **Efficiency**: 65%–75%.
   - Direct switch-mode connection. Panel voltage is pulled down to battery voltage, wasting solar potential.
   - Suitable only for small arrays (<100W).

---

## 5. Wiring Configurations & Wire Gauge Safety

### Series vs Parallel Panel Arrays
- **Series Wiring (Panel + to Panel -)**:
  - Voltage adds ($V_{total} = V_1 + V_2$), Amperage remains constant.
  - Reduced current allows thinner copper wire with lower $I^2R$ heat loss over long distances.
  - *Warning*: Shading on one panel drops the entire series string output.
- **Parallel Wiring (Panel + to +, - to -)**:
  - Amperage adds ($I_{total} = I_1 + I_2$), Voltage remains constant.
  - Better shade tolerance. Requires thicker wire gauges to prevent voltage drop.

### Wire Gauge Sizing Table (12V DC, Max 3% Voltage Drop)

| Current (Amps) | 5 Feet | 10 Feet | 20 Feet |
| :--- | :--- | :--- | :--- |
| **5 A** | 16 AWG | 14 AWG | 10 AWG |
| **10 A** | 14 AWG | 12 AWG | 8 AWG |
| **20 A** | 10 AWG | 8 AWG | 4 AWG |
| **30 A** | 8 AWG | 6 AWG | 2 AWG |

---

## 6. Cold Weather & Low-Sun Survival Hacks

1. **Snow Clearing & Tilt Angle**: Tilt solar panels to $\text{Latitude} + 15^\circ$ during winter months to slide off snow automatically and capture low-horizon sun angles.
2. **Ground Snow Reflectivity (Albedo)**: Place panels directly facing snow-covered ground to harvest up to 30% additional reflected photon energy.
3. **Battery Warming**: Store lithium batteries inside insulated thermal wraps or inside living quarters. Charging frozen lithium cells permanently damages the internal anode.
