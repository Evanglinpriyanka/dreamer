import os
import json
from datetime import datetime
from collections import defaultdict

import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
import hdbscan
from sklearn.metrics.pairwise import cosine_similarity

from prefect import flow, task

# local vectorstore helper (FAISS)
from services.vectorstore import FaissVectorStore

MODEL_NAME = os.getenv("SENTENCE_TRANSFORMER_MODEL", "all-MiniLM-L6-v2")
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
SAMPLE_CSV = os.path.join(os.path.dirname(__file__), "sample_jobs.csv")
OUTPUT_FILE = os.path.join(DATA_DIR, "canonical_roles.json")

@task
def load_sample_jobs(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df['title'] = df.get('title', '').astype(str).str.strip()
    df['description'] = df.get('description', '').fillna('').astype(str)
    df['sector'] = df.get('sector', 'Other').fillna('Other')
    df['last_seen'] = pd.to_datetime(df.get('last_seen', None), errors='coerce')
    return df

@task
def embed_titles_local(titles: list, model_name: str):
    # Only used to get embeddings for clustering algorithm
    model = SentenceTransformer(model_name)
    embeddings = model.encode(titles, show_progress_bar=True, convert_to_numpy=True)
    return embeddings

@task
def cluster_embeddings(embeddings: np.ndarray, min_cluster_size: int = 2):
    clusterer = hdbscan.HDBSCAN(min_cluster_size=min_cluster_size, metric='euclidean')
    cluster_labels = clusterer.fit_predict(embeddings)
    probabilities = getattr(clusterer, "probabilities_", None)
    return cluster_labels.tolist(), (probabilities.tolist() if probabilities is not None else None)

def infer_sector_from_title(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["agri", "farm", "crop", "dairy", "horti", "plant", "soil", "poultry", "drone"]):
        return "Agriculture & Allied Sciences"
    if any(k in t for k in ["architect", "3d", "interior", "landscape", "bim", "design", "visualizer"]):
        return "Architecture & Design"
    if any(k in t for k in ["software", "engineer", "developer", "data", "devops", "cloud", "machine", "ml", "backend", "frontend", "full stack", "sre", "security", "ai"]):
        return "Information Technology & Computer Science"
    return "Other"

@task
def build_canonical_roles_and_faiss(df: pd.DataFrame, titles: list, embeddings: np.ndarray, labels: list, probabilities=None):
    roles = []
    by_cluster = defaultdict(list)
    for idx, lbl in enumerate(labels):
        by_cluster[lbl].append(idx)
    sim = cosine_similarity(embeddings)
    # Initialize FAISS store and collect texts/metadatas to add
    vector_store = FaissVectorStore(model_name=MODEL_NAME, dim=embeddings.shape[1])
    texts_to_add = []
    metas_to_add = []

    for lbl, idxs in by_cluster.items():
        if lbl == -1:
            for i in idxs:
                row = df.iloc[i]
                role_id = f"seed-{i}"
                role = {
                    "role_id": role_id,
                    "canonical_title": row['title'],
                    "sector": row.get("sector", infer_sector_from_title(row['title'])),
                    "sub_sector": None,
                    "description": row.get("description", ""),
                    "responsibilities": [],
                    "must_have_skills": [{"skill_name": s.strip(), "confidence": 0.7} for s in (row.get("skills") or "").split(";") if s.strip()],
                    "nice_to_have_skills": [],
                    "qualifications": [q.strip() for q in (row.get("typical_degree") or "").split(";") if q.strip()],
                    "certifications": [],
                    "experience_years": None,
                    "typical_salary": {"min": int(row.get("salary_min_inr")) if pd.notnull(row.get("salary_min_inr")) else None, "max": int(row.get("salary_max_inr")) if pd.notnull(row.get("salary_max_inr")) else None, "currency": "INR"},
                    "location_coverage": [],
                    "sample_job_postings": [{"source": row.get("source_url"), "url": row.get("source_url"), "posted_at": row.get("last_seen").isoformat() if pd.notnull(row.get("last_seen")) else None}],
                    "last_seen_at": row.get("last_seen").isoformat() if pd.notnull(row.get("last_seen")) else datetime.utcnow().isoformat(),
                    "confidence_score": 0.35,
                    "provenance": [{"source": row.get("source_url"), "url": row.get("source_url"), "collected_at": datetime.utcnow().isoformat(), "method": "seed"}]
                }
                roles.append(role)
                # prepare for vectorstore: text + meta
                texts_to_add.append(role["canonical_title"])
                metas_to_add.append({"role_id": role_id, "sector": role["sector"], "provenance": role["provenance"]})
            continue

        idx_array = np.array(idxs)
        sub_sim = sim[np.ix_(idx_array, idx_array)]
        medoid_idx = idx_array[sub_sim.sum(axis=1).argmax()]
        canonical_title = titles[medoid_idx]
        sample_postings = []
        prov = []
        last_seen = None
        for i in idxs:
            row = df.iloc[i]
            sample_postings.append({"source": row.get("source_url"), "url": row.get("source_url"), "posted_at": row.get("last_seen").isoformat() if pd.notnull(row.get("last_seen")) else None})
            prov.append({"source": row.get("source_url"), "url": row.get("source_url"), "collected_at": datetime.utcnow().isoformat(), "method": "seed"})
            if pd.notnull(row.get("last_seen")):
                if last_seen is None or row.get("last_seen") > last_seen:
                    last_seen = row.get("last_seen")
        size_conf = min(0.9, 0.2 + 0.15 * len(idxs))
        prob_conf = 0.0
        if probabilities is not None:
            prob_conf = float(np.mean([probabilities[i] for i in idxs]))
        confidence_score = round(min(1.0, size_conf * 0.7 + prob_conf * 0.3), 2)
        row0 = df.iloc[idxs[0]]
        role_id = f"cluster-{lbl}"
        role = {
            "role_id": role_id,
            "canonical_title": canonical_title,
            "sector": row0.get("sector", infer_sector_from_title(canonical_title)),
            "sub_sector": None,
            "description": row0.get("description", ""),
            "responsibilities": [],
            "must_have_skills": [{"skill_name": s.strip(), "confidence": 0.8} for s in (row0.get("skills") or "").split(";") if s.strip()],
            "nice_to_have_skills": [],
            "qualifications": [q.strip() for q in (row0.get("typical_degree") or "").split(";") if q.strip()],
            "certifications": [],
            "experience_years": None,
            "typical_salary": {"min": int(row0.get("salary_min_inr")) if pd.notnull(row0.get("salary_min_inr")) else None, "max": int(row0.get("salary_max_inr")) if pd.notnull(row0.get("salary_max_inr")) else None, "currency": "INR"},
            "location_coverage": list({df.iloc[i].get("sector") for i in idxs if df.iloc[i].get("sector")}),
            "sample_job_postings": sample_postings,
            "last_seen_at": last_seen.isoformat() if last_seen is not None else datetime.utcnow().isoformat(),
            "confidence_score": confidence_score,
            "provenance": prov
        }
        roles.append(role)
        texts_to_add.append(role["canonical_title"])
        metas_to_add.append({"role_id": role_id, "sector": role["sector"], "provenance": role["provenance"]})

    # Add all texts/metadatas to FAISS vector store (in one batch)
    if texts_to_add:
        vector_store.add(texts_to_add, metas_to_add)

    return roles

@task
def save_roles(roles: list, output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"generated_at": datetime.utcnow().isoformat(), "roles": roles}, f, indent=2, ensure_ascii=False)
    return output_path

@flow(name="canonical-role-generation")
def canonical_role_generation_flow(sample_csv: str = SAMPLE_CSV, model_name: str = MODEL_NAME, output_file: str = OUTPUT_FILE):
    df = load_sample_jobs(sample_csv)
    titles = df['title'].tolist()
    embeddings = embed_titles_local(titles, model_name)
    labels, probabilities = cluster_embeddings(embeddings, min_cluster_size=2)
    roles = build_canonical_roles_and_faiss(df, titles, embeddings, labels, probabilities)
    save_path = save_roles(roles, output_file)
    return save_path

if __name__ == '__main__':
    out = canonical_role_generation_flow()
    print(f"Canonical roles written to: {out}")
