# Active Context: Observability MVP Demo App

## 1. Current Focus

Dokumentation und Commit der Frontend-Routing-Implementierung.

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
26. **Dokumentieren & Committen:** Aktuellen Stand (Frontend Routing, Style Fixes) dokumentieren und committen. **<- YOU ARE HERE**
27. **Nächster Schritt auswählen:** (z.B. Frontend OTel, Backend Logic, Kubernetes Prep, Dashboard Fix...)

## 4. Open Questions / Decisions

-   Genaues Datenformat für die Statistik-Aggregation definieren (aktuell nur ToDo-Anzahl).
-   Priorisierung der nächsten Schritte (siehe Abschnitt 5 in `progress.md`).

## 5. Blockers

-   Grafana Dashboards zeigen "No Data". 