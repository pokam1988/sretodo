# Active Context: Observability MVP Demo App (Initialization)

## 1. Current Focus

Initialize the project structure and begin implementation of the core services and the Docker Compose setup.

## 2. Recent Activities

-   Project definition documents (`AI-PROMPT.md`, `PRD.md`, `README.md`) have been reviewed.
-   The initial Memory Bank (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`) has been created based on these documents.

## 3. Next Steps

1.  **Establish Project Structure:** Create directories for each microservice (e.g., `frontend-angular`, `service-dotnet-statistik`, `service-java-todo`, `service-python-pomodoro`, `service-go-healthcheck`).
2.  **Initialize Services:** Create basic project files (e.g., `pom.xml`, `.csproj`, `package.json`, `go.mod`, `requirements.txt`) for each service using their respective CLIs or standard templates.
3.  **Develop Docker Compose Configuration:** Create an initial `docker-compose.yml` defining the services and the core observability stack components (Otel Collector, Prometheus, Grafana, Tempo, Loki).
4.  **Implement Basic Service Skeletons:** Add minimal HTTP endpoints (e.g., a `/health` endpoint) to each service to verify they can start and communicate within the Docker network.
5.  **Integrate Basic OpenTelemetry:** Add initial OpenTelemetry SDK configuration and basic instrumentation to each service to confirm telemetry data flow to the Collector.

## 4. Open Questions / Decisions

-   Confirm specific versions for dependencies if not already strictly defined (e.g., precise Angular version, Python web framework - FastAPI preferred).
-   Decide on OTLP protocol (HTTP vs. gRPC) for telemetry export - Recommend starting with HTTP for simplicity.
-   Define standard port mappings for services within Docker Compose.

## 5. Blockers

-   None currently. 