import pytest
from app.models import Question, SharedExam


def seed_question(db, qid=1, domain_id=1):
    q = Question(
        id=qid,
        domain_id=domain_id,
        domain="Test Domain",
        scenario="Scenario",
        question="What is X?",
        options=[{"id": "a", "text": "A", "correct": True}, {"id": "b", "text": "B", "correct": False}],
        correct_answer="a",
        explanation="Because A.",
    )
    db.add(q)
    db.commit()
    return q


def test_create_shared_exam_requires_auth(client):
    resp = client.post("/api/shared-exams/", json={
        "title": "My Exam",
        "question_ids": [1],
        "time_limit_minutes": 30,
        "domains_selected": [1],
    })
    assert resp.status_code == 401


def test_create_shared_exam(auth_client, db):
    client, user = auth_client
    seed_question(db)
    resp = client.post("/api/shared-exams/", json={
        "title": "My Exam",
        "question_ids": [1],
        "time_limit_minutes": 30,
        "domains_selected": [1],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "My Exam"
    assert data["creator_username"] == "testuser"
    assert data["question_count"] == 1


def test_list_shared_exams_is_public(client, auth_client, db):
    ac, user = auth_client
    seed_question(db)
    ac.post("/api/shared-exams/", json={
        "title": "Shared",
        "question_ids": [1],
        "time_limit_minutes": None,
        "domains_selected": [1],
    })
    # unauthenticated client can list
    resp = client.get("/api/shared-exams/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert data["total_pages"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Shared"
    assert data["items"][0]["creator_username"] == "testuser"


def test_get_shared_exam_detail(client, auth_client, db):
    ac, user = auth_client
    seed_question(db)
    create_resp = ac.post("/api/shared-exams/", json={
        "title": "Detail Exam",
        "question_ids": [1],
        "time_limit_minutes": 60,
        "domains_selected": [1],
    })
    exam_id = create_resp.json()["id"]
    resp = client.get(f"/api/shared-exams/{exam_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Detail Exam"
    assert len(data["questions"]) == 1
    assert data["questions"][0]["id"] == 1


def test_get_shared_exam_not_found(client):
    resp = client.get("/api/shared-exams/9999")
    assert resp.status_code == 404


def test_create_shared_exam_empty_question_ids_rejected(auth_client, db):
    client, user = auth_client
    resp = client.post("/api/shared-exams/", json={
        "title": "Empty",
        "question_ids": [],
        "time_limit_minutes": None,
        "domains_selected": [1],
    })
    assert resp.status_code == 422


def test_list_shared_exams_paginated(auth_client, db):
    client, user = auth_client
    seed_question(db)
    for i in range(15):
        client.post("/api/shared-exams/", json={
            "title": f"Exam {i}",
            "question_ids": [1],
            "time_limit_minutes": None,
            "domains_selected": [1],
        })
    resp = client.get("/api/shared-exams/?page=1&page_size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 15
    assert data["total_pages"] == 2
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert len(data["items"]) == 10


def test_list_shared_exams_second_page(auth_client, db):
    client, user = auth_client
    seed_question(db)
    for i in range(15):
        client.post("/api/shared-exams/", json={
            "title": f"Exam {i}",
            "question_ids": [1],
            "time_limit_minutes": None,
            "domains_selected": [1],
        })
    resp = client.get("/api/shared-exams/?page=2&page_size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert data["page"] == 2
    assert len(data["items"]) == 5


def test_list_shared_exams_page_beyond_total(client):
    resp = client.get("/api/shared-exams/?page=99&page_size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0


def test_list_shared_exams_invalid_page_size(client):
    resp = client.get("/api/shared-exams/?page=1&page_size=1000")
    assert resp.status_code == 422


def test_get_shared_exam_preserves_question_order(auth_client, db):
    client, user = auth_client
    seed_question(db, qid=1)
    seed_question(db, qid=2)
    seed_question(db, qid=3)
    # Create exam with questions in non-sequential order
    create_resp = client.post("/api/shared-exams/", json={
        "title": "Order Test",
        "question_ids": [3, 1, 2],
        "time_limit_minutes": None,
        "domains_selected": [1],
    })
    exam_id = create_resp.json()["id"]
    resp = client.get(f"/api/shared-exams/{exam_id}")
    assert resp.status_code == 200
    question_ids_in_response = [q["id"] for q in resp.json()["questions"]]
    assert question_ids_in_response == [3, 1, 2]
