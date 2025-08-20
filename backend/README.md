# Travel AI Backend (FastAPI)

Simple MVP backend for traveler and tour operator personal accounts with roles, ratings, boosts, and eco-points.

## Quickstart

Install dependencies:

```bash
pip install -r requirements.txt --break-system-packages
```

Run server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Open docs: http://localhost:8000/docs

## Env
- SECRET_KEY — JWT secret (dev default provided)
- DATABASE_URL — default `sqlite:///./app.db`