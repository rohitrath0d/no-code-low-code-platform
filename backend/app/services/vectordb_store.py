import chromadb

# from chromadb.config import Settings


# chroma_client = chromadb.Client(Settings(
#   chroma_db_implementation="duckdb+parquet",
#   persist_directory="./chroma"                # Local folder to store DB
# ))

# Persistent local client (no need for deprecated Settings)
chroma_client = chromadb.PersistentClient(path="./chroma")        # <== Local directory

# Create collection if not exists
collection = chroma_client.get_or_create_collection(name="documents")

def store_embedding(doc_id: str, embedding: list[float], text:str):
  collection.add(
    documents=[text],
    embeddings=[embedding],
    ids=[doc_id],
    metadatas=[{"source": "upload"}]
  )

def query_similar_documents(embedding:list, top_k:int=1):
  collection = chroma_client.get_collection(name="documents")
  query_result = collection.query(
    query_embeddings = [embedding],
    n_results = top_k
  )

  # Formatting the response
  results=[]
  for i in range(top_k):
    results.append({
      "doc_id": query_result["ids"][0][i],
      "text_input": query_result["documents"][0][i][:300],        # first 300 characters
      "similarity_score": query_result["distances"][0][i]
    })
  return results