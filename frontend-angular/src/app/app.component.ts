import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

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
export class AppComponent implements OnInit, OnDestroy {
  title = 'SRE ToDo MVP';

  private apiService = inject(ApiService);

  todos: Todo[] = [];
  statistics: Statistics | null = null;
  pomodoroState: PomodoroState | null = null;
  pomodoroUserId = 'defaultUser'; // Fester Benutzer für Pomodoro MVP
  error: string | null = null;
  newTodoTitle: string = '';
  pomodoroRemainingTime: string = ''; // Für Countdown-Anzeige
  private countdownInterval: any = null; // Zum Speichern der Interval ID

  // --- Edit State ---
  editingTodoId: number | null = null; // ID des aktuell bearbeiteten ToDos
  editTodoTitle: string = ''; // Temporärer Titel während der Bearbeitung

  currentView: 'todos' | 'statistics' | 'pomodoro' = 'todos'; // Startansicht

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
    this.apiService.getTodos().subscribe({
      next: (data) => {
        this.todos = data.sort((a, b) => a.id - b.id);
        console.log('Todos loaded via ApiService:', data);
      },
      error: (err) => {
        console.error('Error loading todos via ApiService:', err);
        this.error = 'Could not load ToDos. Check API or service status.';
      },
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;
    this.error = null;

    this.apiService.addTodo(this.newTodoTitle).subscribe({
      next: (addedTodo) => {
        console.log('ToDo added via ApiService:', addedTodo);
        this.todos.push(addedTodo);
        this.todos.sort((a, b) => a.id - b.id);
        this.newTodoTitle = '';
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Error adding todo via ApiService:', err);
        this.error = 'Could not add ToDo. Check API or service status.';
      },
    });
  }

  loadStatistics(): void {
    this.apiService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        console.log('Statistics loaded via ApiService:', data);
        if (data.error && !this.error) {
          console.error('Statistics API reported an error:', data.error);
          this.error = `Statistics Error: ${data.error}`;
        }
      },
      error: (err) => {
        console.error('Error loading statistics via ApiService:', err);
        if (!this.error) {
          this.error =
            'Could not load Statistics. Check API or service status.';
        }
      },
    });
  }

  loadPomodoroStatus(): void {
    this.apiService.getPomodoroStatus(this.pomodoroUserId).subscribe({
      next: (data) => {
        this.pomodoroState = data;
        console.log('Pomodoro status loaded via ApiService:', data);
        if (data.is_running && data.end_time) {
          this.startCountdown(data.end_time);
        } else {
          this.clearCountdown();
        }
      },
      error: (err) => {
        if (err.status !== 404) {
          console.error('Error loading pomodoro status via ApiService:', err);
          if (!this.error) {
            this.error =
              'Could not load Pomodoro status. Check API or service status.';
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
    this.apiService
      .startPomodoro(this.pomodoroUserId, minutes, type)
      .subscribe({
        next: (data) => {
          this.pomodoroState = data;
          console.log('Pomodoro timer started via ApiService:', data);
          if (data.is_running && data.end_time) {
            this.startCountdown(data.end_time);
          }
        },
        error: (err) => {
          console.error('Error starting pomodoro timer via ApiService:', err);
          this.error = 'Could not start Pomodoro timer.';
        },
      });
  }

  stopPomodoro(): void {
    if (!this.pomodoroState || !this.pomodoroState.is_running) return;
    this.error = null;
    this.apiService.stopPomodoro(this.pomodoroUserId).subscribe({
      next: (data) => {
        this.pomodoroState = data;
        console.log('Pomodoro timer stopped via ApiService:', data);
        this.clearCountdown();
      },
      error: (err) => {
        console.error('Error stopping pomodoro timer via ApiService:', err);
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
    const originalStatus = todo.completed;
    const updatedTodo = { ...todo, completed: !todo.completed };

    this.apiService.updateTodo(updatedTodo).subscribe({
      next: (result) => {
        console.log('Todo completion toggled via ApiService:', result);
        // Update im Array nur, wenn Backend erfolgreich war
        const index = this.todos.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = result;
          this.todos.sort((a, b) => a.id - b.id); // Ggf. neu sortieren
        }
      },
      error: (err) => {
        console.error('Error toggling todo completion via ApiService:', err);
        this.error = 'Could not update ToDo status.';
        // Rollback UI change on error
        todo.completed = originalStatus;
      },
    });
  }

  deleteTodo(id: number): void {
    if (!confirm('Are you sure you want to delete this ToDo?')) {
      return;
    }
    this.error = null;
    this.apiService.deleteTodo(id).subscribe({
      next: () => {
        console.log(`Todo ${id} deleted via ApiService`);
        this.todos = this.todos.filter((t) => t.id !== id);
        this.loadStatistics(); // Statistik aktualisieren
      },
      error: (err) => {
        console.error(`Error deleting todo ${id} via ApiService:`, err);
        this.error = 'Could not delete ToDo.';
      },
    });
  }

  startEdit(todo: Todo): void {
    this.editingTodoId = todo.id;
    this.editTodoTitle = todo.title; // Aktuellen Titel ins Editierfeld kopieren
  }

  cancelEdit(): void {
    this.editingTodoId = null;
    this.editTodoTitle = '';
  }

  saveEdit(originalTodo: Todo): void {
    if (
      !this.editTodoTitle.trim() ||
      this.editTodoTitle === originalTodo.title
    ) {
      // Wenn Titel leer oder unverändert, einfach abbrechen
      this.cancelEdit();
      return;
    }
    this.error = null;
    const updatedTodoData = {
      ...originalTodo,
      title: this.editTodoTitle.trim(),
    };

    this.apiService.updateTodo(updatedTodoData).subscribe({
      next: (savedTodo) => {
        console.log('Todo updated via ApiService:', savedTodo);
        const index = this.todos.findIndex((t) => t.id === originalTodo.id);
        if (index !== -1) {
          this.todos[index] = savedTodo;
          this.todos.sort((a, b) => a.id - b.id);
        }
        this.cancelEdit(); // Bearbeitungsmodus beenden
      },
      error: (err) => {
        console.error('Error updating todo via ApiService:', err);
        this.error = 'Could not update ToDo.';
        // Kein explizites Rollback nötig, da Eingabefeld noch den Fehler zeigt
      },
    });
  }
}
