package com.sretodo.mvp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Hello world!
 *
 */
@SpringBootApplication
public class App {

    // Spring Boot main Methode
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
        System.out.println("ToDo Service with DB started!");
    }
}

// --- JPA Entität ---
@Entity
class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID wird von DB generiert
    private Long id;
    private String title;
    private boolean completed;

    // Konstruktoren, Getter, Setter (Lombok wäre hier nützlich, aber optional)
    public Todo() {
    }

    // Getter/Setter für JPA und JSON
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}

// --- Spring Data JPA Repository ---
@Repository
interface TodoRepository extends JpaRepository<Todo, Long> { // Arbeitet mit Todo Entität und Long als ID-Typ
}

// --- REST Controller ---
@RestController
@RequestMapping("/todos")
class TodoController {

    @Autowired // Spring injects the repository bean
    private TodoRepository todoRepository;

    // GET /todos - Alle ToDos abrufen
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // GET /todos/{id} - Ein spezifisches ToDo abrufen
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        Optional<Todo> todo = todoRepository.findById(id);
        return todo.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        // Kurzform für: if (todo.isPresent()) { return ResponseEntity.ok(todo.get()); }
        // else { return ResponseEntity.notFound().build(); }
    }

    // POST /todos - Ein neues ToDo erstellen
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo newTodo) {
        // ID wird von der DB generiert, also nicht setzen.
        newTodo.setCompleted(false); // Standardwert
        Todo savedTodo = todoRepository.save(newTodo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTodo);
    }

    // PUT /todos/{id} - Ein bestehendes ToDo aktualisieren
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodoDetails) {
        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setTitle(updatedTodoDetails.getTitle());
                    existingTodo.setCompleted(updatedTodoDetails.isCompleted());
                    Todo savedTodo = todoRepository.save(existingTodo);
                    return ResponseEntity.ok(savedTodo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /todos/{id} - Ein ToDo löschen
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
