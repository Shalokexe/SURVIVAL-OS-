import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from decision_engine import DecisionEngine
from llm_provider import OllamaProvider
from rag_engine import OfflineRAGEngine
from tool_registry import ToolRegistry
import schemas

class AgentOrchestrator:
    def __init__(self, rag_engine: OfflineRAGEngine):
        self.rag_engine = rag_engine
        self.tool_registry = ToolRegistry(rag_engine)
        self.ollama_provider = OllamaProvider()

    def process_query(self, query: str, scenario_key: str, db: Session) -> schemas.StructuredAgentResponse:
        # 1. Evaluate scenario and risk level deterministically
        decision_data = DecisionEngine.evaluate(query, scenario_key)

        # 2. Retrieve local knowledge via RAG
        rag_results = self.rag_engine.search(query, top_k=2)
        sources_used = [f"{doc['title']} ({doc['source']})" for doc in rag_results]

        # 3. Retrieve local context from tool registry
        water_info = self.tool_registry.calculate_water(db)
        food_info = self.tool_registry.calculate_food(db)
        saved_markers = self.tool_registry.find_saved_markers(db)

        # Build context summary
        inventory_summary = (
            f"Water Supply: {water_info['total_water_liters']}L ({water_info['days_remaining']} days remaining). "
            f"Food Supply: {food_info['total_calories']} kcal ({food_info['days_remaining']} days remaining). "
            f"Saved Map Markers: {len(saved_markers)} markers."
        )

        # 4. Check if Ollama model is available
        ollama_status = self.ollama_provider.check_status()
        llm_response = None

        if ollama_status.get("installed") and ollama_status.get("status") == "ready":
            system_prompt = (
                "You are APOCALYPSE AI, an offline survival intelligence assistant. "
                "Provide direct, concise, action-oriented survival advice in JSON format matching keys: "
                "situation, risk_level, do_this_now (array of strings), why, what_you_have (array), "
                "what_you_may_need (array), avoid (array), next_check."
            )
            user_prompt = (
                f"User Scenario: {decision_data['scenario']}\n"
                f"User Query: {query}\n"
                f"Household Context: {inventory_summary}\n"
                f"Handbook Knowledge: {[r['content'][:200] for r in rag_results]}\n"
                "Generate structured JSON response."
            )
            raw_text = self.ollama_provider.generate(user_prompt, system_prompt=system_prompt)
            if raw_text:
                try:
                    # Attempt to extract JSON from Ollama output
                    json_start = raw_text.find('{')
                    json_end = raw_text.rfind('}')
                    if json_start != -1 and json_end != -1:
                        parsed = json.loads(raw_text[json_start:json_end + 1])
                        return schemas.StructuredAgentResponse(
                            situation=parsed.get("situation", f"Current emergency condition: {decision_data['scenario'].replace('_', ' ').title()}."),
                            risk_level=parsed.get("risk_level", decision_data["risk_level"]),
                            do_this_now=parsed.get("do_this_now", decision_data["actions"]),
                            why=parsed.get("why", decision_data["immediate_priority"]),
                            what_you_have=parsed.get("what_you_have", [f"Water: {water_info['days_remaining']} days", f"Food: {food_info['days_remaining']} days"]),
                            what_you_may_need=parsed.get("what_you_may_need", ["Backup batteries", "Rainwater catchment", "First aid supplies"]),
                            avoid=parsed.get("avoid", decision_data["avoid"]),
                            next_check=parsed.get("next_check", "Re-assess situation and inventory in 1 hour."),
                            sources_used=sources_used,
                            is_offline=True,
                            model_name=ollama_status.get("active_model", "Qwen3 Local")
                        )
                except Exception:
                    pass

        # 5. Rule-Engine & RAG Fallback Response (Guaranteed reliable response)
        what_you_have = [
            f"Water: {water_info['total_water_liters']}L (~{water_info['days_remaining']} days supply)",
            f"Food: {food_info['total_calories']} kcal (~{food_info['days_remaining']} days supply)"
        ]
        if saved_markers:
            what_you_have.append(f"{len(saved_markers)} personal map markers recorded")

        what_you_need = []
        if water_info['days_remaining'] < 7:
            what_you_need.append("Additional clean water container capacity & purification bleach")
        if food_info['days_remaining'] < 14:
            what_you_need.append("Non-perishable canned protein and calorie-dense grains")
        if not what_you_need:
            what_you_need.append("Backup power supplies and communications battery reserves")

        return schemas.StructuredAgentResponse(
            situation=f"Active Emergency: {decision_data['scenario'].replace('_', ' ').title()}. {decision_data['immediate_priority']}",
            risk_level=decision_data["risk_level"],
            do_this_now=decision_data["actions"],
            why=f"Immediate threat mitigation for {decision_data['scenario'].replace('_', ' ')}. Risk factor evaluated as {decision_data['risk_level']}.",
            what_you_have=what_you_have,
            what_you_may_need=what_you_need,
            avoid=decision_data["avoid"],
            next_check="Check local inventory, map marker updates, and emergency radio in 60 minutes.",
            sources_used=sources_used,
            is_offline=True,
            model_name="RuleEngine & Offline RAG (Determined)"
        )
