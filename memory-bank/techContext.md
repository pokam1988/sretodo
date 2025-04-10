# Tech Context: Observability MVP Demo App

## 1. Service Technologies

-   **Frontend:**
    -   Language/Framework: TypeScript, Angular (targeting v17.x or latest stable v18.x)
    -   UI Library: Angular Material
-   **Statistik-Service:**
    -   Language/Framework: C#, .NET (targeting v8.0.x LTS)
    -   Runtime: .NET Runtime
-   **ToDo-Service:**
    -   Language/Framework: Java (targeting v21 LTS), Spring Boot (targeting v3.2.x)
    -   Runtime: JVM
-   **Pomodoro-Service:**
    -   Language/Framework: Python (targeting v3.12.x)
    -   Web Framework: Flask or FastAPI (To be decided, leaning towards FastAPI for built-in async and docs)
-   **Health-Check-Service:**
    -   Language/Framework: Go (targeting v1.22.x)
    -   Libraries: Standard Go HTTP client, OpenTelemetry Go SDK

## 2. Observability Stack

-   **Instrumentation:** OpenTelemetry SDKs (latest stable versions for each language)
    -   Mode: Primarily Auto-instrumentation where available and suitable, manual instrumentation for specific spans/metrics/logs if needed.
-   **Collector:** OpenTelemetry Collector (`otel/opentelemetry-collector-contrib:0.123.0`)
-   **Metrics Backend:** Prometheus (`prom/prometheus:v3.2.1`)
-   **Tracing Backend:** Grafana Tempo (`grafana/tempo:2.7.1`)
-   **Logging Backend:** Loki (`grafana/loki:3.4.2`)
-   **Visualization:** Grafana (`grafana/grafana:11.1.0`)
-   **Grafana Datasource Provisioning:** Enabled via `observability-stack/grafana/provisioning/datasources/datasources.yaml`.

## 3. Development & Deployment Environment

-   **Containerization:** Docker
-   **Local Orchestration:** Docker Compose
-   **Datenbank:** PostgreSQL (`postgres:16-alpine` Image in Docker Compose)
-   **Target Production Orchestration:** Kubernetes / OpenShift (via Helm-Charts im `kubernetes/` Verzeichnis)
-   **Source Code Management:** Git (Repository hosted on GitHub)
-   **CI/CD:** GitHub Actions (`.github/workflows/deploy.yaml`) für Build, Push zu GitHub Container Registry (ghcr.io), und Deployment zu OpenShift via Helm.

## 4. Key Technical Considerations & Constraints

-   **Language/Framework Versions:** Stick to the specified LTS or latest stable versions for consistency and support.
-   **OpenTelemetry Integration:** Ensure all services correctly configure and export telemetry data to the central collector via OTLP HTTP (`http://otel-collector:4318`).
-   **Datenbank Integration:** `service-java-todo` ist konfiguriert für die Nutzung der PostgreSQL-Datenbank via Spring Data JPA. Das Schema wird durch `spring.jpa.hibernate.ddl-auto=update` verwaltet (nur für Entwicklung).
-   **Docker Compose Setup:** The `docker-compose.yml` defines all services, the collector, the observability backends, and the PostgreSQL database. `tempo` service runs as `root` (`user: \"0\"`) as a workaround for local volume permission issues.
-   **Inter-Service Communication:** Services need to resolve each other's addresses within the Docker Compose network (using service names).
-   **Resource Management:** Keep resource footprints minimal for local development feasibility.
-   **Structured Logging:** Implement structured logging (e.g., JSON) across all services to facilitate better parsing and querying in Loki.
-   **Correlation:** Ensure Trace IDs and Span IDs are propagated correctly across service calls and included in logs for correlation in Grafana. 