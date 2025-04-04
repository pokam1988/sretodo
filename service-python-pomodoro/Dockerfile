# Dockerfile für service-python-pomodoro

# Verwende ein offizielles Python 3.12 Slim Image
FROM python:3.12-slim

# Setze Umgebungsvariablen
ENV PYTHONDONTWRITEBYTECODE 1 # Verhindert das Schreiben von .pyc Dateien
ENV PYTHONUNBUFFERED 1      # Stellt sicher, dass Python-Output direkt angezeigt wird (gut für Logs)

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Installiere Systemabhängigkeiten falls nötig (hier erstmal keine)
# RUN apt-get update && apt-get install -y --no-install-recommends some-package && rm -rf /var/lib/apt/lists/*

# Installiere Python-Abhängigkeiten
# Kopiere zuerst nur die requirements.txt, um den Docker Cache zu nutzen
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiere den Rest des Anwendungscodes
COPY . .

# Exponiere den Port, den die Anwendung verwendet (aus app.py und docker-compose.yml)
EXPOSE 8002

# Kommando zum Starten der Anwendung mit uvicorn
# uvicorn app:app --host 0.0.0.0 --port 8002
# app:app bedeutet: In der Datei app.py finde das FastAPI Objekt namens app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002"] 