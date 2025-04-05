# Active Context: Observability MVP Demo App

## Aktueller Fokus

Der Fokus liegt auf der Stabilisierung und Verbesserung des Kubernetes-Deployments. Dazu gehören die Erstellung funktionierender Grafana-Dashboards und die Definition von Ressourcenlimits für die Services. Die grundlegende Bereitstellung via Helm funktioniert.

## 2. Recent Activities

-   Basislogik für ToDo, Pomodoro, Statistik und Healthcheck implementiert.
-   Frontend zeigt Daten an und erlaubt Interaktion (ToDo Add/Delete/Toggle, Pomodoro Start/Stop).
-   **Nginx Gateway:** Implementiert als zentraler Einstiegspunkt (Port 80), leitet API- und Frontend-Anfragen weiter.
-   **CORS:** Probleme durch Gateway gelöst, Konfigurationen in Backends entfernt.
-   **Troubleshooting:** Diverse Start- und Konfigurationsprobleme mit Docker Compose, Nginx Volumes und Service-Timing behoben.
-   Frontend mit Countdown-Timer für Pomodoro erweitert.

## 3. Next Steps

1.  ~~**Create Dockerfile for `service-java-todo`~~ **(Done)**
2.  ~~**Create Dockerfile for `service-dotnet-statistik`~~ **(Done)**
3.  ~~**Create Dockerfile for `service-python-pomodoro`~~ **(Done)**
4.  ~~**Create Dockerfile for `service-go-healthcheck`~~ **(Done)**
5.  ~~**Create Dockerfile for `frontend-angular`~~ **(Done)**
6.  ~~**Verify Docker Compose Build:**~~ **(Done)**
7.  ~~**Verify Docker Compose Up:**~~ **(Done)**
8.  ~~**Verify Telemetry:**~~ **(Done)**
9.  ~~**Update Memory Bank & Commit:**~~ **(Done)**
10. ~~**Implement Basic Logic (ToDo):**~~ **(Done)**
11. ~~**Implement Basic Logic (Pomodoro):**~~ **(Done)**
12. ~~**Implement Basic Logic (Statistik):**~~ **(Done)**
13. ~~**Implement Basic Logic (Healthcheck):**~~ **(Done)**
14. ~~**Implement Basic Logic (Frontend):**~~ **(Done - Anzeige, Add/Delete/Toggle, Pomodoro)**
15. ~~**Update Memory Bank & Commit (Pomodoro):**~~ **(Done)**
16. ~~**Update Memory Bank & Commit (Statistik):**~~ **(Done)**
17. ~~**Update Memory Bank & Commit (Healthcheck):**~~ **(Done)**
18. ~~**Update Memory Bank & Commit (Gateway & Frontend):**~~ **(Done)**
19. ~~**Define & Implement Next Feature/Refinement:** (z.B. Grafana Dashboards, ToDo Edit, UI Routing, Kubernetes Prep...)~~ **(Done - Grafana Dashboards erstellt, cAdvisor hinzugefügt)**
20. ~~**Dokumentieren & Committen:** Aktuellen Stand (Dashboards, cAdvisor, bekannte Probleme) dokumentieren und committen.~~ **(Done)**
21. ~~**Fehlerbehebung / Nächster Schritt:** Fehler in Grafana Dashboards beheben oder nächstes Feature auswählen.~~ **(Nächstes Feature ausgewählt: ToDo Edit + Refactoring)**
22. ~~**Implementieren & Testen:** ToDo Edit-Funktion im Frontend implementieren und API-Service refaktorieren.~~ **(Done)**
23. ~~**Dokumentieren & Committen:** Aktuellen Stand (ToDo Edit, Refactoring) dokumentieren und committen.~~ **(Done)**
24. ~~**Nächster Schritt auswählen:** (z.B. Frontend Routing, Frontend OTel, Backend Logic, Kubernetes Prep, Dashboard Fix...)~~ **(Frontend Routing ausgewählt)**
25. ~~**Implementieren & Testen:** Angular Routing im Frontend implementieren.~~ **(Done)**
26. ~~**Dokumentieren & Committen:** Aktuellen Stand (Frontend Routing, Style Fixes) dokumentieren und committen.~~ **(Done)**
27. ~~**Nächster Schritt auswählen:** (z.B. Frontend OTel, Backend Logic, Kubernetes Prep, Dashboard Fix...)~~ **(Frontend OTel ausgewählt)**
28. **Implementieren & Testen:** OpenTelemetry im Frontend hinzufügen. **<- YOU ARE HERE**
29. **Dokumentieren & Committen:** Aktuellen Stand (Frontend OTel) dokumentieren und committen.
30. **Nächster Schritt auswählen:** ...

