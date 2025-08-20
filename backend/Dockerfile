# # Use official Python image
# FROM python:3.11-slim

# # Set working directory
# WORKDIR /app

# # Install dependencies
# COPY backend/requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the whole backend
# COPY backend/ .

# # Expose FastAPI port
# EXPOSE 8000

# # Run FastAPI app
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]



# # -------- Stage 1: Builder --------
# FROM python:3.10-alpine AS builder
# # FROM python:3.11-bullseye AS builder

# # Install build dependencies (needed for some Python packages like numpy, pandas, etc.)
# # RUN apk add --no-cache \
# #     build-base \
# #     gcc \
# #     musl-dev \
# #     libffi-dev \
# #     && pip install --upgrade pip

# # RUN apt-get update && apt-get install -y \
# #     build-essential \
# #     gcc \
# #     g++ \
# #     libffi-dev \
# #     python3-dev \
# #     wget \
# #     && rm -rf /var/lib/apt/lists/*


# # RUN apt-get update && apt-get install -y \
# #     build-essential gcc g++ libffi-dev python3-dev wget \
# #     && pip install --upgrade pip
# RUN apk add --no-cache build-base \
#     && apk add --no-cache gfortran musl-dev lapack-dev

# # Set working directory
# WORKDIR /app

# # Copy requirements and install dependencies
# COPY backend/requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy backend source code
# COPY backend/ .

# # Uninstall unnecessary dependencies
# RUN pip uninstall -y pandas && apk del build-base gfortran musl-dev lapack-dev

# # -------- Stage 2: Production --------
# FROM python:3.10-alpine AS production
# # FROM python:3.11-bullseye AS production
# # FROM python:3.11-alpine AS production

# # Set working directory
# WORKDIR /app


# # Copy only installed dependencies from builder
# # COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
# # COPY --from=builder /usr/local/bin /usr/local/bin

# # Copy application code
# COPY --from=builder /app /app

# # Remove build tools from final image
# # RUN apt-get purge -y build-essential gcc g++ python3-dev \
# #     && apt-get autoremove -y \
# #     && apt-get clean \
# #     && rm -rf /var/lib/apt/lists/*

# # Expose FastAPI port
# EXPOSE 8000

# # Run FastAPI app
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]





# # -------- Stage 1: Builder --------
# FROM python:3.11-slim AS builder

# # Install system dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     gcc \
#     g++ \
#     libffi-dev \
#     libssl-dev \
#     && rm -rf /var/lib/apt/lists/* \
#     && pip install --upgrade pip

# WORKDIR /app

# # First copy just requirements to cache this layer
# COPY backend/requirements.txt .

# # Install Python dependencies
# RUN pip install --user --no-cache-dir -r requirements.txt

# # Copy the rest of the application
# COPY backend/ .

# # -------- Stage 2: Runtime --------
# FROM python:3.11-slim

# WORKDIR /app

# # Copy installed dependencies
# COPY --from=builder /root/.local /root/.local
# COPY --from=builder /app /app

# # Ensure .local/bin is in PATH
# ENV PATH=/root/.local/bin:$PATH

# # Runtime dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     libgomp1 \
#     && rm -rf /var/lib/apt/lists/*

# # Cleanup
# RUN find /usr/local -type d -name '__pycache__' -exec rm -rf {} + \
#     && find /usr/local -type f -name '*.py[co]' -delete

# EXPOSE 8000
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]



# # -------- Stage 1: Builder --------
# FROM python:3.11-slim AS builder

# # Install minimal build dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     gcc \
#     python3-dev \
#     && rm -rf /var/lib/apt/lists/* \
#     && pip install --upgrade pip

# WORKDIR /app

# # Install requirements with --no-deps to avoid unnecessary packages
# COPY backend/requirements.txt .
# RUN pip install --user --no-cache-dir --no-deps -r requirements.txt

# # Install only the direct dependencies
# RUN pip install --user --no-cache-dir -r requirements.txt

# # -------- Stage 2: Runtime --------
# FROM python:3.11-slim

# WORKDIR /app

# # Copy only necessary files from builder
# COPY --from=builder /root/.local /root/.local
# COPY --from=builder /app /app

# # Set PATH for user-installed packages
# ENV PATH=/root/.local/bin:$PATH \
#     PYTHONPATH=/app

