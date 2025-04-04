import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { PomodoroState } from '../models';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss'],
})
export class PomodoroComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);

  pomodoroState: PomodoroState | null = null;
  pomodoroUserId = 'defaultUser'; // Fester Benutzer für Pomodoro MVP
  error: string | null = null;
  pomodoroRemainingTime: string = '';
  private countdownInterval: any = null;

  constructor() {}

  ngOnInit(): void {
    this.loadPomodoroStatus();
  }

  ngOnDestroy(): void {
    this.clearCountdown(); // Wichtig!
  }

  loadPomodoroStatus(): void {
    this.error = null;
    this.apiService.getPomodoroStatus(this.pomodoroUserId).subscribe({
      next: (data) => {
        this.pomodoroState = data;
        console.log('Pomodoro status loaded in PomodoroComponent:', data);
        if (data.is_running && data.end_time) {
          this.startCountdown(data.end_time);
        } else {
          this.clearCountdown();
        }
      },
      error: (err) => {
        if (err.status !== 404) {
          console.error(
            'Error loading pomodoro status in PomodoroComponent:',
            err
          );
          this.error =
            'Could not load Pomodoro status. Check API or service status.';
        } else {
          // 404 ist ok, bedeutet, es gibt noch keinen Timer für diesen User
          this.pomodoroState = null;
          this.clearCountdown();
        }
      },
    });
  }

  startPomodoro(minutes: number = 25, type: 'work' | 'break' = 'work'): void {
    this.error = null;
    this.apiService
      .startPomodoro(this.pomodoroUserId, minutes, type)
      .subscribe({
        next: (data) => {
          this.pomodoroState = data;
          console.log('Pomodoro timer started in PomodoroComponent:', data);
          if (data.is_running && data.end_time) {
            this.startCountdown(data.end_time);
          }
        },
        error: (err) => {
          console.error(
            'Error starting pomodoro timer in PomodoroComponent:',
            err
          );
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
        console.log('Pomodoro timer stopped in PomodoroComponent:', data);
        this.clearCountdown();
      },
      error: (err) => {
        console.error(
          'Error stopping pomodoro timer in PomodoroComponent:',
          err
        );
        this.error = 'Could not stop Pomodoro timer.';
      },
    });
  }

  startCountdown(endTimeISO: string): void {
    this.clearCountdown();
    const endTime = new Date(endTimeISO).getTime();
    this.updateRemainingTime(endTime);
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
      // Wichtig: Status neu laden, wenn Timer abläuft, um korrekten Zustand vom Backend zu bekommen
      this.loadPomodoroStatus();
      console.log('Pomodoro timer finished!');
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
}
