from fastapi import APIRouter, File, UploadFile, HTTPException, status
import fitz  # PyMuPDF
from app.services.embedding_model_huggingface import generate_embedding
import traceback    # used for better error-handling
from app.services.vectordb_store import store_embedding
import uuid
# from app.models.document import Document
from app.models.models import Document
from app.schemas.schemas import DocumentRead
from app.core.database import get_Session
import json



router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
  if not file.filename.endswith(".pdf"):
    raise HTTPException(status_code=400, detail="Only PDF files are supported")
  
  contents = await file.read()
  
  try: 
    doc = fitz.open(stream=contents, filetype="pdf")
    text= ""
    for page in doc:
      text += page.get_text()
      
    embeddingModel = generate_embedding(text) 

    doc_id = str(uuid.uuid4())                  # unique ID for this upload

    store_embedding(
      doc_id=doc_id,
      # embeddingModel=embeddingModel.tolist(),
      embedding=embeddingModel.tolist(),
      text=text
    )

    with next(get_Session()) as session:
      doc = Document(
        filename=file.filename,
        content=text,
        # embedding=json.dumps(embeddingModel.tolistembedding=embeddingModel.tolist()  # already float list())  # convert list to string
        embedding=embeddingModel.tolist()  # already float list
      )
      session.add(doc)
      session.commit()
      session.refresh(doc)  #load generated ID & timestamp
    
    # return {
    #   "filename": file.filename, 
    #   "text": text[:1000]
    #   }           # return first 1000 chars
    
    # return {

    #   "doc_id": doc_id, 

    #   "filename": file.filename,
    #   "preview_text": text[:300],
    #   "embedding_dim": int(len(embeddingModel)),
      
    #   # TypeError: cannot convert dictionary update sequence element #0 to a sequence
    #   # Happens when FastAPI tries to return a response that contains a NumPy object, and it doesn’t know how to serialize it into JSON.
    #   "embedding_sample": embeddingModel[:5].tolist()      # first 5 values
    # }

    # lets use schemas req-res structure  (considered best practice)
    return DocumentRead(
      id=doc.id,
      filename=doc.filename,
      content=doc.content,
      embedding=doc.embedding,
      uploaded_at=doc.uploaded_at
    )
    
  except Exception as e:
    print("PDF upload error: ", str(e))
    traceback.print_exc()
    raise HTTPException(status_code=500, detail=f"PDF processing error: {str(e)}")
  