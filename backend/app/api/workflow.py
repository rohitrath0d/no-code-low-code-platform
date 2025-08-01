from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
from app.services.embedding_model_huggingface import generate_embedding
from app.services.vectordb_store import query_similar_documents
# from app.services.gemini_ai_llm import gemini_chat_llm
from app.services.gemini_ai_llm import gemini_client
from app.models.models import ChatLog, Workflow
# from app.schemas.schemas import ChatLogCreate
from app.core.database import get_Session
from app.schemas.schemas import WorkflowRunRequest, WorkflowRead, WorkflowCreate
import json
from app.services.serp_api_search import serpapi_search
from typing import List
from datetime import datetime


# router= APIRouter(prefix="/run-workflow", tags=["Run Workflow"])
router = APIRouter(prefix="/api/workflow", tags=["Workflow"])


@router.post("/", response_model=WorkflowRead)
def create_workflow(workflow: WorkflowCreate):
    try:
        with next(get_Session()) as session:

            # new_workflow = Workflow(
            #     name=workflow.name,
            #     description=workflow.description,
            #     # Ensure proper serialization
            #     # components=json.dumps(workflow.components)
            # )

            # Ensure components exists and is a dict
            workflow_data = workflow.dict()
            workflow_data.setdefault("components", {})

            new_workflow = Workflow(**workflow_data)

            session.add(new_workflow)
            session.commit()
            session.refresh(new_workflow)
            return new_workflow
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/run-workflow")
# @router.post("/")
async def run_workflow(request: WorkflowRunRequest):
    try:

      # Validate workflow exists first
        with next(get_Session()) as session:
            workflow = session.get(Workflow, request.workflow_id)
            if not workflow:
                raise HTTPException(status_code=404, detail="Workflow not found")

        # query_embedding = generate_embedding(request.query)
        # context = ""

        # components = {c.type: c for c in request.components}
        # normalized keys
        # Process components
        components = {c.type.lower(): c for c in request.components}
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
            context = "\n\n---\n\n".join([r["text_input"] for r in results]) if results else ""
        

        if "llm_engine" not in components:
            raise HTTPException(status_code=400, detail="LLM Engine is required in workflow")

        llm_component = components["llm_engine"]
        llm_config = llm_component.config or {}
        model = llm_config.get("model", "gemini-2.0-flash")
        gemini_api_key = llm_config.get("geminiApiKey", "")
        # use_serpapi = llm_config.get("use_serpapi", False)
        use_serpapi = llm_config.get("webSearchEnabled", False)
        
        # Validate Gemini API key
        if not gemini_api_key:
            raise HTTPException(status_code=400, detail="Gemini API key is required")

        if not gemini_api_key.startswith("AIza"):
            raise HTTPException(status_code=400, detail="Invalid Gemini API key format")
        
        # Configure Gemini
        # configure(api_key=gemini_api_key)         --already did in ;ine 94
        
        # Get web context if enabled
        serp_context = ""
        if use_serpapi:
            serp_api_key = llm_config.get("serpApiKey", "")
            if not serp_api_key:
                raise HTTPException(status_code=400, detail="SerpAPI key is required when web search is enabled")
            serp_results = serpapi_search(query, serp_api_key)
            serp_context = serpapi_search(query, serp_api_key)
            
        # Build the prompt with chat history if available
        chat_history = request.chat_history or []
        system_prompt = llm_config.get("customPrompt", "You are a helpful assistant.")

        # Construct conversation
        conversation = []
        conversation.append({"role": "user", "parts": [system_prompt]})
           
        for msg in chat_history:
            conversation.append({"role": msg.role, "parts": [msg.content]})
            
        # Step 4: Final Prompt Construction
        final_prompt = f"User asked: {query}\n\n"
        if context:
            final_prompt += f"Context from documents:\n{context}\n\n"
        if serp_context:
            final_prompt += f"Web context:\n{serp_context}\n\n"
        if request.custom_prompt:
            final_prompt += f"Custom Prompt:\n{request.custom_prompt}\n\n"
        if llm_config.get("customPrompt"):
            final_prompt += f"System Instructions:\n{llm_config['customPrompt']}\n\n"

        # prompt = request.custom_prompt or f"User asked :{request.query}\n\nRelevant context:\n{context}"
        
        conversation.append({"role": "user", "parts": [final_prompt]})
        
        # Initialize Gemini model
        # try:
        #     # gemini_model = GenerativeModel(model)
        #     gemini_model = model
        #     chat = gemini_model.start_chat(history=conversation)
        #     response = chat.send_message(final_prompt)
        #     llm_response = response.text
        # except Exception as e:
        #     raise HTTPException(status_code=400, detail=f"LLM processing error: {str(e)}")

        # llm_response = gemini_chat_llm(
        llm_response = gemini_client.generate_response(
            query=request.query,
            context=context,
            # prompt=prompt
            prompt=final_prompt,
            model=model,
            api_key=gemini_api_key,
            chat_history=getattr(request, 'chat_history', None)
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
                    context_used=context,
                    workflow_id=request.workflow_id
                )

                session.add(chat)
                session.commit()

        return {
            "query": request.query,
            "context_used": context,
            "llm_response": llm_response,
            "results": results
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Workflow failed: {str(e)}")


@router.post("/save-workflow", response_model=WorkflowRead)
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
        raise HTTPException(
            status_code=500, detail=f"workflow saving failed: {str(e)}")


# json.dumps(components)	When saving to DB	SQL databases don’t understand Python dicts, so we convert to str
# json.loads(components)	When returning to frontend (API resp)	FastAPI/Pydantic expects a real dict to convert into schema


@router.get("/load/{workflow_id}", response_model=WorkflowRead)
def load_workflow(workflow_id: int):
    try:
        with next(get_Session()) as session:
            workflow = session.get(Workflow, workflow_id)
            if not workflow:
                raise HTTPException(
                    status_code=404, detail="Workflow not found")

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
        raise HTTPException(
            status_code=500, detail=f"Workflow fetching failed: {str(e)}")


@router.get("/get-workflow", response_model=List[WorkflowRead])
def list_all_workflows():
    try:
        with next(get_Session()) as session:
            workflows = session.query(Workflow).all()
            return workflows
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to list workflows: {str(e)}")


@router.put("/{workflow_id}", response_model=WorkflowRead)
def update_workflow(workflow_id: int, workflow_update: WorkflowCreate):
    try:
        with next(get_Session()) as session:
            workflow = session.get(Workflow, workflow_id)
            if not workflow:
                raise HTTPException(
                    status_code=404, detail="Workflow not found")

            # Update fields
            workflow.name = workflow_update.name
            workflow.description = workflow_update.description
            workflow.components = workflow_update.components
            workflow.updated_at = datetime.utcnow()

            session.commit()
            session.refresh(workflow)
            return workflow
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
