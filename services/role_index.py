import os
import json
from typing import List, Optional

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "canonical_roles.json")

def load_canonical_roles(data_file: Optional[str] = None):
    path = data_file or DATA_FILE
    if not os.path.exists(path):
        return {"generated_at": None, "roles": []}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_roles_by_sector(sector: str, limit: int = 100):
    data = load_canonical_roles()
    roles = [r for r in data.get("roles", []) if r.get("sector", "").lower() == sector.lower()]
    return roles[:limit]

def search_roles_by_title(query: str, limit: int = 20):
    data = load_canonical_roles()
    q = query.lower()
    matched = [r for r in data.get("roles", []) if q in r.get("canonical_title", "").lower()]
    return matched[:limit]
