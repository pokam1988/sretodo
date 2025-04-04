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