from typing import Dict, Any, List

class DecisionEngine:
    SCENARIO_RULES = {
        "power_outage": {
            "risk_level": "MODERATE",
            "immediate_priority": "Preserve mobile battery power, secure indoor lighting, and isolate refrigeration.",
            "actions": [
                "Switch mobile devices to Ultra Low Power / Battery Saver mode immediately.",
                "Keep refrigerator and freezer doors closed tightly (holds safe temp for ~4-48 hours).",
                "Disconnect sensitive electronics from wall outlets to protect against voltage surges when power returns.",
                "Establish safe battery or solar LED lighting; avoid open flames near flammable curtains.",
                "Verify water pressure; store emergency drinking water if municipal pumps rely on power grid."
            ],
            "avoid": [
                "Running fuel generators indoors or in garage (Carbon Monoxide hazard).",
                "Repeatedly opening refrigerator doors to check food status.",
                "Draining phone battery on social media or non-essential apps."
            ]
        },
        "water_shortage": {
            "risk_level": "CRITICAL",
            "immediate_priority": "Inventory existing water reserves and implement immediate strict rationing.",
            "actions": [
                "Fill all available clean containers, bottles, pots, and bathtubs immediately.",
                "Calculate daily family requirement: minimum 3.5 Liters/adult/day.",
                "Prepare water purification methods: boiling (1 min) or bleach (2 drops/Liter).",
                "Set up rainwater catchment tarps or dew collectors if atmospheric conditions permit.",
                "Discontinue using tap water for toilet flushing or washing until source is secured."
            ],
            "avoid": [
                "Drinking unboiled or untreated surface water from puddles or urban runoff.",
                "Wasting potable water on washing clothes, dishes, or bathing.",
                "Using container storage exposed to direct sunlight without covers."
            ]
        },
        "food_shortage": {
            "risk_level": "HIGH",
            "immediate_priority": "Inventory perishable vs non-perishable stocks and establish calorie rationing.",
            "actions": [
                "Consume perishable fresh produce, meat, and dairy before opening sealed cans or dried grains.",
                "Ration high-calorie staples (rice, flour, dal, oil, peanut butter).",
                "Prepare meals requiring minimal water consumption for boiling.",
                "Keep food stores sealed in airtight containers to prevent insect or rodent contamination."
            ],
            "avoid": [
                "Overeating early in the crisis out of anxiety.",
                "Leaving open food packages exposed in warm ambient temperatures."
            ]
        },
        "flood": {
            "risk_level": "CRITICAL",
            "immediate_priority": "Move to higher ground immediately and isolate electrical systems.",
            "actions": [
                "Disconnect main electricity breaker if water approaches shelter threshold.",
                "Move emergency bug-out bag, medical kit, clean water, and documents to 2nd floor or roof access.",
                "Monitor offline radio or public advisory channels for evacuation routes.",
                "Wear sturdy boots and carry a long stick to test ground depth when moving."
            ],
            "avoid": [
                "Walking or driving through moving floodwaters (15cm water can knock down an adult; 30cm floats a car).",
                "Touching submerged electrical cables or equipment.",
                "Drinking floodwater under any circumstances."
            ]
        },
        "earthquake": {
            "risk_level": "CRITICAL",
            "immediate_priority": "DROP, COVER, AND HOLD ON. Guard against aftershocks.",
            "actions": [
                "Take shelter under a sturdy table or desk; cover head and neck.",
                "Once shaking stops, inspect for gas leaks, electrical shorts, and structural cracks.",
                "Shut off main gas valve if smell of gas is present.",
                "Evacuate damaged building calmly to open ground away from power lines and brick facades."
            ],
            "avoid": [
                "Using elevators after seismic activity.",
                "Using open flame (matches, lighters) in case of hidden gas pipe fractures.",
                "Standing near exterior glass windows or heavy masonry shelves."
            ]
        },
        "pandemic": {
            "risk_level": "HIGH",
            "immediate_priority": "Reduce exposure risk, isolate vulnerable household members, enforce strict hygiene.",
            "actions": [
                "Establish a clean quarantine zone for infected or symptomatic family members.",
                "Maintain physical distance, wear N95/FFP2 masks in shared indoor spaces, and maximize natural cross-ventilation.",
                "Sanitize high-touch surfaces (doorknobs, faucets, light switches) regularly.",
                "Maintain hydration, stock oral rehydration salts, fever reducers (Paracetamol), and pulse oximeter."
            ],
            "avoid": [
                "Attending crowded indoor gatherings or unventilated spaces.",
                "Sharing eating utensils, towels, or bedding with symptomatic individuals.",
                "Self-administering unverified or dangerous chemical self-treatments."
            ]
        },
        "evacuation": {
            "risk_level": "CRITICAL",
            "immediate_priority": "Execute pre-planned evacuation route with 72-hour bug-out bag.",
            "actions": [
                "Grab emergency vault documents, primary medical kit, 3L water per person, and non-perishable food.",
                "Check Offline Survival Map for primary and secondary unblocked routes.",
                "Lock all shelter entry doors and windows; leave a notice note for emergency responders if appropriate.",
                "Maintain communication with household members using predefined meeting points."
            ],
            "avoid": [
                "Delaying evacuation to pack non-essential heavy household items.",
                "Taking main highway routes if severe traffic gridlock is reported without backup secondary routes."
            ]
        },
        "zombie_simulation": {
            "risk_level": "EXTREME (SIMULATION)",
            "immediate_priority": "Secure perimeter defense, institute complete light/sound blackout, audit weapons and water.",
            "actions": [
                "Barricade ground-floor windows and doors using heavy furniture and timber.",
                "Maintain complete light blackout during darkness hours; use dim red lights in windowless interior rooms.",
                "Consolidate water, canned food, and medical supplies in central safe room.",
                "Establish 24-hour perimeter watch rotation among adults."
            ],
            "avoid": [
                "Making unneeded noise or broadcasting lights from windows.",
                "Investigating unknown noises outside alone without a buddy."
            ]
        }
    }

    @classmethod
    def evaluate(cls, user_prompt: str, scenario_key: str = "power_outage") -> Dict[str, Any]:
        prompt_lower = user_prompt.lower()
        
        # Detect scenario from prompt if generic
        selected = scenario_key.lower().replace(" ", "_")
        if "flood" in prompt_lower or "water rising" in prompt_lower or "submerged" in prompt_lower:
            selected = "flood"
        elif "quake" in prompt_lower or "tremor" in prompt_lower:
            selected = "earthquake"
        elif "evacuat" in prompt_lower or "leave" in prompt_lower or "escape" in prompt_lower:
            selected = "evacuation"
        elif "zombie" in prompt_lower or "simulation" in prompt_lower:
            selected = "zombie_simulation"
        elif "virus" in prompt_lower or "disease" in prompt_lower or "outbreak" in prompt_lower:
            selected = "pandemic"
        elif "power" in prompt_lower or "blackout" in prompt_lower or "electricity" in prompt_lower:
            selected = "power_outage"
        elif "water" in prompt_lower or "thirst" in prompt_lower or "drink" in prompt_lower:
            selected = "water_shortage"
        elif "food" in prompt_lower or "eat" in prompt_lower or "hungry" in prompt_lower:
            selected = "food_shortage"

        rule = cls.SCENARIO_RULES.get(selected, cls.SCENARIO_RULES["power_outage"])

        return {
            "scenario": selected,
            "risk_level": rule["risk_level"],
            "immediate_priority": rule["immediate_priority"],
            "actions": rule["actions"],
            "avoid": rule["avoid"]
        }
