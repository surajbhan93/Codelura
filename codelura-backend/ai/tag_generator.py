from fastapi import FastAPI
from pydantic import BaseModel
import re
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

# 1. Define the Input Schema to match your documentation [cite: 95, 97]
class BlogInput(BaseModel):
    content: str

# 2. Text Cleaning Function [cite: 70, 71, 72]
def clean_text(text: str):
    text = text.lower() # Convert to lowercase [cite: 71]
    text = re.sub(r'[^\w\s]', '', text) # Remove punctuation and special characters [cite: 77]
    text = re.sub(r'\d+', '', text) # Remove numbers [cite: 74]
    return text

# 3. The API Endpoint [cite: 93]
@app.post("/ai/blog-tags")
async def generate_tags(blog: BlogInput):
    # blog.content automatically extracts the string from your JSON
    cleaned_data = clean_text(blog.content)
    
    # Simple rule-based/ML check as requested [cite: 336, 379]
    vectorizer = TfidfVectorizer(stop_words='english', max_features=10)
    
    # TF-IDF requires a list of documents, so we wrap our string in []
    tfidf_matrix = vectorizer.fit_transform([cleaned_data])
    
    # Get the extracted tags
    tags = vectorizer.get_feature_names_out().tolist()
    
    # 4. Return the exact JSON format required 
    return {"tags": tags}