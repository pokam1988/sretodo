# service-python-pomodoro/app.py
from fastapi import FastAPI

app = FastAPI(title="Pomodoro Service")


@app.get("/health")
def health_check():
    """Einfacher Health-Check Endpunkt."""
    return {"status": "UP"}

# Weitere Endpunkte für Pomodoro-Funktionalität folgen hier...


if __name__ == "__main__":
    import uvicorn
    # Host 0.0.0.0 ist wichtig für Docker
    uvicorn.run(app, host="0.0.0.0", port=8002)  # Port 8002 als Beispiel
