import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'SRE ToDo MVP';

  private http = inject(HttpClient);

  todos: Todo[] = [];
  statistics: Statistics | null = null;
  pomodoroState: PomodoroState | null = null;
  pomodoroUserId = 'defaultUser'; // Fester Benutzer für Pomodoro MVP
  error: string | null = null;
  newTodoTitle: string = '';
  pomodoroRemainingTime: string = ''; // Für Countdown-Anzeige
  private countdownInterval: any = null; // Zum Speichern der Interval ID

  currentView: 'todos' | 'statistics' | 'pomodoro' = 'todos'; // Startansicht

  private todoApiUrl = '/api/todos';
  private statsApiUrl = '/api/statistics';
  private pomodoroApiUrl = '/api/pomodoro/timers';

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    // Wichtig: Interval löschen, wenn Komponente zerstört wird
    this.clearCountdown();
  }

  loadInitialData(): void {
    this.loadTodos();
    this.loadStatistics();
    this.loadPomodoroStatus();
  }

  showTodos(): void {
    this.currentView = 'todos';
  }
  showStatistics(): void {
    this.currentView = 'statistics';
    this.loadStatistics();
  }
  showPomodoro(): void {
    this.currentView = 'pomodoro';
    this.loadPomodoroStatus();
  }

  loadTodos(): void {
    this.error = null;
    this.http.get<Todo[]>(this.todoApiUrl).subscribe({
      next: (data) => {
        this.todos = data.sort((a, b) => a.id - b.id);
        console.log('Todos loaded:', data);
      },
      error: (err) => {
        console.error('Error loading todos:', err);
        this.error = 'Could not load ToDos. Is the ToDo service running?';
      },
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;
    this.error = null;
    const newTodo = { title: this.newTodoTitle, completed: false };

    this.http.post<Todo>(this.todoApiUrl, newTodo).subscribe({
      next: (addedTodo) => {
        console.log('ToDo added:', addedTodo);
        this.loadTodos();
        this.newTodoTitle = '';
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Error adding todo:', err);
        this.error = 'Could not add ToDo. Check CORS or if service is running.';
      },
    });
  }

  loadStatistics(): void {
    this.http.get<Statistics>(this.statsApiUrl).subscribe({
      next: (data) => {
        this.statistics = data;
        console.log('Statistics loaded:', data);
        if (data.error && !this.error) {
          console.error('Statistics API reported an error:', data.error);
          this.error = `Statistics Error: ${data.error}`;
        }
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        if (!this.error) {
          this.error =
            'Could not load Statistics. Is the Statistics service running?';
        }
      },
    });
  }

  loadPomodoroStatus(): void {
    this.http
      .get<PomodoroState>(`${this.pomodoroApiUrl}/${this.pomodoroUserId}`)
      .subscribe({
        next: (data) => {
          this.pomodoroState = data;
          console.log('Pomodoro status loaded:', data);
          if (data.is_running && data.end_time) {
            this.startCountdown(data.end_time);
          } else {
            this.clearCountdown();
          }
        },
        error: (err) => {
          if (err.status !== 404) {
            console.error('Error loading pomodoro status:', err);
            if (!this.error) {
              this.error =
                'Could not load Pomodoro status. Is the service running?';
            }
          } else {
            this.pomodoroState = null;
            this.clearCountdown();
          }
        },
      });
  }

  startPomodoro(minutes: number = 25, type: string = 'work'): void {
    this.error = null;
    this.http
      .post<PomodoroState>(
        `${this.pomodoroApiUrl}/${this.pomodoroUserId}/start`,
        { duration_minutes: minutes, timer_type: type }
      )
      .subscribe({
        next: (data) => {
          this.pomodoroState = data;
          console.log('Pomodoro timer started:', data);
          if (data.is_running && data.end_time) {
            this.startCountdown(data.end_time);
          }
        },
        error: (err) => {
          console.error('Error starting pomodoro timer:', err);
          this.error = 'Could not start Pomodoro timer.';
        },
      });
  }

  stopPomodoro(): void {
    if (!this.pomodoroState || !this.pomodoroState.is_running) return;
    this.error = null;
    this.http
      .post<PomodoroState>(
        `${this.pomodoroApiUrl}/${this.pomodoroUserId}/stop`,
        {}
      )
      .subscribe({
        next: (data) => {
          this.pomodoroState = data;
          console.log('Pomodoro timer stopped:', data);
          this.clearCountdown();
        },
        error: (err) => {
          console.error('Error stopping pomodoro timer:', err);
          this.error = 'Could not stop Pomodoro timer.';
        },
      });
  }

  startCountdown(endTimeISO: string): void {
    this.clearCountdown(); // Sicherstellen, dass kein alter Timer läuft
    const endTime = new Date(endTimeISO).getTime();

    this.updateRemainingTime(endTime); // Sofortige Aktualisierung

    this.countdownInterval = setInterval(() => {
      this.updateRemainingTime(endTime);
    }, 1000);
  }

  updateRemainingTime(endTime: number): void {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance <= 0) {
      this.pomodoroRemainingTime = '00:00';
      this.clearCountdown();
      // Optional: Status automatisch aktualisieren, wenn Timer abgelaufen ist
      if (this.pomodoroState && this.pomodoroState.is_running) {
        this.pomodoroState.is_running = false;
        // Hier könnte man auch einen Sound abspielen oder eine Notification zeigen
        console.log('Pomodoro timer finished!');
      }
    } else {
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.pomodoroRemainingTime =
        (minutes < 10 ? '0' : '') +
        minutes +
        ':' +
        (seconds < 10 ? '0' : '') +
        seconds;
    }
  }

  clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
      this.pomodoroRemainingTime = '';
    }
  }

  getYear(): number {
    return new Date().getFullYear();
  }

  // --- ToDo Update & Delete Logic ---
  toggleTodoCompletion(todo: Todo): void {
    this.error = null;
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.http
      .put<Todo>(`${this.todoApiUrl}/${todo.id}`, updatedTodo)
      .subscribe({
        next: (returnedTodo) => {
          console.log('ToDo updated:', returnedTodo);
          // Finde den Index und aktualisiere das Objekt im Array
          const index = this.todos.findIndex((t) => t.id === todo.id);
          if (index !== -1) {
            this.todos[index] = returnedTodo;
          }
          // Statistik muss nicht neu geladen werden, da sich die Anzahl nicht ändert
        },
        error: (err) => {
          console.error('Error updating todo:', err);
          this.error = 'Could not update ToDo status.';
          // Mache die Änderung rückgängig im Frontend bei Fehler
          const index = this.todos.findIndex((t) => t.id === todo.id);
          if (index !== -1) {
            this.todos[index].completed = todo.completed; // Alten Status wiederherstellen
          }
        },
      });
  }

  deleteTodo(id: number): void {
    if (!confirm('Are you sure you want to delete this ToDo?')) {
      return;
    }
    this.error = null;
    this.http.delete<void>(`${this.todoApiUrl}/${id}`).subscribe({
      next: () => {
        console.log('ToDo deleted:', id);
        this.todos = this.todos.filter((t) => t.id !== id);
        this.loadStatistics(); // Statistik aktualisieren
      },
      error: (err) => {
        console.error('Error deleting todo:', err);
        this.error = 'Could not delete ToDo.';
      },
    });
  }
}
