# Service Java ToDo (Spring Boot)

## Beschreibung

Dieser Service verwaltet die ToDo-Items über eine REST API.

## Entwicklungsschritte

*(Hier werden die Implementierungsschritte dokumentiert)*

1.  Initiales Projekt-Setup mit Maven.
2.  Dockerfile erstellt.
3.  Grundlegende CRUD-Endpunkte mit In-Memory-Speicher implementiert.
4.  PostgreSQL-Datenbank zum Docker Compose Stack hinzugefügt.
5.  Abhängigkeiten für Spring Data JPA und PostgreSQL-Treiber hinzugefügt (`pom.xml`).
6.  `application.properties` für DB-Verbindung konfiguriert.
7.  `Todo`-Klasse zu JPA-Entität umgewandelt.
8.  `TodoRepository` (Spring Data JPA) erstellt.
9.  Controller zur Verwendung des Repositories und der DB statt In-Memory-Speicher angepasst.
10. Testdaten über `@PostConstruct` im Controller initialisiert.
11. OpenTelemetry Java Agent zum Dockerfile hinzugefügt und im `ENTRYPOINT` aktiviert.
12. OTel Agent via Umgebungsvariablen in `docker-compose.yml` konfiguriert (Service Name, Collector Endpoint, Exporter-Einstellungen).
13. Logback-Appender-Instrumentierung für OTLP-Logs aktiviert (`otel.instrumentation.logback-appender.enabled=true`).

#test for action
