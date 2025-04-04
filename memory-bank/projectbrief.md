# Project Brief: Observability MVP Demo App

## 1. Core Goal

Develop a minimal viable product (MVP) demonstrating a simplified microservices architecture integrated with a comprehensive observability stack (OpenTelemetry, Prometheus, Grafana Tempo, Loki, Grafana).

## 2. Scope (MVP v1 - Simplified)

- Implement basic functionality for each microservice:
    - Frontend (Angular): Display statistics.
    - Statistik-Service (.NET): Aggregate data from ToDo-Service.
    - ToDo-Service (Java Spring Boot): CRUD operations for ToDos.
    - Pomodoro-Service (Python): Manage Pomodoro timers.
    - Health-Check-Service (Golang): Monitor service health.
- Instrument all services using OpenTelemetry SDKs.
- Configure an OpenTelemetry Collector to receive data and export it to Prometheus (metrics), Tempo (traces), and Loki (logs).
- Visualize data using Grafana.
- **Out of Scope for MVP v1:** User authentication, login features, advanced service logic beyond core functionality.

## 3. Key Deliverables

1.  Fully functional microservices meeting the basic requirements defined in the PRD.
2.  Working observability stack integration for all services.
3.  A `docker-compose.yml` file allowing the entire system (services + observability stack) to be run locally with a single command (`docker-compose up`).
4.  Documentation (README, Memory Bank) sufficient for understanding and operation.

## 4. Future Goals (Post-MVP)

-   Implement user authentication (e.g., Keycloak).
-   Enhance service functionalities.
-   Deploy the application to a Kubernetes/OpenShift cluster using Helm charts.
-   Integrate CI/CD pipelines (e.g., GitLab CI/CD). 