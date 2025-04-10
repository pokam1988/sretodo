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

# Kopiere den gesamten Anwendungscode zuerst
COPY . .

# Installiere Python-Abhängigkeiten aus der bereits kopierten requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Installiere automatisch erkannte Instrumentierungen (z.B. für FastAPI)
RUN opentelemetry-bootstrap -a install

# Exponiere den Port, den die Anwendung verwendet (aus app.py und docker-compose.yml)
EXPOSE 8002

# Kommando zum Starten der Anwendung über den OTel Instrumentierungs-Agent
# Dieser Agent liest Umgebungsvariablen wie OTEL_TRACES_EXPORTER, OTEL_METRICS_EXPORTER etc.
# und startet dann uvicorn.
CMD ["opentelemetry-instrument", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002"] 