# # Clean up Python cache and temporary files
# RUN find /usr/local -type d -name '__pycache__' -exec rm -rf {} + \
#     && find /usr/local -type f -name '*.py[co]' -delete

# EXPOSE 8000
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# # -------- Stage 1: Builder --------
# FROM python:3.11-slim AS builder

# # Install only essential build dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     gcc \
#     python3-dev \
#     && rm -rf /var/lib/apt/lists/* \
#     && pip install --upgrade pip

# WORKDIR /app

# # Copy requirements first for better caching
# COPY backend/requirements.txt .

# # Install requirements in two passes for better caching
# RUN pip install --user --no-cache-dir --no-deps -r requirements.txt && \
#     pip install --user --no-cache-dir -r requirements.txt

# # Copy application code
# COPY backend/ .

# # -------- Stage 2: Runtime --------
# FROM python:3.11-slim

# WORKDIR /app

# # Copy only what's needed from builder
# COPY --from=builder /root/.local /root/.local
# COPY --from=builder /app /app

# # Configure environment
# ENV PATH=/root/.local/bin:$PATH \
#     PYTHONPATH=/app \
#     PYTHONDONTWRITEBYTECODE=1 \
#     PYTHONUNBUFFERED=1

# # Clean up
# RUN find /usr/local -type d -name '__pycache__' -exec rm -rf {} + \
#     && find /usr/local -type f -name '*.py[co]' -delete

# EXPOSE 8000
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


# -------- Stage 1: Builder --------
FROM python:3.12.4-slim-bookworm AS builder

# Specify the variable you need
# ARG DATABASE_URL
# ARG GEMINI_API_KEY
# ARG SERP_API_KEY
# ARG JWT_SECRET

# # Use the varible
# RUN echo $DATABASE_URL
# RUN echo $GEMINI_API_KEY
# RUN echo $SERP_API_KEY
# RUN echo $JWT_SECRET

# ENV DATABASE_URL=$DATABASE_URL
# ENV GEMINI_API_KEY=$GEMINI_API_KEY
# ENV SERP_API_KEY=$SERP_API_KEY
# ENV JWT_SECRET=$JWT_SECRET

# Install essential build dependencies (with security upgrades)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    python3-dev \
    wget \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip

WORKDIR /app

# Copy requirements first for caching
COPY backend/requirements.txt .

# Step 1: Force CPU-only PyTorch install
RUN pip install --user --no-cache-dir torch==2.5.0+cpu --index-url https://download.pytorch.org/whl/cpu

# Step 2: Install rest of the dependencies
RUN pip install --user --no-cache-dir -r requirements.txt

# ARG GEMINI_API_KEY

# Copy application code
COPY backend/ .
# -------- Stage 2: Runtime --------
FROM python:3.12.4-slim-bookworm

WORKDIR /app

# Apply latest security patches in runtime image
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Copy only what’s needed from builder
COPY --from=builder /root/.local /root/.local
COPY --from=builder /app /app

# Configure environment
ENV PATH=/root/.local/bin:$PATH \
    PYTHONPATH=/app \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Environment variables - CORRECTED SYNTAX -- this line overrides the env variables stated in dashboard
# ENV DATABASE_URL="" \
#     GEMINI_API_KEY="" \
#     SERP_API_KEY="" \
#     JWT_SECRET="" \
#     PATH=/root/.local/bin:$PATH \
#     PYTHONPATH=/app \
#     PYTHONDONTWRITEBYTECODE=1 \
#     PYTHONUNBUFFERED=1

# # Specify the variable you need
# ARG DATABASE_URL
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY
# ARG SERP_API_KEY
# ARG JWT_SECRET
# # Use the varible
# RUN echo $DATABASE_URL
# RUN echo $GEMINI_API_KEY
# RUN echo $SERP_API_KEY
# RUN echo $JWT_SECRET

# Clean up bytecode
RUN find /usr/local -type d -name '__pycache__' -exec rm -rf {} + \
    && find /usr/local -type f -name '*.py[co]' -delete

EXPOSE 8000

# ARG GEMINI_API_KEY

# Modified health check (remove if you don't have /health endpoint)
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1

WORKDIR /backend

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]