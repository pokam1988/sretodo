# Angular Frontend für SRE ToDo MVP

## Beschreibung

Dieses Frontend wurde mit Angular CLI erstellt und zeigt Daten aus den verschiedenen Backend-Microservices an.
Es ermöglicht Benutzern das Anzeigen, Erstellen und Verwalten von ToDos sowie die Steuerung eines Pomodoro-Timers.
Der Zugriff erfolgt über das Nginx Gateway (`http://localhost/`).

## API Endpunkte (Aufrufe durch das Frontend)

Das Frontend kommuniziert mit den Backend-Services über das Nginx Gateway unter folgenden Pfaden:

-   `GET /api/todos/`: Holt die Liste aller ToDos.
-   `POST /api/todos/`: Erstellt ein neues ToDo.
-   `PUT /api/todos/{id}`: Aktualisiert den Status eines ToDos.
-   `DELETE /api/todos/{id}`: Löscht ein ToDo.
-   `GET /api/statistics`: Holt die Statistik-Daten (akt. nur ToDo-Anzahl).
-   `GET /api/pomodoro/timers/{user_id}`: Holt den Status des Pomodoro-Timers.
-   `POST /api/pomodoro/timers/{user_id}/start`: Startet einen Pomodoro-Timer.
-   `POST /api/pomodoro/timers/{user_id}/stop`: Stoppt einen Pomodoro-Timer.

## UI Features

-   **Navigation:** Tabs/Links zum Wechseln zwischen ToDo-, Statistik- und Pomodoro-Ansicht.
-   **ToDo-Liste:** Anzeige der ToDos mit Checkbox für Status.
-   **ToDo Erstellen:** Formular zum Hinzufügen neuer ToDos.
-   **ToDo Löschen:** Button zum Löschen von ToDos (mit Bestätigung).
-   **ToDo Status:** Checkbox zum Umschalten des Erledigt-Status.
-   **Pomodoro:** Anzeige des Timer-Status, Buttons zum Starten (Work/Break) und Stoppen, Countdown-Anzeige.
-   **Statistik:** Anzeige der Gesamtanzahl der ToDos.

## Entwicklungsschritte

1.  Initiales Projekt-Setup mit `ng new`.
2.  Dockerfile erstellt (Multi-Stage mit Nginx).
3.  `HttpClientModule` konfiguriert.
4.  Basis-UI in `AppComponent` implementiert (API-Aufrufe für ToDos & Statistik).
5.  UI überarbeitet: Header, Footer, Styling, *ngIf-basierte Navigation.
6.  ToDo Erstellen, Löschen, Status-Toggle implementiert.
7.  Pomodoro-Ansicht und -Logik (inkl. Countdown) hinzugefügt.
8.  API-Aufrufe auf Nginx-Gateway-Pfade umgestellt (`/api/...`).

# Frontend Angular Service

Dieses Verzeichnis enthält die Angular-Frontend-Anwendung für die SRE ToDo Demo.

## Funktionalität

-   Zeigt eine Liste von ToDos an, die vom `service-java-todo` über das Nginx Gateway abgerufen werden.
-   Zeigt Statistiken (aktuell nur die Anzahl der ToDos) vom `service-dotnet-statistik` an.
-   Ermöglicht das Hinzufügen neuer ToDos.
-   Ermöglicht das Umschalten des Erledigt-Status von ToDos.
-   Ermöglicht das Löschen von ToDos.
-   Implementiert eine Pomodoro-Timer-Ansicht mit Start/Stop-Funktionalität und Countdown-Anzeige, gesteuert über `service-python-pomodoro`.
-   **Neu:** Ermöglicht das Bearbeiten des Textes bestehender ToDos.

## Implementierungsdetails

-   Verwendet Angular.
-   Kommuniziert mit den Backend-Services über HTTP-Anfragen an das Nginx Gateway (`/api/...`).
-   **Refactoring:** Die Logik zur Kommunikation mit den Backend-APIs wurde aus der `AppComponent` in einen dedizierten `ApiService` (`api.service.ts`) ausgelagert, um die Komponentenlogik sauberer zu halten.
-   OpenTelemetry ist **noch nicht** im Frontend integriert.

## Technische Details

-   Angular CLI Version (siehe `package.json`).
-   Verwendet Standalone Components.
-   Nutzt den `HttpClient` (ausgelagert in `ApiService`) für die Kommunikation mit den Backend-Services über das Nginx-Gateway (`/api/...`).
-   Grundlegendes Styling für eine einfache Benutzeroberfläche.
-   **Neu:** Die Logik für API-Aufrufe wurde in den `ApiService` (`src/app/api.service.ts`) refaktoriert.

## Starten (als Teil des Docker Compose Stacks)

Das Frontend wird als Teil des gesamten Stacks mit `docker-compose up` gebaut und gestartet. Es ist über das Nginx-Gateway auf `http://localhost/` erreichbar.

## Entwicklung

-   `cd frontend-angular`
-   `npm install` (falls noch nicht geschehen)
-   `ng serve`: Startet den Angular Development Server (typischerweise auf `http://localhost:4200`). Beachte, dass API-Aufrufe fehlschlagen können, wenn das Backend nicht läuft oder CORS nicht korrekt konfiguriert ist (im Docker-Setup wird dies durch Nginx gehandhabt).

## Nächste Schritte / TODOs

-   [ ] Korrekte Implementierung von Angular Routing anstelle von `*ngIf` für die Ansichten.
-   [ ] OpenTelemetry-Instrumentierung hinzufügen.
-   [ ] UI/UX-Verbesserungen.
-   [ ] Auslagern der Interfaces in eigene Dateien (`models.ts`).

# FrontendAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