## 4. Open Questions / Decisions

-   Genaues Datenformat für die Statistik-Aggregation definieren (aktuell nur ToDo-Anzahl).
-   Priorisierung der nächsten Schritte (siehe Abschnitt 5 in `progress.md`).

## 5. Blockers

-   Grafana Dashboards zeigen "No Data".

## Current Work Focus

- Implementierung der OpenTelemetry-Instrumentierung für den `frontend-angular` Service.

## Recent Changes

- **Frontend-OTel:** OpenTelemetry-Abhängigkeiten hinzugefügt (`@opentelemetry/api`, `@opentelemetry/sdk-trace-web`, `@opentelemetry/exporter-trace-otlp-http`, etc.).
- **Frontend-OTel:** Konfiguration (`tracing.ts`) erstellt und in `main.ts` initialisiert.
- **Frontend-OTel:** Notwendige Instrumentierungen (DocumentLoad, Fetch, XHR) hinzugefügt.
- **OTel-Collector:** CORS-Einstellungen in `otel-collector-config.yaml` angepasst, um Anfragen vom Frontend (`localhost`) zu erlauben.
- **Frontend-OTel:** Fehlerbehebung im Build-Prozess durch Korrektur der OTel-Paketversionen und Synchronisation der `package-lock.json`.

## Next Steps

- **Dokumentation:** `frontend-angular/README.md`, `activeContext.md`, `progress.md` aktualisieren.
- **Git:** Aktuelle Änderungen committen und pushen.
- **Überprüfung:** Funktion der Anwendung und Sichtbarkeit der Frontend-Traces in Tempo bestätigt.

## Letzte Änderungen

- **GitHub Actions Workflow:** Erstellt einen Workflow (`.github/workflows/deploy.yaml`), der bei Push auf `main` oder `dev` ausgelöst wird. Der Workflow baut die Docker Images für Frontend und Backend-Services, pusht sie zur GitHub Container Registry (ghcr.io) und deployt die Anwendung mittels Helm auf eine konfigurierte OpenShift-Instanz.
- **Workflow Fix:** Korrektur einer doppelten `tags`-Definition im Frontend-Build-Schritt.
- **Kubernetes-Deployment:** Erfolgreiche Bereitstellung aller Services und der Observability-Komponenten (Collector, Prometheus, Tempo, Loki, Grafana, Nginx-Gateway) mithilfe von Helm-Charts in einem lokalen Kubernetes-Cluster.
- **Bugfixes (Kubernetes):**
    - Korrektur des Nginx-Routings für die Todo-API (Problem mit abschließendem Slash).
    - Korrektur der Service-Erreichbarkeit (.NET Statistik konnte Java Todo nicht finden) durch Hinzufügen eines K8s-Service-Alias.
    - Korrekte Konfiguration von CORS im Nginx-Gateway für API- und OTel-Collector-Endpunkte.
- **Frontend OTel:** OpenTelemetry-Tracing wurde erfolgreich in das Angular-Frontend integriert.
- **Python OTel:** Umstellung auf Agent-basierten Ansatz zur Lösung von Modul-Problemen.

## Nächste Schritte (Priorisiert)

