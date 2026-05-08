package com.fnb.grad.student_management_system;

import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller to handle API requests for Students.
 * The @CrossOrigin annotation allows your React app (on port 3000)
 * to securely communicate with this backend (on port 8080).
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/login")
    public Student login(@RequestBody Student loginDetails) {
        return repository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @PostMapping("/register")
    public Student register(@RequestBody Student newStudent) {
        return repository.save(newStudent);
    }

    @GetMapping
    public List<Student> getAll() {
        return repository.findAll();
    }
}