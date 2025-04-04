# Product Context: Observability MVP Demo App

## 1. Problem Space

Modern software development increasingly relies on microservice architectures. While offering flexibility and scalability, these architectures introduce complexity in monitoring and troubleshooting. Understanding the health, performance, and behavior of distributed systems requires robust observability practices.

## 2. Project Purpose

This project serves as a practical demonstration and learning tool for implementing observability in a microservices environment. It aims to:

-   Showcase the integration of various services built with different technologies (Java, .NET, Python, Go, Angular).
-   Demonstrate the use of the OpenTelemetry standard for collecting metrics, traces, and logs.
-   Illustrate how to centralize observability data using an OpenTelemetry Collector.
-   Provide a hands-on example of using popular open-source tools (Prometheus, Grafana Tempo, Loki, Grafana) for storing and visualizing observability data.
-   Serve as a foundation for future explorations, including adding authentication and deploying to Kubernetes.

## 3. Target Audience

-   Developers and DevOps engineers (including juniors) learning about microservices and observability.
-   Teams evaluating or implementing OpenTelemetry and related monitoring tools.

## 4. Key Features (MVP v1)

-   **ToDo Management:** Basic CRUD operations via a Java Spring Boot service.
-   **Pomodoro Timer:** Management of Pomodoro sessions via a Python service.
-   **Statistics Display:** Aggregation of ToDo data by a .NET service and display on an Angular frontend.
-   **Health Monitoring:** Regular health checks of services by a Go service.
-   **Unified Observability:** Collection and visualization of metrics, traces, and logs from all services.

## 5. User Experience Goals (MVP v1)

-   **Simplicity:** Easy to set up and run locally using Docker Compose.
-   **Clarity:** Provide a clear view of basic service interactions and their corresponding observability data in Grafana.
-   **Focus:** Demonstrate core observability concepts without the complexity of authentication or advanced business logic. 