1.  **GitHub Actions:** Testen/Überwachen des ersten Workflow-Laufs.
2.  **Grafana Dashboards:** Erstellen/Anpassen von Basis-Dashboards für die Überwachung der Services in Kubernetes (Metriken, Traces, Logs).
3.  **Kubernetes Ressourcen:** Definieren und Implementieren von Ressourcen-Requests und -Limits in den Helm-Charts für alle Deployments.
4.  **Dokumentation:** Aktualisieren der README-Dateien für die Services und das Kubernetes-Deployment (Memory Bank ist aktuell).
5.  **Kubernetes Health Checks:** Implementieren von Liveness- und Readiness-Probes in den Helm-Charts.

## Offene Fragen / Entscheidungen

- Welche K8s-Distribution wird primär für Tests/Demos verwendet (minikube, k3d, Docker Desktop K8s)? (Beeinflusst leicht Ingress/Gateway-Exposition).
- Umfang der Grafana-Dashboards für den MVP.

## Bekannte Probleme / Herausforderungen

- Siehe `progress.md` (Grafana "No Data", Python Cold Start, Go Logging).

## Nächste Schritte

- Frontend-Integration mit der Trace-API testen und validieren
- API-Gateway-Konfiguration als Helm-Chart weiter verbessern
- Ressourcen-Limits für alle Services festlegen
- Grafana-Dashboards für Monitoring erstellen

## Erkenntnisse

- Spring Boot REST Controller erwarten in der Standardkonfiguration Pfade ohne abschließenden Slash
- Nginx-Proxy-Pass-Konfiguration muss an die erwartete Pfadstruktur der Backend-Services angepasst werden
- Vollständige CORS-Konfiguration ist entscheidend für die korrekte Funktion von Frontend-Backend-Kommunikation

## Current Focus

We are currently focused on making the Kubernetes deployment of the SRE Todo application compatible with OpenShift. The specific challenges we're addressing are:

1. Ensuring containers run as non-root users with proper security contexts
2. Changing container ports from 80 to 8080 where needed (primarily for frontend and NGINX)
3. Updating the Helm chart structure to better organize services and configurations
4. Ensuring consistent naming and templating across all resources

## Recent Changes

1. Updated `frontend-deployment.yaml`:
   - Changed containerPort from 80 to 8080
   - Added security context to run as non-root user (runAsUser: 101)
   - Updated service to map port 80 to targetPort 8080

2. Updated `nginx-gateway.yaml`:
   - Changed nginx to listen on port 8080 instead of 80
   - Added conditional locations based on service enablement flags
   - Added security context to run as non-root user (runAsUser: 101)
   - Updated service to map port 80 to targetPort 8080

3. Updated `postgres-deployment.yaml`:
   - Added proper security context for PostgreSQL (runAsUser: 26)
   - Updated to use the new values structure
   - Added resource limits and requests

4. Updated `values.yaml`:
   - Restructured the values file to use more consistent naming
   - Added resource limits and requests for all components
   - Updated image references to use the correct repositories and tags

5. Updated `Chart.yaml` and documentation:
   - Updated the chart metadata and description
   - Added keywords for better discoverability
   - Updated README.md with deployment instructions for OpenShift

## Next Steps

1. Test the Helm chart deployment on a Kubernetes/OpenShift environment
2. Enable and configure the backend services (Java Todo, .NET Statistik, Python Pomodoro)
3. Configure the observability stack components (OpenTelemetry Collector, Prometheus, Tempo, Loki, Grafana)
4. Set up the appropriate network policies and security contexts for all components
5. Document the OpenShift-specific considerations and deployment steps

## Active Decisions and Considerations

1. We've decided to run containers as non-root users with specific UIDs to comply with OpenShift security policies
2. We're using port 8080 for web services instead of port 80 to avoid requiring root privileges
3. We're making service lookups dynamic using conditional templating in the NGINX configuration
4. We're using consistent naming conventions across all components for better maintainability 