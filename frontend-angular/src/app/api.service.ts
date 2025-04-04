import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces (ggf. in eigene Datei auslagern)
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface Statistics {
  totalTodos: number;
  error: string | null;
}

interface PomodoroState {
  user_id: string;
  start_time: string | null; // ISO String
  duration_minutes: number;
  end_time: string | null; // ISO String
  is_running: boolean;
  timer_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private todoApiUrl = '/api/todos/';
  private statsApiUrl = '/api/statistics';
  private pomodoroApiUrl = '/api/pomodoro/timers';

  constructor() {}

  // --- ToDo Endpoints ---

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoApiUrl);
  }

  addTodo(title: string): Observable<Todo> {
    const newTodoPayload = { title: title, completed: false };
    return this.http.post<Todo>(this.todoApiUrl, newTodoPayload);
  }

  // Diese Methode deckt sowohl Titel/Status-Änderungen als auch nur Status-Änderungen ab
  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.todoApiUrl}${todo.id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.todoApiUrl}${id}`);
  }

  // --- Statistics Endpoints ---

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(this.statsApiUrl);
  }

  // --- Pomodoro Endpoints ---

  getPomodoroStatus(userId: string): Observable<PomodoroState> {
    return this.http.get<PomodoroState>(`${this.pomodoroApiUrl}/${userId}`);
  }

  startPomodoro(
    userId: string,
    minutes: number,
    type: string
  ): Observable<PomodoroState> {
    return this.http.post<PomodoroState>(
      `${this.pomodoroApiUrl}/${userId}/start`,
      { duration_minutes: minutes, timer_type: type }
    );
  }

  stopPomodoro(userId: string): Observable<PomodoroState> {
    return this.http.post<PomodoroState>(
      `${this.pomodoroApiUrl}/${userId}/stop`,
      {}
    );
  }
}
