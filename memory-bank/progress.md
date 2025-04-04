# Progress: Observability MVP Demo App

## 1. Current Status

-   **Overall:** Dockerfiles erstellt, alle Images erfolgreich gebaut, alle Container via Docker Compose gestartet und laufen. Grundlegende Erreichbarkeit (Frontend, Grafana) bestätigt.
-   **Focus:** Implementierung der Basislogik in den Services und Überprüfung des Telemetrie-Datenflusses.
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

## 3. What's Left to Build (High-Level MVP Goals)

1.  ~~**Dockerfiles:** Create Dockerfiles for all services.~~
2.  ~~**Docker Compose Build/Up:** Verify that all service images can be built and containers start.~~
3.  ~~**OpenTelemetry Integration:** Configure and verify telemetry data flow from all services to the Collector and backends, including Trace-Log correlation.~~
4.  **Basic Service Logic:** Implement core functionality (~~ToDo CRUD~~, ~~Pomodoro Timers~~, ~~Statistik Aggregation (ToDo Count)~~, Health Checks, Frontend Display).
5.  **Grafana Dashboards:** Create basic dashboards for visualizing data.

## 4. Known Issues / Challenges

-   **[Behoben]** Build-Fehler aufgrund von Abhängigkeitsproblemen (Maven `pom.xml`, npm `package-lock.json`, Go `go.sum`/Version).
-   **[Behoben]** `tempo`-Container startete aufgrund einer fehlerhaften Konfiguration (`tempo-config.yaml`).
-   **[Behoben]** Loki erkannte das `service.name` Attribut nicht korrekt als Label mit dem `otlphttp/loki` Exporter. Wechsel zum alten `loki` Exporter mit `resource` Processor als Workaround.
-   **[Behoben]** React-Fehler in Grafana beim Anzeigen von Tempo-Traces (behoben durch Neustart von Grafana/Tempo).
-   **[Workaround]** Neubau des gesamten Stacks (`docker-compose down && docker-compose up --build`) scheint nach Code-Änderungen im Python-Service notwendig zu sein, damit Uvicorn die neuen Routen erkennt.
-   **[Gelöst/Beobachtung]** Startprobleme des `service-dotnet-statistik`-Containers traten auf, schienen aber eher mit dem Timing beim Hochfahren des Stacks zusammenzuhängen. Eine längere Wartezeit (`sleep 40`) nach `docker-compose up` hat das Problem behoben. Funktioniert nun auch mit OTel-Konfiguration. 