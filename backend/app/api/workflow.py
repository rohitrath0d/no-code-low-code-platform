from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
from app.services.embedding_model_huggingface import generate_embedding
from app.services.vectordb_store import query_similar_documents
from app.services.gemini_ai_llm import gemini_chat_llm
from app.models.models import ChatLog, Workflow
# from app.schemas.schemas import ChatLogCreate
from app.core.database import get_Session
from app.schemas.schemas import WorkflowRunRequest, WorkflowRead, WorkflowCreate
import json
from app.services.serp_api_search import serpapi_search

router= APIRouter(prefix="/run-workflow", tags=["Run Workflow"])

# @router.post("/run-workflow")
@router.post("/")
async def run_workflow(request: WorkflowRunRequest):
  try:

    # query_embedding = generate_embedding(request.query)
    # context = ""

    # components = {c.type: c for c in request.components}
    components = {c.type.lower(): c for c in request.components}  # normalized keys
    query = request.query
    context = ""
    results = []

    # Optional: Get context from KB
    # if request.use_knowledge_base:
    #   results = query_similar_documents(
    #     embedding= query_embedding.tolist(),
    #     top_k= request.top_k
    #   )
    
    if "knowledge_base" in components:
      embedding = generate_embedding(query)
      results = query_similar_documents(
        embedding=embedding.tolist(), 
        # top_k=3
        # top_k=1
        # top_k=top_k                       # cant initialise directly because we are passing it as request params , hence request.top_k
        top_k=request.top_k
      )    
      # context= results[0]["text_input"] if results else ""                         # only works for topk=1
      
    if results:
      context = "\n\n---\n\n".join([r["text_input"] for r in results])
    else:
      context = ""

    if "llm_engine" not in components:
      raise HTTPException(status_code=400, detail="LLM Engine is required in workflow")
    
    llm_component = components["llm_engine"]
    llm_config = llm_component.config or {}
    model = llm_config.get("model", "gemini")
    use_serpapi = llm_config.get("use_serpapi", False)
    
    # Step 3: Optional SerpAPI Web Context
    serp_context = ""
    if use_serpapi:
      serp_context = serpapi_search(query)

    # Step 4: Final Prompt Construction
    final_prompt = f"User asked: {query}\n\n"
    if context:
      final_prompt += f"Context from documents:\n{context}\n\n"
    if serp_context:
      final_prompt += f"Web context:\n{serp_context}\n\n"
    if request.custom_prompt:
      final_prompt += f"Custom Prompt:\n{request.custom_prompt}\n\n"

    # prompt = request.custom_prompt or f"User asked :{request.query}\n\nRelevant context:\n{context}"

    llm_response=gemini_chat_llm(
      query=request.query,
      context=context,
      # prompt=prompt
      prompt=final_prompt
    )

    # saving/storing chat log
    # with next(get_Session()) as session:
    #   chat= ChatLog(
    #     user_query=request.query,
    #     response=llm_response,
    #     context_used=context
    #   )
    #   session.add(chat)
    #   session.commit()
    
    if "output" in components:
      with next(get_Session()) as session:
        chat = ChatLog(
          user_query=query,
          response=llm_response,
          context_used=context
        )
        
        session.add(chat)
        session.commit()
    

    return {
      "query": request.query,
      "context_used": context,
      "llm_response": llm_response,
      "results": results
    }
  
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Workflow failed: {str(e)}")


@router.post("/save", response_model=WorkflowRead)
def save_workflow(workflow: WorkflowCreate):
  
  try:
    with next(get_Session()) as session:
        
        # Before saving to DB - serialize it
        # workflow_data = workflow.dict()
        
        # workflow_data["components"] = json.dumps(workflow_data["components"])                 # When saving to DB - SQL databases don’t understand Python dicts, so we convert to str
        
        # new_workflow = Workflow(**workflow.dict())
        # new_workflow = WorkflowRunRequest(**workflow.dict())
        
        # new_workflow = Workflow(**workflow_data)
        new_workflow = Workflow(
          name=workflow.name,
          description=workflow.description,
          components=workflow.components  # this is already a dict
        )

        session.add(new_workflow)
        session.commit()
        session.refresh(new_workflow)
        
        return new_workflow
      
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"workflow saving failed: {str(e)}")

      
      
# json.dumps(components)	When saving to DB	SQL databases don’t understand Python dicts, so we convert to str
# json.loads(components)	When returning to frontend (API resp)	FastAPI/Pydantic expects a real dict to convert into schema


@router.get("/load/{workflow_id}", response_model=WorkflowRead)
def load_workflow(workflow_id: int):
  try:
    with next(get_Session()) as session:
        workflow = session.get(Workflow, workflow_id)
        if not workflow:
          raise HTTPException(status_code=404, detail="Workflow not found")
          
        # Deserialize the components string into a dictionary
        # workflow.components = json.loads(workflow.components)                       #json.loads() is used to turn the stored string back into a dictionary.
        
        
        # Return a Pydantic model response
        # return WorkflowRead.from_orm(workflow)                                        #WorkflowRead.from_orm() is used to safely return a Pydantic-compatible response object.
        # return WorkflowRead(
        #   id=workflow.id,
        #   name=workflow.name,
        #   description=workflow.description,
        #   components=json.loads(workflow.components),
        #   created_at=workflow.created_at
        # )
        
        return workflow

  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Workflow fetching failed: {str(e)}")
