# service-python-pomodoro/app.py
import os
import logging  # Hinzugefügt
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import datetime
import threading  # Für spätere Erweiterungen mit echten Timern nützlich

# --- OpenTelemetry Initialisierung --- START --- (AUSKOMMENTIERT FÜR AGENT)
# from opentelemetry import trace
# from opentelemetry.sdk.trace import TracerProvider
# from opentelemetry.sdk.trace.export import BatchSpanProcessor
# from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
#
# from opentelemetry import metrics
# from opentelemetry.sdk.metrics import MeterProvider
# from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
# from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
#
# from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler  # Hinzugefügt für Logs
# from opentelemetry.sdk._logs.export import BatchLogRecordProcessor  # Hinzugefügt für Logs
# # Hinzugefügt für Logs
# from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
#
# from opentelemetry.sdk.resources import Resource, SERVICE_NAME as ResourceAttributesServiceName
#
# from opentelemetry_instrumentation_fastapi import FastAPIInstrumentor
# from opentelemetry_instrumentation_logging import LoggingInstrumentor  # Hinzugefügt
#
# # Service Name für OTel
# SERVICE_NAME = os.environ.get("OTEL_SERVICE_NAME", "service-python-pomodoro")
#
# # OTLP Endpoint (Collector)
# OTEL_EXPORTER_OTLP_ENDPOINT = os.environ.get(
#     "OTEL_EXPORTER_OTLP_ENDPOINT", "http://otel-collector:4317"  # gRPC Endpoint
# )
#
# # Resource Objekt erstellen (gemeinsame Attribute für alle Signale)
# resource = Resource(attributes={
#     ResourceAttributesServiceName: SERVICE_NAME
# })
#
# # --- Tracing Konfiguration ---
# trace_provider = TracerProvider(resource=resource)
# trace_exporter = OTLPSpanExporter(
#     endpoint=OTEL_EXPORTER_OTLP_ENDPOINT, insecure=True)
# trace_processor = BatchSpanProcessor(trace_exporter)
# trace_provider.add_span_processor(trace_processor)
# trace.set_tracer_provider(trace_provider)
#
# # --- Logging Konfiguration ---
# logger_provider = LoggerProvider(resource=resource)  # LoggerProvider erstellen
# log_exporter = OTLPLogExporter(
#     endpoint=OTEL_EXPORTER_OTLP_ENDPOINT, insecure=True)  # Log Exporter
# log_processor = BatchLogRecordProcessor(log_exporter)  # Log Processor
# logger_provider.add_log_record_processor(log_processor)  # Processor hinzufügen
#
# # Logging Instrumentierung konfigurieren
# # LoggingInstrumentor().instrument(set_logging_format=True,
# #                                  logger_provider=logger_provider)
#
# # Standard Python Logging an OTel anbinden
# # handler = LoggingHandler(level=logging.INFO, logger_provider=logger_provider)
# # logging.getLogger().addHandler(handler)
# logging.basicConfig(level=logging.INFO) # Normale Logs aktivieren
#
#
# # --- Metriken Konfiguration ---
# # metric_reader = PeriodicExportingMetricReader(
# #     OTLPMetricExporter(endpoint=OTEL_EXPORTER_OTLP_ENDPOINT, insecure=True)
# # )
# # meter_provider = MeterProvider(
# #     resource=resource, metric_readers=[metric_reader])
# # metrics.set_meter_provider(meter_provider)
# # --- OpenTelemetry Initialisierung --- END ---

logging.basicConfig(level=logging.INFO)  # Aktiviert für Standard-Logs

app = FastAPI(title="Pomodoro Service")

# --- FastAPI Instrumentierung --- (AUSKOMMENTIERT FÜR AGENT)
# Muss nach der Provider-Konfiguration und vor den Routen erfolgen
# FastAPIInstrumentor.instrument_app(app)
# --- Ende FastAPI Instrumentierung ---

