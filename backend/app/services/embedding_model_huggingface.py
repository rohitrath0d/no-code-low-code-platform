from sentence_transformers import SentenceTransformer
from typing import Optional

# Lazy loading to improve startup time
_model: Optional[SentenceTransformer] = None

def get_model() -> SentenceTransformer:
    """Lazy load the embedding model on first use"""
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")  # Fast, accurate, ~384 dims
    return _model

def generate_embedding(text: str):
    """Generate embedding for the given text"""
    model = get_model()
    return model.encode([text])[0]  # Returns a 1D list (vector) - NumPy float32 array
