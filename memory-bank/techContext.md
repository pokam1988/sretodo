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
-   **Collector:** OpenTelemetry Collector (Contrib distribution recommended for wider processor/exporter support)
-   **Metrics Backend:** Prometheus
-   **Tracing Backend:** Grafana Tempo
-   **Logging Backend:** Loki
-   **Visualization:** Grafana (targeting v11.x or latest stable)

## 3. Development & Deployment Environment

-   **Containerization:** Docker
-   **Local Orchestration:** Docker Compose
-   **Target Production Orchestration (Future):** Kubernetes / OpenShift
-   **Source Code Management:** Git (Repository hosted on GitHub)
-   **CI/CD (Future):** GitLab CI/CD (or GitHub Actions)

## 4. Key Technical Considerations & Constraints

-   **Language/Framework Versions:** Stick to the specified LTS or latest stable versions for consistency and support.
-   **OpenTelemetry Integration:** Ensure all services correctly configure and export telemetry data to the central collector via OTLP (HTTP or gRPC, TBD - likely HTTP for simplicity).
-   **Docker Compose Setup:** The `docker-compose.yml` must define all services, the collector, and the observability backends (Prometheus, Tempo, Loki, Grafana) with appropriate networking and dependencies.
-   **Inter-Service Communication:** Services need to resolve each other's addresses within the Docker Compose network (using service names).
-   **Resource Management:** Keep resource footprints minimal for local development feasibility.
-   **Structured Logging:** Implement structured logging (e.g., JSON) across all services to facilitate better parsing and querying in Loki.
-   **Correlation:** Ensure Trace IDs and Span IDs are propagated correctly across service calls and included in logs for correlation in Grafana. 