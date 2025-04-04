# Progress: Observability MVP Demo App

## 1. Current Status

-   **Overall:** Alle Services inkl. Nginx Gateway laufen via Docker Compose. Basislogik für ToDo, Pomodoro, Statistik, Healthcheck implementiert. Frontend zeigt Daten an, erlaubt Hinzufügen/Löschen/Status ändern von ToDos und Pomodoro-Steuerung. Observability-Stack läuft, Korrelation konfiguriert.
-   **Focus:** Abschluss MVP, Verfeinerungen.
-   **Date:** $(date +%Y-%m-%d)

## 2. What Works

-   Project directory structure exists.
-   Basic project files for each service language/framework are present.
-   `docker-compose.yml` defines all required services and observability components.
-   Configuration files for Prometheus, Otel Collector, and Tempo exist (Tempo-Konfig korrigiert).
-   **Dockerfiles:** Alle Dockerfiles existieren und funktionieren.
-   **Docker Compose Build:** `docker-compose build` läuft erfolgreich durch.
-   **Docker Compose Up:** `docker-compose up -d` startet alle Container erfolgreich.
-   **Erreichbarkeit:** Frontend (`localhost:4200`) und Grafana (`localhost:3000`) sind erreichbar.
-   Code committed and pushed to `feature-250404-start` branch.
-   **Telemetrie:** Logs (mit korrektem `service.name` Label via altem Loki-Exporter + Resource-Processor), Traces und Metriken fließen von Services zum Collector und zu den Backends (Loki, Tempo, Prometheus).
-   **Korrelation:** Die Trace-Log-Korrelation in Grafana ist eingerichtet und funktioniert.
-   Dokumentation des Observability-Stacks (`observability-stack/README.md`) aktualisiert.
-   **Service Logic (ToDo):** Grundlegende CRUD-Endpunkte in `service-java-todo` implementiert (waren bereits vorhanden) und funktional.
-   **Service Logic (Pomodoro):** Grundlegende Endpunkte (Start, Stop, Status) in `service-python-pomodoro` implementiert und funktional.
-   Dokumentation für `service-python-pomodoro` (`README.md`) aktualisiert.
-   **Service Logic (Statistik):** `/statistics`-Endpunkt in `service-dotnet-statistik` implementiert (ruft ToDo-Service auf) und funktional. `/health`-Endpunkt hinzugefügt.
-   Dokumentation für `service-dotnet-statistik` (`README.md`) aktualisiert.
-   **Service Logic (Healthcheck):** `/health/aggregate`-Endpunkt in `service-go-healthcheck` implementiert (prüft andere Services parallel) und funktional.
-   Dokumentation für `service-go-healthcheck` (`README.md`) aktualisiert.
-   **Nginx Gateway:** Gateway implementiert, leitet API-Anfragen (`/api/*`) und Frontend-Anfragen (`/`) korrekt weiter. Zugriff über `http://localhost/`.
-   **Frontend Logic:** Angular Frontend zeigt ToDo-Liste & Statistik an, implementiert ToDo-Erstellen/Löschen/Status-Update, Pomodoro-Anzeige/Steuerung (inkl. Countdown).
-   **CORS:** Probleme durch zentrale Behandlung im Nginx Gateway gelöst, Konfiguration aus Backends entfernt.

## 3. What's Left to Build (High-Level MVP Goals)

1.  ~~**Dockerfiles:** Create Dockerfiles for all services.~~
2.  ~~**Docker Compose Build/Up:** Verify that all service images can be built and containers start.~~
3.  ~~**OpenTelemetry Integration:** Configure and verify telemetry data flow from all services to the Collector and backends, including Trace-Log correlation.~~
4.  ~~**Basic Service Logic:** Implement core functionality (ToDo CRUD, Pomodoro Timers, Statistik Aggregation (ToDo Count), Health Checks, Frontend Display).~~ (Basislogik ist drin, Frontend zeigt an)
5.  **Grafana Dashboards:** ~~Create basic dashboards for visualizing data.~~ (Erstellt: Service-, Log-, Ressourcen-Übersicht via Provisioning) **<- Teilweise Erledigt**
6.  **Fehlerbehebung Grafana Dashboards:** Untersuchen, warum provisionierte Dashboards "No Data" anzeigen.

## 4. Known Issues / Challenges

-   **[Behoben]** Build-Fehler.
-   **[Behoben]** `tempo`-Container Startfehler.
-   **[Behoben]** Loki-Label-Problem (Workaround mit altem Exporter).
-   **[Behoben]** Grafana React-Fehler.
-   **[Behoben]** Python/Uvicorn Routen-Update-Problem (Workaround: Stack-Neustart).
-   **[Behoben]** .NET-Startprobleme (Workaround: Längere Wartezeit).
-   **[Behoben]** CORS-Probleme (Gelöst durch Nginx Gateway).
-   **[Behoben]** Nginx Gateway Start/Konfigurationsprobleme (Volume Mounts, Konfig-Fehler).
-   **[Neu]** Grafana Dashboards (Service Overview, Log Overview, Resource Usage) zeigen "No Data". Ursache (Query, Datenfluss?) unklar.

## 5. Potential Next Steps / Refinements

-   ~~Implement ToDo Edit functionality in Frontend.~~ **(Done)**
-   ~~Refactor API Service logic out of AppComponent.~~ **(Done)**
-   Improve Frontend UI/UX (e.g., proper routing instead of *ngIf).
-   Add OpenTelemetry instrumentation to Angular Frontend.
-   Add more sophisticated backend logic (e.g., user accounts, real persistence).
-   Prepare for Kubernetes deployment. 