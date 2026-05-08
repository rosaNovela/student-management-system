package com.fnb.grad.student_management_system;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:5173") // Ensure this matches your Vite port
public class ModuleController {

    private final ModuleRepository moduleRepository;
    private final StudentRepository studentRepository;

    public ModuleController(ModuleRepository moduleRepository, StudentRepository studentRepository) {
        this.moduleRepository = moduleRepository;
        this.studentRepository = studentRepository;
    }

    // Get all modules for a specific student
    @GetMapping("/student/{studentId}")
    public List<Module> getModulesByStudent(@PathVariable Long studentId) {
        return moduleRepository.findByStudentId(studentId);
    }

    // Add a new module to a student
    @PostMapping("/student/{studentId}")
    public Module addModule(@PathVariable Long studentId, @RequestBody Module module) {
        return studentRepository.findById(studentId).map(student -> {
            module.setStudent(student);
            return moduleRepository.save(module);
        }).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // Update study hours (Incrementing time)
    @PatchMapping("/{moduleId}/add-hours")
    public Module addHours(@PathVariable Long moduleId, @RequestParam Integer hours) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        module.setActualHoursStudied(module.getActualHoursStudied() + hours);
        return moduleRepository.save(module);
    }
}