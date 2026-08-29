from typing import List, Dict, Any

class SurvivalCalculators:
    @staticmethod
    def calculate_water_iq(total_liters: float, adults: int, children: int, elderly: int) -> Dict[str, Any]:
        household_size = max(1, adults + children + elderly)
        # Daily water requirement: 3.5L per adult/elderly, 2.5L per child
        daily_liters = (adults + elderly) * 3.5 + (children * 2.5)
        days_remaining = round(total_liters / daily_liters, 1) if daily_liters > 0 else 0.0

        # Dew collection estimate (approx 0.5 to 1.5L per night per 10m² plastic sheet in humid conditions)
        dew_estimate = "0.5L - 1.5L per night using a 10m² plastic collection tarp in morning dew conditions."
        
        # Rainwater collection estimate: Area (100 sqm) * Rainfall (10 mm) * Efficiency (0.8) = 800 Liters
        rain_estimate = "800 Liters potential yield per 10mm rainfall on a 100 m² clean roof catchment."

        recommendations = []
        if days_remaining < 3:
            recommendations.append("URGENT: Water reserves critical (< 3 days). Fill all clean bathtubs, sinks, and containers immediately.")
            recommendations.append("Strict rationing: Limit non-potable water usage; prioritize drinking and basic hygiene.")
        elif days_remaining < 7:
            recommendations.append("WARNING: Water reserves adequate for short term. Locate rainwater/dew collection materials.")
        else:
            recommendations.append("Water reserves currently stable. Ensure all stored water containers are sealed and kept out of direct sunlight.")

        return {
            "total_water_liters": total_liters,
            "household_size": household_size,
            "daily_consumption_liters": daily_liters,
            "days_remaining": days_remaining,
            "dew_collection_estimate": dew_estimate,
            "rainwater_collection_estimate": rain_estimate,
            "recommendations": recommendations
        }

    @staticmethod
    def calculate_food_iq(inventory_items: List[Dict[str, Any]], adults: int, children: int, elderly: int) -> Dict[str, Any]:
        household_size = max(1, adults + children + elderly)
        daily_calories = (adults + elderly) * 2000 + children * 1500

        total_calories = 0.0
        items_breakdown = []

        for item in inventory_items:
            cat = str(item.get("category", "")).lower()
            qty = float(item.get("quantity", 0))
            cal = float(item.get("calories_per_unit", 0))

            if cal > 0:
                item_cal = qty * cal
            else:
                # Default energy estimates if not specified
                name = str(item.get("name", "")).lower()
                unit = str(item.get("unit", "")).lower()
                if "rice" in name or "flour" in name or "dal" in name or "grain" in name:
                    item_cal = qty * 3500 # ~3500 kcal/kg
                elif "can" in name or "canned" in name or unit in ["can", "cans"]:
                    item_cal = qty * 450 # ~450 kcal per can
                elif "biscuit" in name or "bar" in name or "snack" in name:
                    item_cal = qty * 500
                elif "oil" in name or "ghee" in name:
                    item_cal = qty * 8000 # ~8000 kcal/Liter
                else:
                    item_cal = qty * 300 if cat == "food" else 0.0

            total_calories += item_cal
            items_breakdown.append({
                "name": item.get("name"),
                "quantity": qty,
                "unit": item.get("unit"),
                "estimated_calories": round(item_cal, 0)
            })

        days_remaining = round(total_calories / daily_calories, 1) if daily_calories > 0 else 0.0

        recommendations = []
        if days_remaining < 3:
            recommendations.append("URGENT: Food supply critical. Ration high-density protein/carbohydrate staples.")
        elif days_remaining < 14:
            recommendations.append("Consume perishable fresh produce and dairy first before opening sealed canned reserves.")
        else:
            recommendations.append("Food reserves adequate. Maintain dry, cool, dark storage conditions to prevent pest infestation.")

        return {
            "total_calories": round(total_calories, 0),
            "household_size": household_size,
            "daily_calories_needed": daily_calories,
            "days_remaining": days_remaining,
            "items_breakdown": items_breakdown,
            "recommendations": recommendations
        }

    @staticmethod
    def get_resource_substitution(missing_item: str) -> Dict[str, Any]:
        item_lower = missing_item.lower()
        substitutions = {
            "flashlight": [
                "Phone camera LED light (preserve battery by using lowest brightness)",
                "Rechargeable LED camp lantern",
                "Candles / Oil lamp (place inside jar for wind/fire safety)",
                "Solar garden lights brought indoors at night"
            ],
            "water filter": [
                "Boil water vigorously for 1 full minute",
                "SODIS Method: 6 hours direct solar exposure in clear PET plastic bottle",
                "Unscented household bleach (2 drops per 1 Liter clear water, wait 30 min)",
                "DIY Sand, Gravel, and Activated Charcoal gravity filter (boil after filtering)"
            ],
            "first aid kit": [
                "Clean cotton cloth / t-shirts for tourniquet/bandages",
                "Honey or Petroleum Jelly for minor burns/scrapes",
                "Salt water solution (1 tsp salt per 500ml clean water) for wound irrigation",
                "Cardboard / magazines for bone fracture splinting"
            ],
            "stove": [
                "Outdoor charcoal / campfire pit",
                "DIY Can Alcohol Stove (using hand sanitizer or 70%+ isopropyl alcohol)",
                "Solar oven (box lined with aluminum foil & glass cover)"
            ],
            "power": [
                "Car battery with 12V USB adapter",
                "Hand-crank radio with USB charge port",
                "Solar power bank placed in direct sunlight"
            ]
        }

        for key, value in substitutions.items():
            if key in item_lower:
                return {
                    "missing_item": missing_item,
                    "matched_category": key,
                    "alternatives": value,
                    "safety_warning": "Ensure proper ventilation and fire safety when using emergency light/heat alternatives."
                }

        return {
            "missing_item": missing_item,
            "matched_category": "general",
            "alternatives": [
                "Check secondary household storage or vehicle emergency kit",
                "Consult neighbor/community trade network",
                "Review Offline Survival Handbook for improvised tools"
            ],
            "safety_warning": "Improvised tools must be inspected for electrical, chemical, or fire safety hazards before use."
        }

    @staticmethod
    def calculate_preparedness_scores(
        water_days: float,
        food_days: float,
        has_medical: bool,
        has_power: bool,
        has_comm: bool,
        has_map: bool,
        has_sanitation: bool,
        has_shelter: bool
    ) -> Dict[str, float]:
        water_score = min(100.0, (water_days / 14.0) * 100.0)
        food_score = min(100.0, (food_days / 14.0) * 100.0)
        medical_score = 90.0 if has_medical else 30.0
        power_score = 85.0 if has_power else 25.0
        comm_score = 80.0 if has_comm else 20.0
        nav_score = 95.0 if has_map else 40.0
        sanitation_score = 85.0 if has_sanitation else 30.0
        shelter_score = 90.0 if has_shelter else 50.0
        planning_score = 80.0

        overall = round(
            (water_score * 0.20) +
            (food_score * 0.20) +
            (medical_score * 0.15) +
            (shelter_score * 0.10) +
            (power_score * 0.10) +
            (comm_score * 0.10) +
            (nav_score * 0.05) +
            (sanitation_score * 0.05) +
            (planning_score * 0.05),
            1
        )

        return {
            "overall_score": overall,
            "water_score": round(water_score, 1),
            "food_score": round(food_score, 1),
            "medical_score": round(medical_score, 1),
            "shelter_score": round(shelter_score, 1),
            "power_score": round(power_score, 1),
            "communication_score": round(comm_score, 1),
            "navigation_score": round(nav_score, 1),
            "sanitation_score": round(sanitation_score, 1),
            "emergency_planning_score": round(planning_score, 1),
        }
