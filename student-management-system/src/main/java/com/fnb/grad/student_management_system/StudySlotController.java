package com.fnb.grad.student_management_system;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "http://localhost:5173")
public class StudySlotController {

    private final StudySlotRepository studySlotRepository;
    private final StudentRepository studentRepository;
    private final ModuleRepository moduleRepository;

    public StudySlotController(StudySlotRepository studySlotRepository,
                               StudentRepository studentRepository,
                               ModuleRepository moduleRepository) {
        this.studySlotRepository = studySlotRepository;
        this.studentRepository = studentRepository;
        this.moduleRepository = moduleRepository;
    }

    // Get the full schedule for a student
    @GetMapping("/student/{studentId}")
    public List<StudySlot> getSchedule(@PathVariable Long studentId) {
        return studySlotRepository.findByStudentId(studentId);
    }

    // Pin a module to a time slot
    @PostMapping("/student/{studentId}/module/{moduleId}")
    public StudySlot addToSchedule(
            @PathVariable Long studentId,
            @PathVariable Long moduleId,
            @RequestBody StudySlot slot) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        slot.setStudent(student);
        slot.setModule(module);

        return studySlotRepository.save(slot);
    }

    // Delete a slot from the calendar
    @DeleteMapping("/{slotId}")
    public void removeFromSchedule(@PathVariable Long slotId) {
        studySlotRepository.deleteById(slotId);
    }
}