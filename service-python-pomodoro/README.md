# Service: Python Pomodoro (FastAPI)

Dieser Service implementiert eine einfache Pomodoro-Timer-API mit FastAPI.

## Endpunkte

- `GET /health`: Gibt den Status des Services zurück.
- `POST /timers/{user_id}/start`: Startet einen Timer für einen Benutzer.
- `POST /timers/{user_id}/stop`: Stoppt einen Timer für einen Benutzer.
- `GET /timers/{user_id}`: Gibt den Status eines Timers zurück.

## Technologie

- Python 3.12
- FastAPI
- Uvicorn

## Observability

Die Instrumentierung für OpenTelemetry (Traces, Logs, Metriken) erfolgt **automatisch** über den `opentelemetry-instrument` Agenten.

- **Abhängigkeiten:** `opentelemetry-distro` und `opentelemetry-exporter-otlp` sind in `requirements.txt` definiert.
- **Installation der Instrumentierung:** Der `opentelemetry-bootstrap -a install` Befehl im `Dockerfile` installiert automatisch die notwendigen Instrumentierungsbibliotheken (z.B. für FastAPI, Logging).
- **Start:** Der Container wird über `CMD ["opentelemetry-instrument", "uvicorn", ...]` im `Dockerfile` gestartet.
- **Konfiguration:** Der Agent wird über Umgebungsvariablen in `docker-compose.yml` konfiguriert (z.B. `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_TRACES_EXPORTER`, `OTEL_METRICS_EXPORTER`, `OTEL_LOGS_EXPORTER`, `OTEL_EXPORTER_OTLP_PROTOCOL`).

Es ist **kein manueller** OpenTelemetry-Initialisierungscode in `app.py` mehr notwendig.

## Starten (innerhalb von Docker Compose)

Der Service wird automatisch als Teil des `docker-compose up` Befehls im Hauptverzeichnis gestartet.

## Starten (in Kubernetes via Helm)

Der Service wird zusammen mit den anderen Services über Helm bereitgestellt (siehe `kubernetes/README.md`). Die Konfiguration der OTel-Umgebungsvariablen erfolgt ebenfalls über die Helm-Charts. 