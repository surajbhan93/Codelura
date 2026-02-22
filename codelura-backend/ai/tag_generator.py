import sys
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer

def generate_tags():
    try:
        # Read the JSON input from Node.js (Standard Input)
        input_data = sys.stdin.read()
        if not input_data:
            return
        
        data = json.loads(input_data)
        content = data.get("content", "")

        # 1. Extra spaces trimming [Review Point]
        content = content.strip()
        if not content:
            print(json.dumps({"tags": []}))
            return

        # 2. Text Cleaning & Generic word filtering [Review Point]
        # We use TfidfVectorizer's built-in stop_words for generic filtering
        # and a regex to ensure we lean toward letters.
        vectorizer = TfidfVectorizer(
            stop_words='english', 
            token_pattern=r'(?u)\b[a-zA-Z]{3,}\b' # 4. Prefer single-word tags (3+ letters) [Review Point]
        )

        tfidf_matrix = vectorizer.fit_transform([content])
        feature_names = vectorizer.get_feature_names_out()
        scores = tfidf_matrix.toarray().flatten()

        # 3. Sorting based on TF-IDF Score [Review Point]
        # Zip tags with scores and sort descending
        tag_score_pairs = sorted(
            zip(feature_names, scores), 
            key=lambda x: x[1], 
            reverse=True
        )

        # 4. Apply Minimum 5 – Maximum 8 tags rule [Review Point]
        final_tags = [tag for tag, score in tag_score_pairs]
        
        if len(final_tags) > 8:
            final_tags = final_tags[:8]
        elif len(final_tags) < 5 and len(final_tags) > 0:
            # If we have fewer than 5, we keep what we have
            pass

        # Return the exact JSON format required [cite: 98, 99]
        print(json.dumps({"tags": final_tags}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    generate_tags()
