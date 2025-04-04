# System Patterns: Observability MVP Demo App

## 1. Architecture Overview

Die Architektur wurde um ein **Nginx Gateway** als zentralen Einstiegspunkt erweitert.

```mermaid
graph LR
    subgraph "User Interaction"
      User -- Port 80 --> NGINX[Nginx Gateway]
    end

    subgraph "Application Layer (Internal)"
      NGINX -- / --> ANG[Angular Frontend]
      NGINX -- /api/todos --> JAVA[Java ToDo]
      NGINX -- /api/statistics --> DOT[.NET Statistik]
      NGINX -- /api/pomodoro --> PY[Python Pomodoro]
    end
    
    subgraph "Service Dependencies (Internal)"
        DOT --> JAVA
        GO[Go HealthCheck] --> JAVA
        GO --> DOT
        GO --> PY
    end

    subgraph "Observability Pipeline (Internal)"
      JAVA --> OTEL[Otel Collector]
      DOT --> OTEL
      PY --> OTEL
      GO --> OTEL
      ANG --> OTEL // Frontend instrumentation planned

      OTEL --> PROM[Prometheus]
      OTEL --> TEMPO[Grafana Tempo]
      OTEL --> LOKI[Loki]
    end

    subgraph "Visualization (External Access)"
      GRAF[Grafana] -- Port 3000 --> User
      PROMUI[Prometheus UI] -- Port 9090 --> User
      LOKIUI[Loki API] -- Port 3100 --> User
      TEMPOUI[Tempo API] -- Port 3200 --> User
      
      GRAF -- Abfragen --> PROM
      GRAF -- Abfragen --> TEMPO
      GRAF -- Abfragen --> LOKI
    end
```

## 2. Key Design Patterns & Decisions

-   **Microservices:** Decoupling functionality into separate services based on domain (ToDo, Pomodoro, etc.).
-   **API Gateway:** Ein Nginx-Container fungiert als Reverse Proxy und einziger Einstiegspunkt für den Benutzer. Er leitet Anfragen an das Frontend oder die entsprechenden Backend-API-Services weiter.
-   **API-Driven Communication:** Services primarily communicate via synchronous REST APIs.
    -   Frontend calls Statistik-Service.
    -   Statistik-Service calls ToDo-Service.
    -   Health-Check-Service calls other services' health endpoints.
-   **Centralized Observability Collection:** An OpenTelemetry Collector acts as a central gateway for all telemetry data (metrics, traces, logs) before forwarding it to specialized backends.
-   **Standardized Instrumentation:** Use of OpenTelemetry SDKs across all services ensures consistency in data collection.
-   **Containerization:** Docker is used for packaging each service and the observability stack components, enabling consistent local deployment via Docker Compose.
-   **Data Persistence (MVP):** ToDo and Pomodoro services will initially use in-memory storage or simple file-based persistence for simplicity. A transition to PostgreSQL is considered post-MVP.
-   **CORS Handling:** Wird zentral im Nginx Gateway verwaltet (derzeit nicht nötig, da alles über Port 80 läuft), Konfiguration aus Backends entfernt.

## 3. Data Flow

-   **User Request:** User greift auf `http://localhost/` zu.
-   **Gateway:** Nginx Gateway empfängt die Anfrage.
    -   Wenn `/` oder unbekannter Pfad: Leitet an Angular Frontend weiter.
    -   Wenn `/api/...`: Leitet an den entsprechenden Backend-Service weiter (entfernt `/api/...`-Präfix nach Bedarf).
-   **Frontend Logic:** Angular App wird geladen, ruft API-Endpunkte über das Gateway auf (z.B. `/api/todos`, `/api/statistics`).
-   **Backend Logic:**
    -   Statistik-Service queries the Java ToDo-Service for necessary data (e.g., count of completed ToDos).
    -   ToDo and Pomodoro services manage their respective data.
    -   Health-Check service periodically polls other services.
-   **Telemetry Generation:** Each service generates metrics, traces, and logs during its operation.
-   **Telemetry Collection:** Services send telemetry data to the OpenTelemetry Collector.
-   **Telemetry Processing & Export:** The Collector processes the data (e.g., adding attributes via `resource` processor for Loki labels) and exports it to Prometheus (metrics), Tempo (traces), and Loki (logs, using the `loki` exporter).
-   **Visualization:** Grafana queries Prometheus, Tempo, and Loki to display dashboards and allow exploration of the observability data. Trace-Log correlation is configured manually within Grafana's data source settings. 