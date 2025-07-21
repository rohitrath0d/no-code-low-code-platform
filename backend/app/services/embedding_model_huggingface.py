from sentence_transformers import SentenceTransformer


# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")           # Fast, accurate, ~384 dims

def generate_embedding(text: str):
  return model.encode([text])[0]                        # Returns a 1D list (vector)        ← this is a NumPy float32 array . → FastAPI can't turn numpy.float32 into JSON → Hence Error
