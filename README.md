# No-Code GenAI Workflow Builder

A full-stack No-Code/Low-Code web platform to visually create, configure, and interact with intelligent workflows powered by LLMs like OpenAI GPT and Gemini. Users can drag-and-drop components, upload knowledge base documents, run queries, and receive AI-generated responses via chat.

---

## Features

- Visual Workflow Builder using React Flow
- Document Upload & Embedding (Gemini & Huggingface Embedding)
- Web Search via SerpAPI (optional)
- LLM Integration (OpenAI, Gemini)
- Interactive Chat Interface with Chat History
- Workflow Save/Load (PostgreSQL)
- Fully Dockerized Architecture
- User Authentication (Token-based)

---

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | React.js, React Flow, TailwindCSS        |
| Backend     | FastAPI (Python)                         |
| Database    | PostgreSQL (NeonDB cloud)                |
| Vector DB   | ChromaDB                                 |
| LLMs        | Google Gemini                            |
| Embeddings  | Huggingface embedding model              |
| Text Parser | PyMuPDF                                  |
| Search API  | SerpAPI                                  |
| Deployment  | Docker, Docker Compose                   |

---

## Folder Structure
project-root/  
├── backend/  
│ ├── app/  
│ ├── Dockerfile  
│ └── requirements.txt  
│  
├── frontend/  
│ ├── src/  
│ ├── Dockerfile  
│ └── vite.config.js  
│  
├── docker-compose.yml  
└── README.md  

---



## Project Initialization

### 1️. Prerequisites

- Docker & Docker Compose
- Node.js (for local frontend dev)
- Python 3.10+ (for local backend dev)

### 2️. Clone the Repository

```bash
git clone https://github.com/yourname/genai-workflow-builder.git
cd genai-workflow-builder
```


---

3️. Environment Variables

## ➤ Backend .env  
DATABASE_URL=postgresql+psycopg2://user:pass@your-neondb-host/dbname  
OPENAI_API_KEY=your_openai_key  
GEMINI_API_KEY=your_gemini_key  
SERPAPI_KEY=your_serpapi_key  


## Docker Setup
🛠️ Build & Run Containers  
docker-compose up --build  
Frontend: http://localhost:3000  

---

## Backend API Docs: http://localhost:8000/docs
```
Backend API Endpoints (FastAPI)  
Endpoint      	              Method	      Description   
- /api/upload	                  POST	        Upload & embed document  
- /api/query	                  POST	        Query with vector search  
- /api/run-workflow	            POST	        Execute a full workflow  
- /api/run-workflow/save	      POST	        Save a workflow  
- /api/run-workflow/load/{id}	  GET	          Load a workflow by ID  
- /api/chat-logs/{workflow_id}	GET	          Retrieve chat logs  
- /api/users	                  POST/GET	    User register/login/profile  
For full interactive documentation, visit /docs once backend is running.  
```

---


## Database Schema (PostgreSQL)  
- workflows: stores saved workflows (JSON components, name, desc)  
- chat_logs: query, response, context, workflow_id  
- users: email, hashed password, chat stack of particular users, retrevival of workflows, authorizing, etc.



---

## Authentication  
- Token-based user auth (JWT)  
- /api/users/me for fetching current user  
- Tokens stored in localStorage   
- Retreiving the pdf/uploaded doc from the localstorage



---

## Testing Instructions  
- Use Postman or cURL or FastAPI's Swagger API:  
```

curl -X POST http://localhost:8000/run-workflow \  
  -H "Authorization: Bearer <your_token>" \  
  -H "Content-Type: application/json" \  
  -d '{  
    "query": "Who founded OpenAI?",  
    "workflow_id": 1,  
    "components": [...]  
  }'  
```

---

## Architecture Diagram  
```
  
        ┌──────────────────────┐
        │  User Interface (UI) │
        └─────────┬────────────┘
                  │
       ┌──────────▼────────────┐
       │ Workflow Builder(React| 
                 Flow)          │            
       └──────────┬────────────┘
                  │ Drag & Drop
        ┌─────────▼──────────┐
        │  Workflow Executor │◄────────────┐
        └──────┬────┬────┬───┘             │
               │    │    │                 │
               │    │    │                 │
        ┌──────▼┐ ┌─▼────▼──────┐    ┌─────▼──────────┐
        │Upload │ │Embedding Svc│    │    LLM Engine  │
        │(PyMuPDF)││(OpenAI/Gemini)  │  (Gemini)      │
        └──┬────┘ └──────┬──────┘    └─────┬──────────┘
           │             │                │
      ┌────▼───┐     ┌───▼───────┐    ┌───▼────┐
      │Postgres│◄────┤Vector DB  │◄───┤WebSearch│
      └──┬─────┘     │(ChromaDB) │    └────────┘
         │           └──────────┘
         │  
   ┌─────▼─────┐  
   │ API Router│◄────┐  
   └───────────┘     │  
                     │  
            ┌────────▼────────┐  
            │  JWT Auth       │  
            │(Token Storage)  │  
            └────────┬────────┘   
                     │
            ┌────────▼───────┐  
            │ Chat Interface │  
            └────────────────┘  
  
```

---
## [DEMO Video link (Google drive)](https://drive.google.com/drive/folders/1ze9MFuID7AIVM3rhDXDgMYmEO4asnoqr)
