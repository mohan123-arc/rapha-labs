from flask import Flask, request, jsonify, send_from_directory
from pathlib import Path
from datetime import datetime, timezone
import csv
import re
import secrets

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
CSV_FILE = DATA_DIR / "enquiries.csv"

app = Flask(__name__, static_folder="static")
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024  # 32 KB JSON request limit

FIELDS = [
    "reference", "submitted_at", "customer_type", "service", "name", "email",
    "phone", "institution", "technology", "budget", "deadline", "idea", "brief"
]

@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "app": "RAPHA Labs local website"})

@app.post("/api/enquiries")
def create_enquiry():
    data = request.get_json(silent=True) or {}

    # Honeypot: bots often fill hidden fields.
    if str(data.get("website", "")).strip():
        return jsonify({"error": "Unable to process this enquiry."}), 400

    required = ["customer_type", "service", "name", "email", "phone", "idea"]
    missing = [field for field in required if not str(data.get(field, "")).strip()]
    if missing:
        return jsonify({"error": "Please complete all required fields."}), 400

    email = str(data["email"]).strip()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    clean = {key: str(data.get(key, "")).strip()[:3000] for key in FIELDS if key in data}
    clean["reference"] = "RPH-" + secrets.token_hex(4).upper()
    clean["submitted_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    clean.setdefault("institution", "")
    clean.setdefault("technology", "")
    clean.setdefault("budget", "")
    clean.setdefault("deadline", "")
    clean.setdefault("brief", "")

    new_file = not CSV_FILE.exists()
    with CSV_FILE.open("a", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        if new_file:
            writer.writeheader()
        writer.writerow({field: clean.get(field, "") for field in FIELDS})

    return jsonify({"ok": True, "reference": clean["reference"]}), 201

if __name__ == "__main__":
    # Local development only. Do not use Flask's debug server for public production hosting.
    app.run(host="127.0.0.1", port=5000, debug=True)
