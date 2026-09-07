import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional

# Files: index (faiss binary) and metadata (json mapping idx -> metadata)
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
INDEX_PATH = os.path.join(DATA_DIR, "faiss_index.index")
META_PATH = os.path.join(DATA_DIR, "faiss_metadata.json")
EMBEDDING_MODEL = os.getenv("SENTENCE_TRANSFORMER_MODEL", "all-MiniLM-L6-v2")

class FaissVectorStore:
    def __init__(self, model_name: str = EMBEDDING_MODEL, dim: int = 384):
        self.model = SentenceTransformer(model_name)
        self.dim = dim
        os.makedirs(DATA_DIR, exist_ok=True)
        self.index = None
        self.metadata: Dict[int, Dict] = {}
        if os.path.exists(INDEX_PATH) and os.path.exists(META_PATH):
            try:
                self.load()
            except Exception:
                # fallback to fresh index
                self._init_index()
        else:
            self._init_index()

    def _init_index(self):
        # use IndexFlatIP with normalization to use cosine similarity via inner product
        self.index = faiss.IndexFlatIP(self.dim)
        # if GPU is desired and available, user must move index to GPU externally
        self.metadata = {}

    def save(self):
        faiss.write_index(self.index, INDEX_PATH)
        with open(META_PATH, "w", encoding="utf-8") as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)

    def load(self):
        self.index = faiss.read_index(INDEX_PATH)
        with open(META_PATH, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

    def add(self, texts: List[str], metadatas: List[Dict], ids: Optional[List[int]] = None):
        """
        Add texts (titles) with metadata. If ids provided, they will be used as numeric ids in metadata mapping.
        Returns list of assigned integer ids (positions).
        """
        embeddings = self.model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
        # normalize to unit vectors for cosine similarity
        faiss.normalize_L2(embeddings)
        n_before = self.index.ntotal
        self.index.add(embeddings.astype("float32"))
        n_after = self.index.ntotal
        assigned_ids = list(range(n_before, n_after))
        for pos, meta in zip(assigned_ids, metadatas):
            self.metadata[str(pos)] = meta
        self.save()
        return assigned_ids

    def search(self, query: str, top_k: int = 10):
        q_emb = self.model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(q_emb)
        scores, idxs = self.index.search(q_emb.astype("float32"), top_k)
        results = []
        for score, idx in zip(scores[0], idxs[0]):
            if idx == -1:
                continue
            meta = self.metadata.get(str(int(idx)), {})
            results.append({"score": float(score), "index": int(idx), "meta": meta})
        return results

    def get_metadata_by_index(self, idx: int):
        return self.metadata.get(str(idx))

    def all_metadata(self):
        return self.metadata
