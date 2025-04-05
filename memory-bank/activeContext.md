# Active Context: Observability MVP Demo App

## Aktueller Fokus

Der Fokus liegt auf der Stabilisierung und Verbesserung des OpenShift-Deployments. Insbesondere soll das Problem mit dem Frontend behoben werden, das aktuell eine statische HTML-Seite anstelle der Angular-Anwendung anzeigt. Weitere Aspekte sind die Erstellung funktionierender Grafana-Dashboards und die Optimierung von Ressourcenlimits für die Services. Die grundlegende Bereitstellung via Helm auf OpenShift funktioniert.

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
28. ~~**Implementieren & Testen:** OpenTelemetry im Frontend hinzufügen.~~ **(Done)**
29. ~~**Dokumentieren & Committen:** Aktuellen Stand (Frontend OTel) dokumentieren und committen.~~ **(Done)**
30. ~~**Nächster Schritt auswählen:**~~ **(OpenShift-Kompatibilität ausgewählt)**
31. ~~**Helm-Charts für Kubernetes/OpenShift erstellen**~~ **(Done)**
32. ~~**OpenShift-Kompatibilität implementieren**~~ **(Done)**
33. ~~**GitHub Actions Workflow erstellen**~~ **(Done)**
34. ~~**GitHub Actions Workflow verbessern (deploy-only Option)**~~ **(Done)**
35. **Frontend-Fix für OpenShift implementieren** **<- YOU ARE HERE**
36. **Dokumentieren & Committen:** Aktuellen Stand dokumentieren und committen.

## 4. Open Questions / Decisions

-   Genaues Datenformat für die Statistik-Aggregation definieren (aktuell nur ToDo-Anzahl).
-   Priorisierung der nächsten Schritte (siehe Abschnitt 5 in `progress.md`).

## 5. Blockers

-   Grafana Dashboards zeigen "No Data".
-   Frontend in OpenShift zeigt statische HTML-Seite statt Angular-App.

## Current Work Focus

- Beheben des Frontend-Problems in OpenShift, um die korrekte Angular-Anwendung anstelle der statischen HTML-Seite anzuzeigen.
- Optimierung der GitHub Actions Workflow für die Bereitstellung auf OpenShift.

## Recent Changes

- **OpenShift Compatibility:** Anpassung der Kubernetes-Manifeste für OpenShift-Kompatibilität:
  - Änderung der Container-Ports von 80 auf 8080 für Frontend und NGINX
  - Implementierung von Security Contexts für Non-Root-Benutzer in allen Deployments
  - Anpassung des Service-Mappings für Port 80 auf targetPort 8080
  - Optimierung der Ressourcenlimits und -requests für alle Komponenten

- **GitHub Actions Workflow:** Verbesserung des Workflows für CI/CD:
  - Hinzufügen einer "deploy-only"-Option, um Deployments ohne Neubau der Images durchzuführen
  - Implementierung konditionaler Builds basierend auf Dateiänderungen
  - Konfiguration für OpenShift-Login und Helm-Deployment
  - Implementierung einer Destroy-Funktion zur Entfernung des Helm-Releases

- **Frontend-Issue:** Identifizierung des Problems, dass das Frontend in OpenShift eine statische HTML-Seite anzeigt, die durch eine ConfigMap bereitgestellt wird, anstatt die Angular-Anwendung aus dem Container-Image zu laden.

## Next Steps

1. **Frontend-Fix:**
   - Entfernen der ConfigMap-Montage aus dem frontend-deployment.yaml
   - Bereitstellen der Anwendung mit dem "deploy-only"-Workflow, um das Angular-Frontend-Image zu verwenden

2. **Grafana-Dashboards:**
   - Anpassen oder Erstellen von Dashboards für Services, Protokolle und Ressourcen in OpenShift

3. **Ressourcenoptimierung:**
   - Feinabstimmung der Ressourcenlimits und -requests für alle Komponenten

4. **Dokumentation:**
   - Aktualisieren aller README-Dateien und der Memory Bank mit den neuesten Änderungen

## Letzte Änderungen

- **GitHub Actions Workflow:** Der Workflow wurde erweitert, um eine "deploy-only"-Option zu unterstützen, die es ermöglicht, bestehende Images ohne Neubau zu deployen. Diese Option ist besonders nützlich für Konfigurationsänderungen oder wenn nur das Deployment aktualisiert werden soll, ohne neue Images zu erstellen.

