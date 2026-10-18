# Ajmal Super 40 - Backend Architecture & REST API

This directory contains the Python analytical backend and HTTP service for the Ajmal Super 40 web platform.

## Architecture Overview

```
backend/
├── data/
│   ├── results.json        # Fictional student results & marksheets database
│   └── cbt_questions.json  # Full NEET & JEE question bank with solutions
├── rank_engine.py          # Mathematical percentile modeling & college allotment logic
├── server.py               # Production HTTP & REST API server (Standard Library)
└── README.md               # Technical API documentation
```

## Running the Backend Server

The backend requires Python 3.8+ and uses only the Python standard library (no external pip dependencies needed):

```bash
# Start server on default port 8080
python backend/server.py

# Or specify a custom port
python backend/server.py 3000
```

When running, the server serves:
1. **The entire frontend portal** at `http://localhost:8080/index.html`
2. **REST JSON APIs** under the `/api/v1/` route prefix

---

## REST API Specification

### 1. Health Check
* **Endpoint:** `GET /api/v1/health`
* **Response:**
```json
{
  "status": "online",
  "service": "Ajmal Super 40 Academic Portal API",
  "version": "2.4.0",
  "total_student_records": 8,
  "cbt_exams_available": ["neet", "jee"]
}
```

### 2. Search & Filter Student Results
* **Endpoint:** `GET /api/v1/results`
* **Query Parameters:**
  - `exam`: Filter by exam (`neet-ug`, `jee-main`, `jee-advanced`)
  - `year`: Filter by batch year (e.g., `2025`)
  - `q`: Search by student name, roll number, or application number
* **Example:** `curl http://localhost:8080/api/v1/results?exam=neet&q=rahul`

### 3. Marksheet by Roll Number
* **Endpoint:** `GET /api/v1/results/{roll_no}`
* **Example:** `curl http://localhost:8080/api/v1/results/AS40-2025-NEET-001`
* **Sample Response:**
```json
{
  "success": true,
  "student": {
    "roll_no": "AS40-2025-NEET-001",
    "name": "Rahul Ahmed",
    "exam": "NEET-UG",
    "total_marks": 685,
    "max_marks": 720,
    "percentile": 99.78,
    "air_rank": 342,
    "allotted_institution": "Gauhati Medical College & Hospital (GMCH)",
    "course_allotted": "MBBS",
    "verified": true
  }
}
```

### 4. Interactive Rank & College Predictor
* **Endpoint:** `GET /api/v1/predict?exam=neet&marks=660&category=General`
* **Endpoint:** `POST /api/v1/predict` (JSON payload: `{"exam": "jee", "marks": 240, "category": "General"}`)
* **Sample Response:**
```json
{
  "success": true,
  "exam": "neet",
  "prediction": {
    "marks": 660,
    "estimated_percentile": 99.26,
    "estimated_air_low": 1804,
    "estimated_air_high": 2296,
    "qualifying_status": "Qualified for NEET Counseling",
    "probable_colleges": [
      { "name": "AIIMS Guwahati", "tier": "Top Central", "chance": "Moderate" },
      { "name": "Gauhati Medical College (GMCH)", "tier": "Premier State", "chance": "Very High Chance" }
    ]
  }
}
```

### 5. CBT Question Bank
* **Endpoint:** `GET /api/v1/cbt/questions?exam=neet`
* **Endpoint:** `GET /api/v1/cbt/questions?exam=jee`
* Returns questions, multiple options, section designations, and solutions for the client-side testing console.

---

## Important Notice Regarding Demo Data
All student records, marks, All India Ranks, percentiles, and college allotments are **entirely fictional demonstration data**. They are created solely for user experience and interface testing.
