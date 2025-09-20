from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load dataset and prepare clusters (run once)
df = pd.read_csv("train_relabelled.csv")
train_texts = df['text'].tolist()
train_labels = np.array(df['label_scaled'].tolist())

# Embed texts
model = SentenceTransformer("Qwen/Qwen3-Embedding-0.6B")
train_embeddings = model.encode(train_texts)

# Build micro-clusters
num_micro_clusters = 3
class_centroids = {}
for c in np.unique(train_labels):
    class_vectors = train_embeddings[train_labels == c]
    kmeans = KMeans(n_clusters=min(num_micro_clusters, len(class_vectors)), random_state=42)
    kmeans.fit(class_vectors)
    class_centroids[c] = kmeans.cluster_centers_

class TextRequest(BaseModel):
    text: str

def predict_sentiment(v):
    best_class = None
    best_sim = -1
    for c, centroids in class_centroids.items():
        for centroid in centroids:
            sim = np.dot(v, centroid) / (np.linalg.norm(v) * np.linalg.norm(centroid))
            if sim > best_sim:
                best_sim = sim
                best_class = c
    return best_class

@app.post("/predict")
def predict(req: TextRequest):
    embedding = model.encode([req.text])[0]
    sentiment = predict_sentiment(embedding)
    return {"sentiment": int(sentiment)}
