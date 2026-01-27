import chromadb
from typing import Optional

# Lazy loading for improved startup time
_chroma_client: Optional[chromadb.PersistentClient] = None
_collection = None

def get_chroma_client():
    """Lazy load the ChromaDB client on first use"""
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path="./chroma")
    return _chroma_client

def get_collection():
    """Lazy load the collection on first use"""
    global _collection
    if _collection is None:
        client = get_chroma_client()
        _collection = client.get_or_create_collection(name="documents")
    return _collection

def store_embedding(doc_id: str, embedding: list[float], text:str):
    """Store embedding in the vector database"""
    collection = get_collection()
    collection.add(
        documents=[text],
        embeddings=[embedding],
        ids=[doc_id],
        metadatas=[{"source": "upload"}]
    )

def query_similar_documents(embedding:list, top_k:int=1):
    """Query for similar documents in the vector database"""
    collection = get_collection()
    query_result = collection.query(
        query_embeddings = [embedding],
        n_results = top_k
    )

    # Formatting the response
    results=[]
    for i in range(top_k):
        results.append({
            "doc_id": query_result["ids"][0][i],
            "text_input": query_result["documents"][0][i][:300],  # first 300 characters
            "similarity_score": query_result["distances"][0][i]
        })
    return results