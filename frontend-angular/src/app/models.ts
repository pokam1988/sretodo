export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean; // Optional: für den Bearbeitungszustand im Frontend
  originalTitle?: string; // Optional: zum Wiederherstellen bei Abbruch
}

export interface PomodoroState {
  user_id: string;
  start_time: string | null; // ISO String
  duration_minutes: number;
  end_time: string | null; // ISO String
  is_running: boolean;
  timer_type: string; // Geändert von 'work' | 'break' zu string
}

export interface Statistics {
  totalTodos: number;
  // Zukünftige Statistikdaten hier hinzufügen
}
