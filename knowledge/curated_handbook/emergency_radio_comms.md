# Emergency Radio Communications & Distress Frequencies

> **Classification:** Curated Tactical Communications Protocol  
> **Source Grounding:** ITU Radio Regulations, FCC Part 95/97, ICAO Annex 10, FEMA National Incident Management System (NIMS)

---

## 1. Universal Distress & Emergency Frequencies

When cellular towers fail and wired infrastructure collapses, radio frequency (RF) broadcasts are the only viable long-range communication medium.

| Service / Band | Frequency | Channel / Designation | Usage & Protocol |
| :--- | :--- | :--- | :--- |
| **Marine VHF** | `156.800 MHz` | **Channel 16** | International Maritime Distress, Safety, and Calling. Strict emergency traffic only. |
| **Marine VHF** | `156.450 MHz` | **Channel 9** | Secondary calling and inter-ship safety channel. |
| **Aviation VHF** | `121.500 MHz` | **International Air Distress (IAD)** | Civilian aircraft emergency, ELT beacon monitoring. |
| **Aviation UHF** | `243.000 MHz` | **Military Air Distress (MAD)** | Military emergency channel, EPIRB search and rescue. |
| **Citizen Band (CB)** | `27.065 MHz` | **Channel 9** | Emergency calling, roadside assistance, traveler distress. |
| **Citizen Band (CB)** | `27.185 MHz` | **Channel 19** | Highway communication, trucker traffic, convoy coordination. |
| **HAM (2-Meter)** | `146.520 MHz` | **National Simplex Calling** | Standard VHF calling frequency for licensed amateur operators. |
| **HAM (70-Centimeter)**| `446.000 MHz` | **National Simplex Calling** | Standard UHF calling frequency for urban building penetration. |
| **GMRS** | `462.675 MHz` | **Channel 20 / Repeater Output** | Official nationwide emergency and traveler assistance repeater frequency. |
| **FRS** | `462.5625 MHz` | **Channel 1** | Standard family radio emergency calling and muster channel. |

---

## 2. NOAA Weather Radio (NWR) All-Hazards Broadcast Network

Monitor these 7 dedicated VHF FM frequencies for real-time natural disaster alerts, civil defense bulletins, and evacuation orders:

1. **`162.400 MHz`** (Channel WX2)
2. **`162.425 MHz`** (Channel WX4)
3. **`162.450 MHz`** (Channel WX5)
4. **`162.475 MHz`** (Channel WX3)
5. **`162.500 MHz`** (Channel WX6)
6. **`162.525 MHz`** (Channel WX7)
7. **`162.550 MHz`** (Channel WX1)

---

## 3. Standard Distress Call Formats

### A. MAYDAY (Imminent Danger of Loss of Life or Vessel)
Repeat **"MAYDAY"** 3 times, followed by the standardized report:
1. **Identity**: Station / Name / Call Sign (e.g., *"Survivor Station Blue-One"*).
2. **Position**: Exact GPS coordinates, landmark, or street intersection.
3. **Nature of Distress**: Immediate hazard (e.g., *"Structural collapse, 2 injured"*).
4. **Assistance Required**: Medical, evacuation, extraction.
5. **Number of People**: Adults, children, injured status.
6. **Over**: Release push-to-talk (PTT) and listen for acknowledgment.

### B. PAN-PAN (Urgent Situation, Not Immediately Life-Threatening)
Repeat **"PAN-PAN"** 3 times when safety of a person or shelter is compromised but not in immediate catastrophic failure (e.g., urgent medical advice needed, approaching floodwaters).

### C. SECURITE (Safety Bulletin / Hazard Warning)
Repeat **"SECURITE"** 3 times to broadcast a navigational, road blockage, or contaminated water hazard to all listening stations.

---

## 4. International NATO Phonetic Alphabet

Use phonetic spelling for coordinates, street names, blood types, and call signs to prevent distortion over noisy radio static:

- **A** - Alpha
- **B** - Bravo
- **C** - Charlie
- **D** - Delta
- **E** - Echo
- **F** - Foxtrot
- **G** - Golf
- **H** - Hotel
- **I** - India
- **J** - Juliet
- **K** - Kilo
- **L** - Lima
- **M** - Mike
- **N** - November
- **O** - Oscar
- **P** - Papa
- **Q** - Quebec
- **R** - Romeo
- **S** - Sierra
- **T** - Tango
- **U** - Uniform
- **V** - Victor
- **W** - Whiskey
- **X** - X-ray
- **Y** - Yankee
- **Z** - Zulu

---

## 5. Power & Battery Preservation Rules for Two-Way Radios

1. **Transmit Low Power**: Default to low wattage (0.5W–1W) for line-of-sight checks. Only switch to high power (5W+) when establishing initial contact.
2. **Strict Time Limits**: Transmit for no longer than 15–20 seconds per transmission. Receiving consumes ~50mA; transmitting consumes up to ~1500mA (30x more battery).
3. **Scheduled Comms Window**: Establish a 5-minute listening window at the top of every hour (e.g. 12:00–12:05, 13:00–13:05) and power off radios in between.
