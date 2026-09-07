from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging

from models.schemas import CanonicalRolesResponse
from services.role_index import get_roles_by_sector, search_roles_by_title, load_canonical_roles

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/taxonomy/roles", response_model=CanonicalRolesResponse)
async def list_roles(sector: Optional[str] = Query(None, description="Sector name (e.g., 'Agriculture & Allied Sciences')"),
                     search: Optional[str] = Query(None, description="Search by title substring"),
                     limit: int = Query(100, ge=1, le=500)):
    """
    Return canonical roles. If sector is provided, filter by sector.
    If search is provided, search titles (simple substring search).
    The response includes provenance and confidence_score for each role to enable RAG citations.
    """
    try:
        if search:
            matches = search_roles_by_title(search, limit)
        elif sector:
            matches = get_roles_by_sector(sector, limit)
        else:
            data = load_canonical_roles()
            roles = data.get("roles", [])
            roles = sorted(roles, key=lambda r: r.get("confidence_score", 0), reverse=True)[:limit]
            matches = roles
        return CanonicalRolesResponse(roles=matches)
    except Exception:
        logger.exception("Error listing canonical roles")
        raise HTTPException(status_code=500, detail="Failed to retrieve canonical roles.")
