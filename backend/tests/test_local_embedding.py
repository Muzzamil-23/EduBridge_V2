from sentence_transformers import SentenceTransformer

MODEL_NAME = "Qwen/Qwen3-Embedding-0.6B"

print("Loading model...")

model = SentenceTransformer(
    MODEL_NAME,
    device="cpu",
)

print("Model loaded successfully.")

text = """
University:
Fast National University

University Type:
Private

City:
Karachi

Program:
BS Computer Science

Program Group:
Computing

Admission Requirements:
Minimum academic percentage: 60%
Entry test required: Yes
Minimum test score: 50%

Fees:
Semester fee: Rs. 150,000

Credit Hours:
130
"""

print("Generating embedding...")

embedding = model.encode(text)

print("Embedding generated.")
print("Dimensions:", len(embedding))