# Active Context: Observability MVP Demo App

## 1. Current Focus

Implementierung der Basis-Service-Logik und Sicherstellung des OpenTelemetry-Datenflusses.

## 2. Recent Activities

-   Project structure created for all microservices.
-   Basic project files initialized for each service.
-   Initial `docker-compose.yml` created.
-   Minimal configuration files for Prometheus, OpenTelemetry Collector, and Tempo created.
-   Memory Bank initialized.
-   `.cursorrules` created.
-   **Dockerfiles:** Alle Dockerfiles wurden erstellt.
-   **Build/Startup:** Mehrere Iterationen von `docker-compose build` und `docker-compose up` durchgeführt, um Build-Fehler (Abhängigkeiten in Java, Node, Go) und Laufzeitfehler (Tempo-Konfiguration) zu beheben.
-   **Verification:** Alle Services laufen nun stabil in Docker Compose. Frontend und Grafana sind über die definierten Ports erreichbar.

## 3. Next Steps

1.  ~~**Create Dockerfile for `service-java-todo`:** Define build stages (using Maven) and runtime environment (JRE).~~
2.  ~~**Create Dockerfile for `service-dotnet-statistik`:** Define build SDK and runtime ASP.NET image.~~
3.  ~~**Create Dockerfile for `service-python-pomodoro`:** Define base image, install dependencies, and specify run command (uvicorn).~~
4.  ~~**Create Dockerfile for `service-go-healthcheck`:** Define multi-stage build (builder and runner).~~
5.  ~~**Create Dockerfile for `frontend-angular`:** Define multi-stage build (Node for building, Nginx/web server for serving).~~
6.  ~~**Verify Docker Compose Build:** Run `docker-compose build` to ensure all images can be built successfully.~~
7.  ~~**Verify Docker Compose Up:** Run `docker-compose up` to check if all containers start without immediate errors.~~
8.  **Update Memory Bank & Commit:** Den aktuellen Stand dokumentieren und committen. **<- YOU ARE HERE**
9.  **Implement Basic Logic (ToDo):** Füge CRUD-Endpunkte in `service-java-todo` hinzu.
10. **Implement Basic Logic (Pomodoro):** Füge Endpunkte zum Starten/Stoppen von Timern in `service-python-pomodoro` hinzu.
11. **Implement Basic Logic (Statistik):** Füge einen Endpunkt in `service-dotnet-statistik` hinzu, der Daten von anderen Services abruft und aggregiert.
12. **Implement Basic Logic (Healthcheck):** Stelle sicher, dass `service-go-healthcheck` die `/health`-Endpunkte der anderen Services prüft.
13. **Implement Basic Logic (Frontend):** Zeige grundlegende Daten von den Backend-Services im Angular Frontend an.
14. **Verify Telemetry:** Überprüfe in Grafana (Loki, Tempo, Prometheus), ob Logs, Traces und Metriken von den Services ankommen.

## 4. Open Questions / Decisions

-   Definitive `/health`-Endpunkt-Pfade für alle Services festlegen (falls nicht Standard).
-   Genaues Datenformat für die Statistik-Aggregation definieren.

## 5. Blockers

-   None currently. 