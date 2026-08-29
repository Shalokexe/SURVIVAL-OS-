import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

class LocalModelProvider:
    def check_status(self) -> Dict[str, Any]:
        raise NotImplementedError

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        raise NotImplementedError

class OllamaProvider(LocalModelProvider):
    def __init__(self, host: str = "http://localhost:11434", default_model: str = "qwen2.5:latest"):
        self.host = host.rstrip('/')
        self.default_model = default_model

    def check_status(self) -> Dict[str, Any]:
        try:
            req = urllib.request.Request(f"{self.host}/api/tags", method="GET")
            with urllib.request.urlopen(req, timeout=2) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    models = [m.get("name") for m in data.get("models", [])]
                    qwen_models = [m for m in models if "qwen" in m.lower()]
                    
                    selected_model = qwen_models[0] if qwen_models else (models[0] if models else self.default_model)
                    return {
                        "status": "ready" if models else "no_models",
                        "installed": True,
                        "available_models": models,
                        "active_model": selected_model,
                        "message": f"Ollama operational with {len(models)} models available."
                    }
        except (urllib.error.URLError, TimeoutError, Exception) as e:
            pass

        return {
            "status": "unavailable",
            "installed": False,
            "available_models": [],
            "active_model": "RuleEngine (Fallback)",
            "message": "Ollama local service not detected at http://localhost:11434. Operating in Rule-Engine Fallback Mode."
        }

    def generate(self, prompt: str, system_prompt: Optional[str] = None, model: Optional[str] = None) -> Optional[str]:
        target_model = model or self.default_model
        payload = {
            "model": target_model,
            "prompt": prompt,
            "stream": False
        }
        if system_prompt:
            payload["system"] = system_prompt

        try:
            data_bytes = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                f"{self.host}/api/generate",
                data=data_bytes,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                if response.status == 200:
                    res_json = json.loads(response.read().decode('utf-8'))
                    return res_json.get("response")
        except Exception:
            return None
        return None
