# Service Python Pomodoro (FastAPI)

## Beschreibung

Dieser Service verwaltet Pomodoro-Timer über eine REST API, implementiert mit FastAPI.
Er verwendet eine einfache In-Memory-Datenstruktur zur Speicherung der Timer-Zustände im MVP.

## API Endpunkte

-   **`GET /health`**: Gibt den Service-Status zurück (`{"status": "UP"}`).
-   **`POST /timers/{user_id}/start`**: Startet einen neuen Timer für den angegebenen `user_id`.
    -   **Request Body (JSON):** `{ "duration_minutes": <int>, "timer_type": "<string>" }` (optional, Defaults: 25 Min, "work")
    -   **Response Body:** Aktueller Timer-Zustand.
    -   **Status Codes:** `200 OK`, `409 Conflict` (falls Timer bereits läuft).
-   **`POST /timers/{user_id}/stop`**: Stoppt den aktuell laufenden Timer für den `user_id`.
    -   **Response Body:** Aktueller Timer-Zustand.
    -   **Status Codes:** `200 OK`, `404 Not Found` (falls kein laufender Timer gefunden).
-   **`GET /timers/{user_id}`**: Ruft den aktuellen Status des Timers für den `user_id` ab.
    -   **Response Body:** Aktueller Timer-Zustand.
    -   **Status Codes:** `200 OK`, `404 Not Found`.

## Entwicklungsschritte

*(Hier werden die Implementierungsschritte dokumentiert)*

1.  Initiales Projekt-Setup mit `requirements.txt`.
2.  Dockerfile erstellt.
3.  Basis-FastAPI-App mit `/health`-Endpunkt implementiert.
4.  Pomodoro-Endpunkte (`/start`, `/stop`, `/status`) mit In-Memory-Speicherung hinzugefügt.
5.  `pydantic` zu `requirements.txt` hinzugefügt. 