# 🚀 NoCode WebApp - AI Workflow Builder

A no-code platform for building generative AI applications with a visual drag-and-drop interface. Create powerful AI workflows by connecting components like LLM engines, knowledge bases, and web search—without writing code.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12-green.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.115-teal.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Visual Workflow Builder**: Drag-and-drop interface to create AI workflows
- **Multiple AI Components**:
  - 🤖 **LLM Engine**: Powered by Google Gemini AI
  - 📚 **Knowledge Base**: RAG (Retrieval Augmented Generation) with vector embeddings
  - 🔍 **Web Search**: Real-time web search via SerpAPI
  - 💬 **Chat Interface**: Interactive chat with your workflows
- **User Authentication**: Secure JWT-based authentication
- **Workflow Management**: Create, save, load, and manage multiple workflows (stacks)
- **Per-User Isolation**: Each user sees only their own workflows
- **Responsive Design**: Works on desktop and mobile devices

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Flow | Visual Workflow Editor |
| Tailwind CSS | Styling |
| Shadcn/UI | UI Components |
| React Router | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API Framework |
| PostgreSQL (NeonDB) | Database |
| SQLModel | ORM |
| ChromaDB | Vector Database |
| HuggingFace | Embeddings |
| Google Gemini | LLM |
| SerpAPI | Web Search |
| JWT | Authentication |

---

## 🏗 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    React App    │────▶│   FastAPI       │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (NeonDB)      │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ ChromaDB │ │  Gemini  │ │ SerpAPI  │
              │ (Vector) │ │  (LLM)   │ │ (Search) │
              └──────────┘ └──────────┘ └──────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.11
- **PostgreSQL** (or NeonDB account)
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nocode-webapp.git
   cd nocode-webapp/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file**
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   GEMINI_API_KEY=your_gemini_api_key
   SERPAPI_API_KEY=your_serpapi_key
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

5. **Run the server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access API docs**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd nocode-webapp/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the app**
   - Open http://localhost:5173

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `SERPAPI_API_KEY` | SerpAPI key for web search | ❌ |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | ✅ |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ✅ |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |

### Workflows
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workflow/` | Create new workflow |
| GET | `/api/workflow/get-workflow` | List user's workflows |
| GET | `/api/workflow/load/{id}` | Load workflow by ID |
| PUT | `/api/workflow/{id}` | Update workflow |
| DELETE | `/api/workflow/{id}` | Delete workflow |
| POST | `/api/workflow/run-workflow` | Execute workflow |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload document to knowledge base |
| POST | `/api/query` | Query knowledge base |

### Chat Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat-logs/{workflow_id}` | Get chat history |

---

## 📁 Project Structure

```
nocode-webapp/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry
│   │   ├── api/                 # API route handlers
│   │   │   ├── chat_logs.py
│   │   │   ├── query.py
│   │   │   ├── upload.py
│   │   │   ├── users.py
│   │   │   └── workflow.py
│   │   ├── core/                # Core configurations
│   │   │   ├── database.py
│   │   │   └── init_db.py
│   │   ├── middlewares/         # Auth middleware
│   │   │   ├── auth.py
│   │   │   └── auth_helpers.py
│   │   ├── models/              # Database models
│   │   │   └── models.py
│   │   ├── schemas/             # Pydantic schemas
│   │   │   └── schemas.py
│   │   └── services/            # Business logic
│   │       ├── embedding_model_huggingface.py
│   │       ├── gemini_ai_llm.py
│   │       ├── serp_api_search.py
│   │       └── vectordb_store.py
│   ├── chroma/                  # Vector DB storage
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # React entry point
│   │   ├── App.jsx              # Main App component
│   │   ├── components/          # React components
│   │   │   ├── KnowledgeBaseNode.jsx
│   │   │   ├── LLMEngineNode.jsx
│   │   │   ├── OutputNode.jsx
│   │   │   ├── UserQueryNode.jsx
│   │   │   └── ui/              # Shadcn UI components
│   │   ├── contexts/            # React contexts
│   │   │   └── WorkflowContext.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── StacksPage.jsx
│   │   │   └── WorkflowPage.jsx
│   │   └── util/                # Utilities
│   │       └── auth.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🚢 Deployment

### Railway Deployment

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create new project** and connect your GitHub repository

3. **Add environment variables** in Railway dashboard:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `SERPAPI_API_KEY`
   - `JWT_SECRET_KEY`

4. **Deploy backend**
   - Root directory: `/backend`
   - Build command: (auto-detected from Dockerfile)

5. **Deploy frontend**
   - Root directory: `/frontend`
   - Build command: `npm run build`
   - Start command: `npm run preview`

### Docker Deployment

```bash
# Build and run backend
cd backend
docker build -t nocode-backend .
docker run -p 8000:8000 --env-file .env nocode-backend

# Build and run frontend
cd frontend
docker build -t nocode-frontend .
docker run -p 5173:5173 nocode-frontend
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React Flow](https://reactflow.dev/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Google Gemini](https://ai.google.dev/)
- [ChromaDB](https://www.trychroma.com/)

---

## 📧 Contact
<!-- 
Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com -->

Project Link: [https://github.com/rohitrath0d/nocode-webapp](https://github.com/rohitrath0d/nocode-webapp)

---

<!-- <p align="center">Made with ❤️ by Your Name</p> -->