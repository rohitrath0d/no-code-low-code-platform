# from fastapi import FASTAPI
from fastapi import FastAPI, Response, Request   # Response is just a helper class from FastAPI that lets you manually control the HTTP response, including: Status code | Headers | Content type | Raw body data
from app.api.ping import router as ping_router
from app.api.users import router as user_router
from app.api.upload import router as upload_router
from app.api.query import router as query_router
from app.api.workflow import router as workflow_router
from app.api.chat_logs import router as chatlogs_router
from app.middlewares.auth import router as auth_router

from sqlmodel import SQLModel
from app.core.database import engine  # Assuming your db setup is in app/db.py
from app.models.models import Document 
from app.models.models import ChatLog
from fastapi.middleware.cors import CORSMiddleware

# Prometheus imports
# from prometheus_client import start_http_server
# from prometheus_client import CollectorRegistry, generate_latest, generate_latest, CONTENT_TYPE_LATEST
from prometheus_client import (
    generate_latest,
    CollectorRegistry,
    CONTENT_TYPE_LATEST,
    platform_collector,
    process_collector,
    gc_collector,
    Counter,
    Summary,
    start_http_server,
    make_asgi_app,
    multiprocess,
    Gauge,
    Histogram,
    Summary,
    )
# from prometheus_client import ProcessCollector, PlatformCollector, GCCollector

# for delay response ('/hello)
import time
import random

# for gauge memory metrics
import threading
# import resource       # resource package is only available in unix
import psutil
import socket

import requests     # for Summary metric for monitoring request latency

# client= prometheus_client()
# registry = client.CollectorRegistry            # // refers to some default registry
# registry({register: client.register})

registry = CollectorRegistry()         # // refers to some default registry

# Hostname for labeling
hostname = socket.gethostname()

# Add default collectors to your registry -- With these modifications, the default metrics will be exposed along with any custom metrics you register later on.
gc_collector.GCCollector(registry=registry)
platform_collector.PlatformCollector(registry=registry)
process_collector.ProcessCollector(registry=registry)


# app = FASTAPI()
# app = FastAPI()
app = FastAPI(debug=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nocode-frontend-production.up.railway.app"],  # or ["*"] during development
    allow_credentials=True,
    # allow_methods=["*"],
    # allow_headers=["*"],
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
)


def create_tables():
    SQLModel.metadata.create_all(engine)

create_tables()


# Include the ping router
app.include_router(ping_router)

# Including user router, and same will now include routers for other functions
app.include_router(user_router)
app.include_router(upload_router)
app.include_router(query_router)
app.include_router(workflow_router)
app.include_router(chatlogs_router)
app.include_router(auth_router)



# Create a counter metric
http_requests_total = Counter(
    "http_requests_total",
    "Total number of HTTP requests received",
    # ["status", "path", "method"],
    ["method", "path", "status"],
    # registry=registry,
)


# Define a Gauge metric for tracking active HTTP requests
active_requests_gauge = Gauge(
    "http_active_requests",
    "Number of active connections to the service",
    
    # When you pass registry=registry explicitly, you’re creating a separate registry, so your metric doesn’t end up in the default registry that prometheus_client.generate_latest() exports. That’s why they didn’t show up.
    # By default:
    # If you do not pass registry=..., the metric gets registered to the default global registry, which is what Prometheus scrapes.
    # If you create your own CollectorRegistry() and attach metrics there, then you must also pass that registry when exposing /metrics. Otherwise, Prometheus won’t see them.
    # So now that you removed registry=registry, your Counter and Gauge are both being tracked correctly in the default registry, which is why they show up. ✅
    
    # registry=registry

)

# Memory usage (bytes)
memory_usage_gauge = Gauge(
    
    # Tracking absolute values
    # If you need a Gauge that tracks absolute but fluctuating values, you can set the value directly instead of incrementing or decrementing it.
    # For example, to track the current memory usage of the Flask application, you can define a gauge and use it to record the current memory usage of the process like this:

    "memory_usage_bytes",
    "Current memory usage of the service in bytes",
    ["hostname"],
    
    # registry=registry,
)

# CPU usage percentage
cpu_usage_gauge = Gauge(
    "cpu_usage_percent",
    "Current CPU usage percentage of the service",
    ["hostname"],
    # registry=registry,
)


def collect_memory_metrics():
    """Background thread to collect memory metrics"""
    process = psutil.Process()

    while True:
        # memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss       # unix compatible
        # rss = Resident Set Size (in bytes)
        memory = process.memory_info().rss              # windows compatible -for memory
        
        # for cpu
        # Multiply by 1024 since maxrss is in KB on Unix
        # The collect_memory_metrics() function runs in a background thread to continuously update the memory_usage_gauge metric every second. 
        # Here, set() is used instead of inc/dec to set absolute values
        # memory_usage_gauge.labels(hostname="host1.domain.com").set(memory * 1024)   # unix
        memory_usage_gauge.labels(hostname="host1.domain.com").set(memory)
        
        # CPU usage in percentage (relative to 1 core)
        cpu = process.cpu_percent(interval=1)  # interval=1s averages usage
        cpu_usage_gauge.labels(hostname=hostname).set(cpu)
        
        # time.sleep(1)       # No need for extra sleep since cpu_percent(interval=1) already waits


