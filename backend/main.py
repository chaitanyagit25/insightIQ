from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import pandas as pd
import io
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), question: str = Form(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("latin-1")))
    
    sample = df.head(20).to_string()
    columns = list(df.columns)
    rows = len(df)

    prompt = f"""
    You are a business data analyst. Here is a sample of the uploaded CSV data:
    Columns: {columns}
    Total rows: {rows}
    Data sample:
    {sample}
    
    Answer this question based on the data: {question}
    Give a clear, concise business insight. Keep it under 100 words.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )

    return {
        "answer": response.choices[0].message.content,
        "columns": columns,
        "rows": rows
    }

@app.get("/")
def root():
    return {"status": "InsightIQ backend running"}