# Active Context: Observability MVP Demo App

## 1. Current Focus

Implement basic service skeletons by creating Dockerfiles for each service and ensuring they can be built and started within the Docker Compose environment. Add basic health check endpoints if not already present.

## 2. Recent Activities

-   Project structure created for all microservices (`frontend-angular`, `service-dotnet-statistik`, `service-java-todo`, `service-python-pomodoro`, `service-go-healthcheck`).
-   Basic project files initialized for each service (using Maven, dotnet CLI, Go modules, Angular CLI, pip requirements).
-   Initial `docker-compose.yml` created, defining services and the observability stack.
-   Minimal configuration files for Prometheus, OpenTelemetry Collector, and Tempo created in `observability-stack`.
-   Memory Bank initialized (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`).
-   `.cursorrules` created and updated with commit/push rule.
-   All initial changes committed and pushed to `feature-250404-start` branch on GitHub.

## 3. Next Steps

1.  **Create Dockerfile for `service-java-todo`:** Define build stages (using Maven) and runtime environment (JRE).
2.  **Create Dockerfile for `service-dotnet-statistik`:** Define build SDK and runtime ASP.NET image.
3.  **Create Dockerfile for `service-python-pomodoro`:** Define base image, install dependencies, and specify run command (uvicorn).
4.  **Create Dockerfile for `service-go-healthcheck`:** Define multi-stage build (builder and runner).
5.  **Create Dockerfile for `frontend-angular`:** Define multi-stage build (Node for building, Nginx/web server for serving).
6.  **Verify Docker Compose Build:** Run `docker-compose build` to ensure all images can be built successfully.
7.  **Verify Docker Compose Up:** Run `docker-compose up` to check if all containers start without immediate errors.
8.  **Update Memory Bank & Push:** Commit and push the changes after Dockerfiles are added and basic startup is verified.

## 4. Open Questions / Decisions

-   Confirm base images and specific versions for Dockerfiles (e.g., specific JRE, Node version, Python version, Go version, Nginx version).
-   Refine port mappings in `docker-compose.yml` if necessary based on Dockerfile configurations.

## 5. Blockers

-   None currently. 