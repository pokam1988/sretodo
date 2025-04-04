# Service .NET Statistik (ASP.NET Core)

## Beschreibung

Dieser Service aggregiert Daten von anderen Services (z.B. Anzahl erledigter ToDos) und stellt sie über eine REST API bereit.
Er ist mit ASP.NET Core 8 Minimal APIs implementiert.

## API Endpunkte

-   **`GET /health`**: Gibt den Service-Status zurück (`{"status": "UP"}`).
-   **`GET /statistics`**: Ruft die Anzahl der ToDos vom `service-java-todo` ab und gibt sie zurück.
    -   **Response Body:** `{ "totalTodos": <int>, "error": <string | null> }`
    -   Im Fehlerfall (z.B. ToDo-Service nicht erreichbar) wird `totalTodos` 0 sein und `error` eine Fehlermeldung enthalten.

## Service-Kommunikation

-   Der Service verwendet `IHttpClientFactory`, um Anfragen an andere Services zu senden.
-   Die Basis-URL für den `service-java-todo` ist auf `http://service-java-todo:8080/` konfiguriert.

## Entwicklungsschritte

*(Hier werden die Implementierungsschritte dokumentiert)*

1.  Initiales Projekt-Setup mit `dotnet new`.
2.  Dockerfile erstellt.
3.  `HttpClientFactory` konfiguriert.
4.  `/statistics`-Endpunkt implementiert, der `/todos` vom Java-Service aufruft.
5.  Einfachen `/health`-Endpunkt hinzugefügt.
6.  Explizites Lauschen auf `http://+:8080` in `Program.cs` konfiguriert. 