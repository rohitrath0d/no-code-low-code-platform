from serpapi import GoogleSearch
import os

def serpapi_search(query: str, api_key: str) -> str:
    """Perform a search using SerpAPI"""
    params = {
        "q": query,
        "api_key": os.getenv("SERPAPI_API_KEY"),
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    if "organic_results" in results:
        top_results = results["organic_results"][:3]
        summaries = [r.get("snippet", "") for r in top_results]
        return "\n".join(summaries)
    
    return "No relevant web results found."
