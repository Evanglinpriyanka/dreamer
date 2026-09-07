# Canonical Role Generation & API (local)

This guide explains how to run the local ingestion/clustering job (Prefect flow) and how to serve the canonical roles via FastAPI.

Prerequisites
- Python 3.10+
- pip install -r requirements.txt
- (Optional) a virtual environment

Steps

1) Install dependencies
   pip install -r requirements.txt

2) Generate canonical roles (local run)
   cd ingestion
   python prefect_flow.py
   This runs the Prefect flow defined in ingestion/prefect_flow.py and writes data/canonical_roles.json.

3) Start the FastAPI server
   Ensure the new router is included in career_backend/main.py (the example main.py above already includes it).
   Then start:
   uvicorn career_backend.main:app --reload --host 127.0.0.1 --port 8000

4) Test the endpoints
   - GET /api/v1/taxonomy/roles?sector=Agriculture%20%26%20Allied%20Sciences
   - GET /api/v1/taxonomy/roles?search=Data%20Scientist

Notes
- Replace ingestion/sample_jobs.csv with more comprehensive crawled / licensed data when ready.
- For production use, add persistence for embeddings (FAISS/Elastic vector), improve sector classifier, and add curator UI for low-confidence clusters.
