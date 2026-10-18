#!/usr/bin/env python3
"""
Ajmal Super 40 - REST API & Educational Service Server
======================================================
Production-ready Python HTTP service using standard library.
Provides JSON REST API endpoints for:
  - Fictional student results verification & roll number lookups
  - NEET & JEE statistical rank and college predictions
  - CBT Mock testing question bank queries
  - Static file hosting for the entire web platform

Run with:
  python backend/server.py [port]
"""

import sys
import os
import json
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
sys.path.insert(0, str(BASE_DIR))

try:
    from rank_engine import RankPredictionEngine
except ImportError:
    RankPredictionEngine = None

# Load cached data
RESULTS_FILE = BASE_DIR / "data" / "results.json"
QUESTIONS_FILE = BASE_DIR / "data" / "cbt_questions.json"

results_cache = []
if RESULTS_FILE.exists():
    with open(RESULTS_FILE, "r", encoding="utf-8") as f:
        results_cache = json.load(f)

questions_cache = {}
if QUESTIONS_FILE.exists():
    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        questions_cache = json.load(f)


class AjmalSuper40RequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler serving both REST API endpoints and static assets."""

    def __init__(self, *args, **kwargs):
        # Serve files from project root
        super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json_response(self, data, status_code=200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/")
        query = urllib.parse.parse_qs(parsed.query)

        # API: Health Check
        if path == "/api/v1/health":
            return self._send_json_response({
                "status": "online",
                "service": "Ajmal Super 40 Academic Portal API",
                "version": "2.4.0",
                "total_student_records": len(results_cache),
                "cbt_exams_available": list(questions_cache.get("exams", {}).keys())
            })

        # API: Search & List Results
        if path == "/api/v1/results":
            exam_filter = query.get("exam", [None])[0]
            year_filter = query.get("year", [None])[0]
            search_term = query.get("q", [""])[0].lower()

            filtered = results_cache
            if exam_filter:
                filtered = [r for r in filtered if exam_filter.lower() in r.get("exam", "").lower()]
            if year_filter:
                filtered = [r for r in filtered if str(r.get("year", "")) == str(year_filter)]
            if search_term:
                filtered = [
                    r for r in filtered
                    if search_term in r.get("name", "").lower()
                    or search_term in r.get("roll_no", "").lower()
                    or search_term in r.get("application_no", "").lower()
                ]

            return self._send_json_response({
                "count": len(filtered),
                "total": len(results_cache),
                "results": filtered,
                "disclaimer": "Fictional demonstration data only. Not official examination results."
            })

        # API: Single Result by Roll Number (e.g. /api/v1/results/AS40-2025-NEET-001)
        if path.startswith("/api/v1/results/"):
            roll_no = path.split("/api/v1/results/")[1].strip().upper()
            student = next((r for r in results_cache if r.get("roll_no", "").upper() == roll_no), None)
            if student:
                return self._send_json_response({
                    "success": True,
                    "student": student,
                    "disclaimer": "Fictional demonstration data. All names, scores, and ranks are simulated."
                })
            else:
                return self._send_json_response({
                    "success": False,
                    "error": f"No student record found with Roll Number '{roll_no}'. Try 'AS40-2025-NEET-001' or 'AS40-2025-JEE-001'."
                }, status_code=404)

        # API: CBT Questions
        if path == "/api/v1/cbt/questions":
            exam_type = query.get("exam", ["neet"])[0].lower()
            exam_data = questions_cache.get("exams", {}).get(exam_type)
            if exam_data:
                return self._send_json_response({
                    "success": True,
                    "exam_type": exam_type,
                    "data": exam_data
                })
            else:
                return self._send_json_response({
                    "success": False,
                    "error": f"Invalid exam type '{exam_type}'. Available types: 'neet', 'jee'."
                }, status_code=400)

        # API: Rank Prediction (via GET query params)
        if path == "/api/v1/predict":
            exam = query.get("exam", ["neet"])[0].lower()
            marks_str = query.get("marks", ["600"])[0]
            cat = query.get("category", ["General"])[0]

            try:
                marks = int(marks_str)
            except ValueError:
                return self._send_json_response({"error": "Invalid marks parameter; must be an integer."}, status_code=400)

            if RankPredictionEngine:
                if exam == "neet":
                    pred = RankPredictionEngine.predict_neet(marks, cat)
                else:
                    pred = RankPredictionEngine.predict_jee(marks, cat)
                from dataclasses import asdict
                return self._send_json_response({
                    "success": True,
                    "exam": exam,
                    "prediction": asdict(pred),
                    "disclaimer": "Statistical model estimation only. Actual cutoffs vary annually."
                })
            else:
                return self._send_json_response({"error": "Rank engine module unavailable."}, status_code=500)

        # Fallback to standard static file handler
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/")

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            payload = json.loads(body.decode("utf-8")) if body else {}
        except json.JSONDecodeError:
            payload = {}

        if path == "/api/v1/predict":
            exam = payload.get("exam", "neet").lower()
            marks = int(payload.get("marks", 600))
            category = payload.get("category", "General")

            if RankPredictionEngine:
                if exam == "neet":
                    pred = RankPredictionEngine.predict_neet(marks, category)
                else:
                    pred = RankPredictionEngine.predict_jee(marks, category)
                from dataclasses import asdict
                return self._send_json_response({
                    "success": True,
                    "exam": exam,
                    "prediction": asdict(pred),
                    "disclaimer": "Statistical model estimation only. Not official counseling advice."
                })

        return self._send_json_response({"error": f"Endpoint POST {path} not found."}, status_code=404)


def run_server(port=8080):
    server_address = ("", port)
    httpd = HTTPServer(server_address, AjmalSuper40RequestHandler)
    print("=" * 65)
    print(f" Ajmal Super 40 Academic Server Running on http://localhost:{port}")
    print(f" Serving static root: {PROJECT_ROOT}")
    print(f" API Endpoints:")
    print(f"   • http://localhost:{port}/api/v1/health")
    print(f"   • http://localhost:{port}/api/v1/results")
    print(f"   • http://localhost:{port}/api/v1/results/AS40-2025-NEET-001")
    print(f"   • http://localhost:{port}/api/v1/cbt/questions?exam=neet")
    print(f"   • http://localhost:{port}/api/v1/predict?exam=neet&marks=650")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...")
        httpd.server_close()


if __name__ == "__main__":
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)
