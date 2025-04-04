# AI-PROMPT für das vereinfachte Observability MVP

Dieses Dokument dient als Anleitung für ein AI-Tool (z. B. Claude 3.7), um die Weiterentwicklung und Wartung des vereinfachten MVP voranzutreiben.

## Kontext und Projektübersicht

- **Projekt:** Observability MVP Demo App – Vereinfachtes MVP
- **Ziel:** Aufbau einer funktionsfähigen Microservice-Architektur ohne Authentifizierung.  
- **Kernkomponenten:**  
  - **Frontend (Angular):** Anzeige von Statistiken (z. B. erledigte ToDos).
  - **Statistik-Service (.NET):** Aggregiert Daten vom ToDo-Service.
  - **ToDo-Service (Java Spring Boot):** CRUD-Funktionalität für ToDo-Items.
  - **Pomodoro-Service (Python):** Verwaltung von Pomodoro-Blöcken.
  - **Health-Check-Service (Golang):** Überwacht die Erreichbarkeit der Services.
  - **Observability:** Alle Services sind mit OpenTelemetry instrumentiert und senden Daten an einen zentralen Collector, der die Daten an Prometheus, Grafana Tempo und Loki weiterleitet.

## Aufgaben an das AI-Tool

1. **Code-Weiterentwicklung:**  
   - Erstellen von Beispiel-Implementierungen und Code-Snippets für jeden Microservice.
   - Ergänzung von REST-API-Beispielen und Integration der OpenTelemetry-SDKs.

2. **Dokumentationsanpassungen:**  
   - Erweiterung und Pflege der README.md, um aktuelle Änderungen und zusätzliche Anweisungen (z. B. zu Docker Compose) zu berücksichtigen.
   - Unterstützung beim Erstellen von Deploymentskripten (z. B. `docker-compose.yml`).

3. **Observability & Monitoring:**  
   - Bereitstellung von Konfigurationsbeispielen für die Instrumentierung der einzelnen Services.
   - Vorschläge zur Optimierung der Metrik-, Trace- und Log-Datenflüsse.

4. **Fragen und Klärungen:**  
   - Das AI-Tool soll bei Unklarheiten gezielt Rückfragen stellen, um Anforderungen präziser zu erfassen.
   - Bei Vorschlägen stets kurze Begründungen und Empfehlungen liefern.

## Hinweise für die Interaktion

- **Sprache:**  
  - Alle Antworten und Code-Beispiele sollen in Deutsch erfolgen.
- **Detaillierungsgrad:**  
  - Die Erklärungen und Anweisungen müssen so ausführlich sein, dass auch Junior DevOps die einzelnen Schritte nachvollziehen können.
- **Referenz zur Dokumentation:**  
  - Bei Code-Ergänzungen immer auf die entsprechenden Abschnitte in der README.md verweisen und diese erweitern.

## Abschließende Anweisung

Bitte arbeite auf Basis dieses AI-PROMPT und des aktuellen MVP-Plans. Sollten Unklarheiten oder neue Anforderungen auftreten, stelle präzise Rückfragen, um die Anforderungen weiter zu spezifizieren. Ziel ist es, ein robustes und lokal über Docker Compose testbares System zu schaffen, das als Grundlage für zukünftige Erweiterungen dient.