metrics_thread = threading.Thread(target=collect_memory_metrics, daemon=True)
metrics_thread.start()

# Define a Histogram metric for request duration
latency_histogram = Histogram(
    "http_request_duration_seconds",
    "Duration of HTTP requests",
    ["status", "path", "method"],
    buckets=[0.1, 0.5, 1, 2.5, 5, 10],  # Custom buckets in seconds
    # registry=registry,
)

# Define a Summary metric for all HTTP requests
# http_request_latency_summary = Summary(
request_latency_summary = Summary(  # name should match for the same as middleware requests
    "http_request_latency_seconds_summary",
    "Duration of all HTTP requests by endpoint",
    # ["method", "endpoint"],   #    -- ValueError: Incorrect label names
    ["method", "path", "status"],
    # registry=registry,
)

# @app.before_request
# async def prometheus_middleware_for_calculating_after_requests():
#     """Track start of request processing"""
#     active_requests_gauge.inc()


# @app.after_request --> Flask syntax
# In FastAPI, they don’t have an after_request.
# Instead, they say:
# 💡 "Hey, if you want to do something before and/or after a request, wrap the whole request in a middleware."
@app.middleware("http") # FastAPI syntax
# @app.middleware

# def after_request(response):
async def prometheus_middleware_for_calculating_requests(request: Request, call_next):
# def middleware(http):

    """Track start of request processing"""
    # ---- BEFORE REQUEST ----
    active_requests_gauge.inc()                # for gauge
    request.start_time = time.time()           # for histogram of latency, before requests and also for summary, timed. (Store request start time before each request)
    
    # Process request and get response
    # response: Response = await call_next(request)
    
    try:
        response: Response = await call_next(request)
    except Exception as e:
        # handle exception case too, still decrement gauge
        active_requests_gauge.dec()
        raise e
    
    """Track end of request processing"""
    # ---- AFTER REQUEST ----
    """Increment counter after each request"""
    http_requests_total.labels(
        # status=str(response.status_code), path=request.path, method=request.method      #  -- this is for response
        method=request.method,
        path=request.url.path,
        status=str(response.status_code)
    ).inc()
    
    # after requests for gauge
    active_requests_gauge.dec()
    
    # for histogram of latency, after requests        
    # The latency_histogram metric is created to track the duration of each request to the server. With such a metric, you can:
    # Track response time distributions,
    # Calculate percentiles (like p95, p99),
    # Identify slow endpoints,
    # Monitor performance trends over time.
    # Before a request is processed, the middleware stores the request start time. After the request completes, the middleware calculates the total duration and records it in the histogram.
    duration= time.time() - request.start_time
    
    latency_histogram.labels(
        # status=str(response.status_code), path=request.path, method=request.method
        method=request.method,
        path=request.url.path,
        status=str(response.status_code),
    ).observe(duration)
    
    #  Summary
    request_latency_summary.labels(
        method=request.method,
        path=request.url.path,
        status=str(response.status_code),
    ).observe(duration)
    
    return response

# For each counter metric in your application, Prometheus Python client creates two metrics:
# The actual counter (http_requests_total)
# A creation timestamp gauge (http_requests_created)
# If you want to disable this behavior, you can use the disable_created_metrics() function:

# MY_COUNTER = Counter('http_requests_total', 'Total number of HTTP requests received')

# # Using multiprocess collector for registry
# def make_metrics_app():
#     registry = CollectorRegistry()
#     multiprocess.MultiProcessCollector(registry)
#     return make_asgi_app(registry=registry)

# # Add prometheus asgi middleware to route /metrics requests
# metrics_app = make_metrics_app()
# app.mount("/metrics", metrics_app)


@app.get("/hello")
def hello():
    delay = random.uniform(1, 5)  # Random delay between 1 and 5 seconds
    time.sleep(delay)
    return {"Hello world!"}

@app.get("/slow")
def slow():
    time.sleep(2)  # simulate slow API
    return {"message": "Done"}


# Setting up metrics for Prometheus
@app.get("/metrics")
def metrics():
    # return Response(generate_latest(registry), media_type="text/plain")
    return Response(generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST})

@app.get("/health") 
async def health_check(): 
    return {"status": "healthy"}

@app.get("/")
def root():
  return {"message": "Welcome to the no-code/low-code backend services!! All up and running!"}