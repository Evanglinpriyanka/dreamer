from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router

# Initialize the FastAPI Engine
app = FastAPI(
    title="Career Ecosystem Core Engine",
    description="API for LangChain Orchestration and Knowledge Graph Routing",
    version="1.0.0"
)

# CORS Security: This is CRITICAL. 
# It allows your Next.js frontend (running on port 3000) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8000"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A simple diagnostic route to prove the server is alive
@app.get("/health")
def health_check():
    return {"status": "ONLINE", "message": "FastAPI Core Engine is operational."}


app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    # Runs the server locally on port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)