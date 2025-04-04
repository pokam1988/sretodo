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
