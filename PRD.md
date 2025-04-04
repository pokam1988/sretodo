# Product Requirements Document (PRD) – Observability MVP Demo App

Dieses Dokument beschreibt die Anforderungen und Ziele des vereinfachten MVPs. Es richtet sich an alle Stakeholder und Entwickler, um einen gemeinsamen Rahmen für die Implementierung und spätere Erweiterungen zu schaffen.

## 1. Zielsetzung

- **Hauptziel:**  
  Entwicklung eines minimal funktionsfähigen Produkts (MVP), das eine vereinfachte Microservice-Architektur mit einem Observability-Stack demonstriert.  
- **Kernfokus:**  
  Bereitstellung von Basisfunktionen der einzelnen Services (ToDo-Verwaltung, Pomodoro-Verwaltung, Health-Checks, Statistiken) und Instrumentierung dieser Services, ohne Authentifizierung (kein Keycloak, kein Login).

## 2. Funktionsanforderungen

### Frontend (Angular)
- **Funktion:**  
  - Anzeige von Statistiken (z. B. Anzahl erledigter ToDo-Items), die vom .NET-Statistik-Service bereitgestellt werden.
- **Anforderungen:**  
  - Ansprechendes UI mithilfe von Angular Material.
  - Übersichtliche Darstellung der Daten in Form von Diagrammen und Zahlen.

### Statistik-Service (.NET)
- **Funktion:**  
  - Periodisches Abrufen der Daten vom ToDo-Service (z. B. Anzahl der erledigten ToDo-Items) und Aufbereitung dieser Daten für das Frontend.
- **Anforderungen:**  
  - Implementierung eines einfachen REST-Clients, der die ToDo-Service-API abfragt.
  - Aggregation und Bereitstellung der Ergebnisse über einen eigenen Endpunkt.

### ToDo-Service (Java Spring Boot)
- **Funktion:**  
  - Verwaltung von ToDo-Items (Erstellen, Bearbeiten, Abrufen, Löschen).
- **Anforderungen:**  
  - CRUD-Endpunkte implementieren.
  - Datenhaltung (für das MVP: entweder In-Memory oder persistente Speicherung mittels PostgreSQL, je nach Aufwand).
  - Einfache Benutzeroberfläche über REST, ohne Authentifizierung.

### Pomodoro-Service (Python)
- **Funktion:**  
  - Verwaltung von Pomodoro-Blöcken, inklusive Anlegen, Bearbeiten und Ausführen (mit Pausen).
- **Anforderungen:**  
  - REST-API zur Verwaltung der Pomodoro-Blöcke.
  - Speicherung der Pomodoro-Daten (In-Memory- oder persistente Speicherung, je nach Komplexität).
  - Möglichkeit, Zeitintervalle anzupassen.

### Health-Check-Service (Golang)
- **Funktion:**  
  - Regelmäßige Überprüfung der Erreichbarkeit und Funktionsfähigkeit der anderen Services.
- **Anforderungen:**  
  - Durchführung von einfachen HTTP-Checks (z. B. Überprüfung des HTTP-Statuscodes 200).
  - Senden der Health-Check-Ergebnisse als Metriken und Logs an den OpenTelemetry Collector.

## 3. Observability & Instrumentierung

- **Ziel:**  
  Alle Microservices sollen mittels OpenTelemetry instrumentiert werden.
- **Anforderungen:**  
  - Einsatz der neuesten OpenTelemetry SDKs für .NET, Java, Python und Go.
  - Einrichtung eines zentralen OpenTelemetry Collectors, der die Daten an folgende Ziele weiterleitet:
    - **Prometheus:** Für Metriken.
    - **Grafana Tempo:** Für Traces.
    - **Loki:** Für Logs.
  - Verwendung strukturierter Logs (z. B. im JSON-Format) und einheitlicher Correlation IDs.

## 4. Nicht-funktionale Anforderungen

- **Deployment:**  
  - Das MVP muss lokal über **Docker Compose** startbar sein (`docker-compose up`).
- **Skalierbarkeit:**  
  - Architektur soll so gestaltet sein, dass sie später problemlos auf Kubernetes mittels Helm-Charts übertragbar ist.
- **Wartbarkeit:**  
  - Ausführliche Dokumentation (README.md und AI-PROMPT.md) wird bereitgestellt, sodass auch Junior DevOps die Implementierung nachvollziehen können.
- **Performance:**  
  - Jeder Service sollte in der Lage sein, grundlegende Operationen in einem vernünftigen Zeitrahmen auszuführen (z. B. Health-Checks in weniger als 1 Sekunde).
- **Sicherheit:**  
  - Für das MVP entfällt die Authentifizierung. Dies wird zu einem späteren Zeitpunkt wieder eingeführt.

## 5. Akzeptanzkriterien

- **Frontend:**  
  - Zeigt die aggregierten Statistiken vom .NET-Service korrekt an.
- **ToDo-Service:**  
  - Ermöglicht das Erstellen, Bearbeiten, Abrufen und Löschen von ToDo-Items über definierte REST-APIs.
- **Pomodoro-Service:**  
  - Ermöglicht das Anlegen, Ändern und Ausführen von Pomodoro-Blöcken.
- **Health-Check-Service:**  
  - Führt regelmäßig Health-Checks durch und sendet entsprechende Metriken und Logs an den OpenTelemetry Collector.
- **Observability:**  
  - Alle Services senden ihre Instrumentierungsdaten an den zentralen Collector, der diese an Prometheus, Grafana Tempo und Loki weiterleitet.
- **Deployment:**  
  - Das System lässt sich mit einem einfachen `docker-compose up`-Befehl lokal starten, und alle Komponenten sind erreichbar.

## 6. Priorisierung & Zeitrahmen

- **Priorität:**  
  - Erstes MVP: Implementierung der Basisfunktionen aller Services (ohne Authentifizierung) und Integration des Observability-Stacks.
- **Zeitplan:**  
  - Das MVP soll in einem kurzen Iterationszyklus (z. B. innerhalb weniger Wochen) fertiggestellt werden, um schnell Feedback zu generieren.