- **OpenShift-Kompatibilität:** Alle Komponenten des Helm-Charts wurden für die OpenShift-Kompatibilität angepasst, indem Security Contexts hinzugefügt, Container-Ports geändert und Service-Mappings aktualisiert wurden.

- **Frontend-ConfigMap:** Eine statische HTML-Seite wurde in einer ConfigMap definiert (kubernetes/templates/frontend-configmap.yaml), die derzeit vom Frontend-Deployment verwendet wird, anstatt die Angular-Anwendung aus dem Container-Image zu laden. Diese muss entfernt werden, um die korrekte Anwendung anzuzeigen.

## Nächste Schritte (Priorisiert)

1. **Frontend-Fix:**
   - Entfernen der ConfigMap-Mount aus dem frontend-deployment.yaml
   - Bereitstellen mit dem "deploy-only"-Workflow, um die Angular-Anwendung anzuzeigen

2. **Grafana-Dashboards:**
   - Erstellen/Anpassen von Basis-Dashboards für die Überwachung der Services in OpenShift

3. **Ressourcen-Optimierung:**
   - Feinabstimmung der Ressourcenlimits/-requests für bessere Performance

4. **Dokumentation:**
   - Aktualisieren aller READMEs und der Memory Bank

## Offene Fragen / Entscheidungen

- Optimale Werte für Ressourcenlimits und -requests in OpenShift
- Benötigte Grafana-Dashboards für die Überwachung der SRE Todo App in OpenShift

## Bekannte Probleme / Herausforderungen

- Frontend in OpenShift zeigt statische HTML-Seite statt Angular-App (Verursacht durch ConfigMap-Mount)
- Grafana Dashboards zeigen "No Data" aufgrund von Metrik-Namen/Label-Inkompatibilitäten
- Gelegentliche Verzögerungen bei der ersten Anfrage an den Python Pomodoro Service (Cold Start)

## Erkenntnisse

- In OpenShift müssen Container als Non-Root-Benutzer ausgeführt werden
- Web-Services sollten Port 8080 statt Port 80 verwenden, um keine Root-Rechte zu benötigen
- GitHub Actions Workflows können effizienter gestaltet werden, indem bedingte Builds und eine "deploy-only"-Option implementiert werden

## Current Focus

We are currently focused on fixing the frontend deployment in OpenShift, which is showing a static HTML page instead of the Angular application. The specific tasks we need to address are:

1. Removing the static HTML ConfigMap mount from the frontend deployment
2. Using the Angular frontend image directly without content override
3. Deploying with the "deploy-only" option in GitHub Actions to use existing images

Additionally, we're maintaining and improving the OpenShift deployment with:
1. Resource limit/request optimization for better performance 
2. Creating appropriate Grafana dashboards for monitoring
3. Documenting the deployment process and configurations

## Recent Changes

1. Enhanced GitHub Actions workflow:
   - Added "deploy-only" option to deploy existing images without rebuilding
   - Implemented conditional builds based on file changes
   - Added proper OpenShift login and Helm deployment steps
   - Added release name and image tag parameters for flexible deployments

2. Made Kubernetes deployments OpenShift compatible:
   - Updated security contexts to use non-root users (runAsUser: 1006530000)
   - Changed web services from port 80 to port 8080
   - Updated service mappings to connect port 80 to targetPort 8080
   - Added proper fsGroup settings for OpenShift compatibility

3. Identified issues with the frontend deployment:
   - Found static HTML ConfigMap that overrides the Angular application
   - Determined the frontend-configmap.yaml as the source of the static content
   - Created plan to remove the ConfigMap mount and use the Angular image

## Next Steps

1. Fix the frontend deployment:
   - Remove the ConfigMap volume mount from frontend-deployment.yaml
   - Deploy using the "deploy-only" GitHub Actions workflow
   - Verify the Angular application loads correctly in OpenShift

2. Enhance monitoring and observability:
   - Create or adjust Grafana dashboards for all components
   - Ensure metrics, traces, and logs are properly collected and displayed
   - Fine-tune OpenTelemetry collector configuration if needed

3. Optimize resource usage:
   - Adjust resource limits and requests based on actual usage
   - Monitor performance and adjust as needed
   - Document recommended settings for production deployments

## Active Decisions and Considerations

1. We've decided to use a "deploy-only" workflow to allow for quicker deployments when only configuration changes are needed
2. We're standardizing on non-root user IDs for OpenShift compatibility (1006530000 for most services)
3. We're keeping frontend and backend services separate with communication through the NGINX gateway
4. We're maintaining the full observability stack (OTel Collector, Prometheus, Tempo, Loki, Grafana) in the deployment 