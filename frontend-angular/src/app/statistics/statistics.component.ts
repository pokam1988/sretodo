import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Statistics } from '../models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  private apiService = inject(ApiService);

  statistics: Statistics | null = null;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.error = null;
    this.apiService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        console.log('Statistics loaded in StatisticsComponent:', data);
        // Check for backend errors reported within the data
        if (data && typeof data === 'object' && 'error' in data && data.error) {
          console.error('Statistics API reported an error:', data.error);
          this.error = `Statistics Error: ${data.error}`;
          this.statistics = null; // Clear statistics if backend reported error
        }
      },
      error: (err) => {
        console.error('Error loading statistics in StatisticsComponent:', err);
        this.error = 'Could not load Statistics. Check API or service status.';
        this.statistics = null; // Clear statistics on communication error
      },
    });
  }
}
