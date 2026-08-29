import os
import glob
import re
from typing import List, Dict, Any

class OfflineRAGEngine:
    def __init__(self, knowledge_dir: str):
        self.knowledge_dir = knowledge_dir
        self.documents: List[Dict[str, Any]] = []
        self.load_documents()

    def load_documents(self):
        self.documents = []
        pattern = os.path.join(self.knowledge_dir, "*.md")
        files = glob.glob(pattern)

        for file_path in files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Extract frontmatter metadata if present
                meta = {
                    "title": os.path.basename(file_path).replace(".md", "").replace("_", " ").title(),
                    "category": "general",
                    "source": "Offline Survival Handbook",
                    "region": "Global",
                    "verified": True,
                    "file_path": file_path
                }

                if content.startswith("---"):
                    parts = content.split("---", 2)
                    if len(parts) >= 3:
                        yaml_lines = parts[1].strip().split("\n")
                        for line in yaml_lines:
                            if ":" in line:
                                k, v = line.split(":", 1)
                                meta[k.strip().lower()] = v.strip().strip('"').strip("'")
                        body = parts[2].strip()
                    else:
                        body = content
                else:
                    body = content

                # Chunk document by sections (headings)
                chunks = self.chunk_text(body)
                for i, chunk in enumerate(chunks):
                    self.documents.append({
                        "id": f"{meta['title']}_{i}",
                        "title": meta["title"],
                        "category": meta.get("category", "survival"),
                        "source": meta.get("source", "Apocalypse AI Core Knowledge"),
                        "region": meta.get("region", "Global"),
                        "verified": str(meta.get("verified", "true")).lower() == "true",
                        "content": chunk,
                        "file_name": os.path.basename(file_path)
                    })
            except Exception as e:
                print(f"Error indexing {file_path}: {e}")

    def chunk_text(self, text: str, max_words: int = 250) -> List[str]:
        sections = re.split(r'\n(?=#{1,3}\s)', text)
        chunks = []
        for section in sections:
            words = section.split()
            if len(words) <= max_words:
                if section.strip():
                    chunks.append(section.strip())
            else:
                for i in range(0, len(words), max_words):
                    chunk = " ".join(words[i:i + max_words])
                    if chunk.strip():
                        chunks.append(chunk.strip())
        return chunks if chunks else [text]

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        if not self.documents:
            self.load_documents()

        query_terms = set(re.findall(r'\w+', query.lower()))
        if not query_terms:
            return self.documents[:top_k]

        scored_docs = []
        for doc in self.documents:
            doc_text = (doc["title"] + " " + doc["category"] + " " + doc["content"]).lower()
            doc_words = set(re.findall(r'\w+', doc_text))
            
            # Match score: overlap count + term frequency
            score = 0
            for term in query_terms:
                if term in doc_words:
                    score += 2
                    score += doc_text.count(term) * 0.2

            if score > 0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        results = [doc for score, doc in scored_docs[:top_k]]
        
        # If no direct match, return top general documents
        if not results:
            results = self.documents[:top_k]

        return results
