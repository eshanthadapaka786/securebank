"""AI Package: Local inference client with honest availability checking."""
from .ollama_client import OllamaClient, ollama_client, OllamaStatus

__all__ = ["OllamaClient", "ollama_client", "OllamaStatus"]
