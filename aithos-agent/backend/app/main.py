"""
AITHOS Agent — Privacy-Preserving Agentic AI
FastAPI Main Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from .api.routes import router
except (ImportError, ValueError):
    from app.api.routes import router

app = FastAPI(
    title="AITHOS Privacy-Preserving Agent API",
    description="Privacy-preserving AI agent backend with deterministic detection, safe context redaction, and policy enforcement.",
    version="1.0.0",
)

# Configure CORS to permit local React/Vite development server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router)


@app.get("/")
def read_root():
    return {
        "project": "AITHOS Agent",
        "tagline": "AI should know what it needs — not everything about you.",
        "status": "ONLINE",
        "docs_url": "/docs",
        "health_url": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
