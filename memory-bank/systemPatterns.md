# System Patterns: Observability MVP Demo App

## 1. Architecture Overview

The system follows a microservices architecture pattern. Each core piece of functionality (ToDo, Pomodoro, Statistics, Health Checks, Frontend) is implemented as a separate, independently deployable service.

```mermaid
graph LR
    subgraph "User Interaction"
      User --> ANG[Angular Frontend]
    end

    subgraph "Application Services"
      ANG --> DOT[.NET Statistik]
      DOT --> JAVA[Java ToDo]
      ANG --> PY[Python Pomodoro] 
      GO[Go HealthCheck] --> JAVA
      GO --> DOT
      GO --> PY
    end

    subgraph "Observability Pipeline"
      JAVA --> OTEL[Otel Collector]
      DOT --> OTEL
      PY --> OTEL
      GO --> OTEL
      ANG --> OTEL // Frontend instrumentation planned

      OTEL --> PROM[Prometheus]
      OTEL --> TEMPO[Grafana Tempo]
      OTEL --> LOKI[Loki]
    end

    subgraph "Visualization"
      GRAF[Grafana]
      PROM --> GRAF
      TEMPO --> GRAF
      LOKI --> GRAF
    end
```

## 2. Key Design Patterns & Decisions

-   **Microservices:** Decoupling functionality into separate services based on domain (ToDo, Pomodoro, etc.).
-   **API-Driven Communication:** Services primarily communicate via synchronous REST APIs.
    -   Frontend calls Statistik-Service.
    -   Statistik-Service calls ToDo-Service.
    -   Health-Check-Service calls other services' health endpoints.
-   **Centralized Observability Collection:** An OpenTelemetry Collector acts as a central gateway for all telemetry data (metrics, traces, logs) before forwarding it to specialized backends.
-   **Standardized Instrumentation:** Use of OpenTelemetry SDKs across all services ensures consistency in data collection.
-   **Containerization:** Docker is used for packaging each service and the observability stack components, enabling consistent local deployment via Docker Compose.
-   **Data Persistence (MVP):** ToDo and Pomodoro services will initially use in-memory storage or simple file-based persistence for simplicity. A transition to PostgreSQL is considered post-MVP.

## 3. Data Flow

-   **User Request:** User interacts with the Angular frontend.
-   **Frontend Logic:** Frontend fetches data (e.g., statistics) from the .NET Statistik-Service.
-   **Backend Logic:**
    -   Statistik-Service queries the Java ToDo-Service for necessary data (e.g., count of completed ToDos).
    -   ToDo and Pomodoro services manage their respective data.
    -   Health-Check service periodically polls other services.
-   **Telemetry Generation:** Each service generates metrics, traces, and logs during its operation.
-   **Telemetry Collection:** Services send telemetry data to the OpenTelemetry Collector.
-   **Telemetry Processing & Export:** The Collector processes the data (e.g., adding attributes) and exports it to Prometheus (metrics), Tempo (traces), and Loki (logs).
-   **Visualization:** Grafana queries Prometheus, Tempo, and Loki to display dashboards and allow exploration of the observability data. 