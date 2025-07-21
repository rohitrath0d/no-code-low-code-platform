from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
from app.services.embedding_model_huggingface import generate_embedding
from app.services.vectordb_store import query_similar_documents
from app.services.gemini_ai_llm import gemini_chat_llm
# from app.models.chat_log import ChatLog
from app.models.models import ChatLog
# from app.schemas.schemas import ChatLogCreate
from app.core.database import get_Session
from app.schemas.schemas import QueryRequest


router = APIRouter(prefix="/query", tags=["Query"])


# class QueryRequest(BaseModel):
#   query: str
#   top_k: int = 1          # optional: defaults to 1


@router.post("/")
def query_docs(request: QueryRequest):
  try:
    # embedding generated from the doc
    query_embedding = generate_embedding(request.query)

    # results to be evaluated from the doc and finding nearest matching from the db
    results = query_similar_documents(
      embedding= query_embedding.tolist(),
      top_k= request.top_k                         # topk -> no.of most similar matched document/pdf
    )

    # this steps to be done separately while querying on frontend side
    # setting context
    # querying from client side
    # output/result

    return{
      "query": request.query,
      "results": results
    }
  
  except Exception as e:
    raise HTTPException(status_code=400, detail=f"Query processing failed: {str(e)}")
  

@router.post("/ask-gemini")
async def ask_gemini(request: QueryRequest):
  try:
    query_embedding =  generate_embedding(request.query)

    results = query_similar_documents(
      embedding= query_embedding.tolist(),
      top_k= request.top_k
    )

    # Extract top context text
    context = results[0]["text_input"] if results else ""

    # Calling gemini LLM here
    # called the route handler function (ask_gemini) inside itself, which is incorrect. 
    # That’s causing Python to pass prompt=... into your FastAPI route handler instead of a Gemini model function
    # llm_response = ask_gemini(
    #   prompt = f"User asked: {request.query}\n\nRelevant context:\n{context}"
    # )
    
    prompt = f"User asked: {request.query}\n\nRelevant context:\n{context}"

    llm_response = gemini_chat_llm(
    query=request.query,
    context=context,
    prompt=prompt
    )


    with next(get_Session()) as session:
      chat = ChatLog(
        user_query=request.query,
        response=llm_response,
        context_used=context
      )
      session.add(chat)
      session.commit()

    # return {
    #   "query" : request.query,
    #   "context_used" : context,
    #   "llm_response" : llm_response,
    #   "results" : results
    # }

    return ChatLogRead(
      id=chat.id,
      user_query=chat.user_query,
      response=chat.response,
      context_used=chat.context_used,
      created_at=chat.created_at
    )
  
  except Exception as e:
    print("Query with llm processing error: ", str(e))
    raise HTTPException(status_code=500, detail=f"Ask failed:{str(e)}")
  