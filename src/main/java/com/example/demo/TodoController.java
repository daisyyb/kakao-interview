package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5174") // 리액트 앱의 주소
public class TodoController {

    private List<String> todos = new ArrayList<>();
    private List<String> doneTodos = new ArrayList<>();

    // 할 일 목록 가져오기
    @GetMapping("/api/todos")
    public List<String> getTodos() {
        return todos;
    }

    // 완료된 할 일 목록 가져오기
    @GetMapping("/api/doneTodos")
    public List<String> getDoneTodos() {
        return doneTodos;
    }

    // 할 일 추가하기
    @PostMapping("/api/todos")
    public void addTodo(@RequestBody String task) {
        todos.add(task);
    }

    // 할 일 삭제하기
    @DeleteMapping("/api/todos/{index}")
    public void deleteTodo(@PathVariable int index) {
        if (index >= 0 && index < todos.size()) {
            todos.remove(index);
        }
    }

    // 할 일 완료 처리하기
    @PutMapping("/api/todos/{index}")
    public void markAsDone(@PathVariable int index) {
        if (index >= 0 && index < todos.size()) {
            String doneTask = todos.remove(index);
            doneTodos.add(doneTask);
        }
    }
}
