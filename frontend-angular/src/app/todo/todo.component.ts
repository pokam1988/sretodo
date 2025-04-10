import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Todo } from '../models';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  private apiService = inject(ApiService);

  todos: Todo[] = [];
  error: string | null = null;
  newTodoTitle: string = '';

  // Edit State
  editingTodoId: number | null = null;
  editTodoTitle: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.error = null;
    this.apiService.getTodos().subscribe({
      next: (data) => {
        this.todos = data.sort((a, b) => a.id - b.id);
        console.log('Todos loaded in TodoComponent:', data);
      },
      error: (err) => {
        console.error('Error loading todos in TodoComponent:', err);
        this.error = 'Could not load ToDos. Check API or service status.';
      },
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;
    this.error = null;

    this.apiService.addTodo(this.newTodoTitle).subscribe({
      next: (addedTodo) => {
        console.log('ToDo added in TodoComponent:', addedTodo);
        this.loadTodos();
        this.newTodoTitle = '';
      },
      error: (err) => {
        console.error('Error adding todo in TodoComponent:', err);
        this.error = 'Could not add ToDo. Check API or service status.';
      },
    });
  }

  toggleTodoCompletion(todo: Todo): void {
    this.error = null;
    const originalStatus = todo.completed;
    const updatedTodo = { ...todo, completed: !todo.completed };

    this.apiService.updateTodo(updatedTodo).subscribe({
      next: (result) => {
        console.log('Todo completion toggled in TodoComponent:', result);
        const index = this.todos.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = result;
          this.todos.sort((a, b) => a.id - b.id);
        }
      },
      error: (err) => {
        console.error('Error toggling todo completion in TodoComponent:', err);
        this.error = 'Could not update ToDo status.';
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
        console.log(`Todo ${id} deleted in TodoComponent`);
        this.todos = this.todos.filter((t) => t.id !== id);
      },
      error: (err) => {
        console.error(`Error deleting todo ${id} in TodoComponent:`, err);
        this.error = 'Could not delete ToDo.';
      },
    });
  }

  startEdit(todo: Todo): void {
    this.todos.forEach((t) => (t.editing = false));
    todo.editing = true;
    todo.originalTitle = todo.title;
  }

  cancelEdit(todo: Todo): void {
    if (todo.editing) {
      todo.title = todo.originalTitle!;
      todo.editing = false;
    }
  }

  saveEdit(todo: Todo): void {
    if (!todo.title.trim() || todo.title === todo.originalTitle) {
      todo.editing = false;
      return;
    }
    this.error = null;
    const updatedTodoData = { ...todo, title: todo.title.trim() };
    delete updatedTodoData.editing;
    delete updatedTodoData.originalTitle;

    this.apiService.updateTodo(updatedTodoData).subscribe({
      next: (savedTodo) => {
        console.log('Todo updated in TodoComponent:', savedTodo);
        const index = this.todos.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = { ...savedTodo, editing: false };
          this.todos.sort((a, b) => a.id - b.id);
        }
      },
      error: (err) => {
        console.error('Error updating todo in TodoComponent:', err);
        this.error = 'Could not update ToDo.';
      },
      complete: () => {
        todo.editing = false;
      },
    });
  }
}
