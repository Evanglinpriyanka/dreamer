from fastapi import APIRouter, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import logging
import os
import json
from typing import List
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "canonical_roles.json")
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "curator", "static")

# mount static in main.py (alternative: router can serve a single HTML)
if os.path.isdir(STATIC_DIR):
    router.mount("/curator/static", StaticFiles(directory=STATIC_DIR), name="curator_static")

def load_roles():
    if not os.path.exists(DATA_PATH):
        return {"generated_at": None, "roles": []}
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_roles(data):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@router.get("/curator/ui", response_class=HTMLResponse)
async def curator_ui():
    # Simple redirect to static page
    redirect_url = "/api/v1/curator/static/index.html"
    return RedirectResponse(redirect_url)

@router.get("/curator/low-confidence")
async def low_confidence_roles(threshold: float = 0.6, limit: int = 100):
    data = load_roles()
    roles = [r for r in data.get("roles", []) if r.get("confidence_score", 0) < threshold]
    roles = sorted(roles, key=lambda r: r.get("confidence_score", 0))
    return JSONResponse({"count": len(roles[:limit]), "roles": roles[:limit]})

@router.post("/curator/approve")
async def approve_role(role_id: str = Form(...)):
    data = load_roles()
    updated = False
    for r in data.get("roles", []):
        if r.get("role_id") == role_id:
            # mark approved by setting confidence to 0.99 and add an 'approved' flag in provenance
            r["confidence_score"] = 0.99
            prov = r.get("provenance", [])
            prov.append({"source": "curator", "collected_at": datetime.utcnow().isoformat(), "method": "curator-approve"})
            r["provenance"] = prov
            updated = True
            break
    if updated:
        save_roles(data)
        return JSONResponse({"ok": True, "role_id": role_id})
    raise HTTPException(status_code=404, detail="role not found")
