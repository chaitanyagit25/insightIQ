# InsightIQ — AI Business Intelligence Dashboard

Upload any CSV file and ask questions about your data in plain English. No SQL. No analyst. Just answers.

## Live Demo
🔗 🔗 [insightiq.vercel.app](https://insight-iq-jet.vercel.app)
## Features
- Upload CSV or Excel files
- AI-powered natural language queries on your data
- Auto-generated charts and visualizations
- Real-time business insights
- Secure backend — API keys never exposed to browser

## Tech Stack
**Frontend:** React, TailwindCSS, Recharts, Axios  
**Backend:** Python, FastAPI, Pandas, Groq AI  
**Deployment:** Vercel (frontend) + Render (backend)

## Run Locally

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Environment Variables

### Frontend (.env)
```
VITE_GROQ_API_KEY=your_key
```

### Backend (.env)
```
GROQ_API_KEY=your_key
```

## Built by
Chaitanya — 2nd year Computer technolgy student @ YCCE Nagpur