# --- CORS Middleware hinzufügen (ENTFERNT) ---
# origins = [
#    "http://localhost:4200",
# ]
#
# app.add_middleware(
#    CORSMiddleware,
#    allow_origins=origins,
#    allow_credentials=True,
#    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#    allow_headers=["*"],
# )

# --- In-Memory Speicher ---
# Simuliert eine Datenbank für den MVP
# Struktur: {user_id: timer_state}
timers_db = {}

# --- Datenmodelle (Pydantic) ---


class TimerState(BaseModel):
    user_id: str
    start_time: datetime.datetime | None = None
    duration_minutes: int = 25
    end_time: datetime.datetime | None = None
    is_running: bool = False
    timer_type: str = "work"  # 'work' oder 'break'


class StartRequest(BaseModel):
    duration_minutes: int = 25
    timer_type: str = "work"


@app.get("/health")
def health_check():
    """Einfacher Health-Check Endpunkt."""
    logging.info("Health check requested")  # Beispiel Log
    return {"status": "UP"}

# --- Pomodoro Endpunkte ---


@app.post("/timers/{user_id}/start", response_model=TimerState)
def start_timer(user_id: str, request: StartRequest):
    """Startet einen neuen Pomodoro-Timer für einen Benutzer."""
    now = datetime.datetime.now(datetime.timezone.utc)
    if user_id in timers_db and timers_db[user_id]["is_running"]:
        raise HTTPException(
            status_code=409, detail="Timer already running for this user.")

    end_time = now + datetime.timedelta(minutes=request.duration_minutes)
    new_timer_state = {
        "user_id": user_id,
        "start_time": now,
        "duration_minutes": request.duration_minutes,
        "end_time": end_time,
        "is_running": True,
        "timer_type": request.timer_type
    }
    timers_db[user_id] = new_timer_state
    # In einer echten Anwendung würde hier ein Hintergrund-Timer gestartet werden
    # Ersetzt durch logging
    logging.info(
        f"Started timer for {user_id} ({request.duration_minutes} min {request.timer_type}) ending at {end_time}")
    return TimerState(**new_timer_state)  # Konvertiere dict zu Pydantic Modell


@app.post("/timers/{user_id}/stop", response_model=TimerState)
def stop_timer(user_id: str):
    """Stoppt den laufenden Pomodoro-Timer für einen Benutzer."""
    if user_id not in timers_db or not timers_db[user_id]["is_running"]:
        raise HTTPException(
            status_code=404, detail="No running timer found for this user.")

    timer_state = timers_db[user_id]
    timer_state["is_running"] = False
    timer_state["end_time"] = datetime.datetime.now(
        datetime.timezone.utc)  # Endzeit auf aktuelle Zeit setzen
    # Optional: Berechne verbleibende Zeit etc.
    logging.info(f"Stopped timer for {user_id}")  # Ersetzt durch logging
    return TimerState(**timer_state)


@app.get("/timers/{user_id}", response_model=TimerState)
def get_timer_status(user_id: str):
    """Gibt den aktuellen Status des Timers für einen Benutzer zurück."""
    if user_id not in timers_db:
        raise HTTPException(
            status_code=404, detail="No timer found for this user.")

    timer_state = timers_db[user_id]
    # Optional: Prüfen, ob der Timer inzwischen abgelaufen sein sollte
    # if timer_state['is_running'] and datetime.datetime.now(datetime.timezone.utc) > timer_state['end_time']:
    #    timer_state['is_running'] = False # Automatisch stoppen, falls abgelaufen

    return TimerState(**timer_state)

# Optional: Endpunkt zum Löschen eines Timers (oder automatische Bereinigung)
# @app.delete("/timers/{user_id}")
# def delete_timer(user_id: str):
#     if user_id in timers_db:
#         del timers_db[user_id]
#         return {"message": "Timer deleted"}
#     else:
#         raise HTTPException(status_code=404, detail="No timer found for this user.")


if __name__ == "__main__":
    import uvicorn
    # Host 0.0.0.0 ist wichtig für Docker
    uvicorn.run("app:app", host="0.0.0.0", port=8002,
                reload=True)  # reload=True für Entwicklung
