import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { PomodoroComponent } from './pomodoro/pomodoro.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
  { path: 'todos', component: TodoComponent },
  { path: 'pomodoro', component: PomodoroComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '', redirectTo: '/todos', pathMatch: 'full' }, // Standardroute
  // { path: '**', component: PageNotFoundComponent }, // Optional: Für 404-Seiten
];
