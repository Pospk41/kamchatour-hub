import uuid
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def unique_email(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}@example.com"


def signup(email: str, password: str, role: str, display_name: str = "Test User"):
    resp = client.post(
        "/auth/signup",
        json={
            "email": email,
            "password": password,
            "role": role,
            "display_name": display_name,
        },
    )
    assert resp.status_code == 200, resp.text
    return resp.json()


def login(email: str, password: str) -> str:
    resp = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_health():
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_operator_tours_crud():
    email = unique_email("operator")
    password = "StrongPass123!"
    signup(email, password, "operator", "Operator One")
    token = login(email, password)

    # Create tour
    create_resp = client.post(
        "/operator/tours",
        json={
            "title": "Экотропа у вулкана",
            "description": "Красивый маршрут",
            "price": 15000,
            "currency": "RUB",
            "duration_hours": 6,
            "difficulty": "medium",
            "location": {"city": "Петропавловск-Камчатский"},
            "images": [],
        },
        headers=auth_headers(token),
    )
    assert create_resp.status_code == 200, create_resp.text
    tour = create_resp.json()
    assert tour["is_active"] is False

    # List tours
    list_resp = client.get("/operator/tours", headers=auth_headers(token))
    assert list_resp.status_code == 200
    tours = list_resp.json()
    assert any(t["id"] == tour["id"] for t in tours)

    # Publish
    pub_resp = client.post(f"/operator/tours/{tour['id']}/publish", headers=auth_headers(token))
    assert pub_resp.status_code == 200
    assert pub_resp.json()["is_active"] is True


def test_guide_activities_crud():
    email = unique_email("guide")
    password = "StrongPass123!"
    signup(email, password, "guide", "Guide One")
    token = login(email, password)

    # Create activity
    create_resp = client.post(
        "/guide/activities",
        json={
            "title": "Пешеходная экскурсия",
            "description": "Исторический центр",
            "price": 5000,
            "duration_hours": 3,
            "tags": ["пешком", "история"],
        },
        headers=auth_headers(token),
    )
    assert create_resp.status_code == 200, create_resp.text
    activity = create_resp.json()
    assert activity["is_active"] is False

    # List activities
    list_resp = client.get("/guide/activities", headers=auth_headers(token))
    assert list_resp.status_code == 200
    activities = list_resp.json()
    assert any(a["id"] == activity["id"] for a in activities)

    # Publish
    pub_resp = client.post(f"/guide/activities/{activity['id']}/publish", headers=auth_headers(token))
    assert pub_resp.status_code == 200
    assert pub_resp.json()["is_active"] is True

