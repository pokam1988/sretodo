# Active Context: Observability MVP Demo App

## Aktueller Fokus

Der Hauptfokus liegt nun darauf, die gesamte Anwendung für das Deployment auf Kubernetes vorzubereiten. Das `docker-compose.yml` Setup funktioniert stabil, und alle Services (außer Go-Logging) senden Telemetriedaten.

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

- **Service Python Pomodoro:** Umstellung von manueller OTel SDK-Initialisierung auf den Agent-basierten Ansatz (`opentelemetry-instrument`). Dies löste hartnäckige `ModuleNotFoundError`-Probleme.
    - `requirements.txt` verwendet jetzt `opentelemetry-distro`.
    - `Dockerfile` führt `opentelemetry-bootstrap -a install` aus und startet die App mit `opentelemetry-instrument`.
    - Manueller OTel-Code wurde aus `app.py` entfernt.
    - `docker-compose.yml` um spezifische `OTEL_*_EXPORTER`-Variablen ergänzt.
- **Diverse Services:** Korrekturen und Vervollständigung der OTel-Instrumentierung (Java, DotNet, Go (nur Traces)).
- **Docker Compose:** Prometheus Image-Tag korrigiert.

## Nächste Schritte Konkret

1.  **Kubernetes-Manifeste:** Beginnen mit der Erstellung von grundlegenden Manifesten (Deployment, Service) für einen der Anwendungsdienste (z.B. `service-java-todo`) und den OTel-Collector.
2.  **Konfiguration (ConfigMap):** Erstellen einer ConfigMap für den OTel-Collector in Kubernetes.
3.  **Lokales K8s-Deployment:** Testen des Deployments dieser ersten Komponenten in einer lokalen K8s-Umgebung.

## Offene Fragen / Entscheidungen

- Soll das Go-Logging vor dem K8s-Deployment noch einmal versucht werden oder verschieben wir das?
- Welche K8s-Distribution wird primär verwendet (minikube, k3d, Docker Desktop K8s)? (Beeinflusst Ingress etc.) 