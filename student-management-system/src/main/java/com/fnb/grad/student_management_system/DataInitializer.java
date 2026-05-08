package com.fnb.grad.student_management_system;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final StudentRepository studentRepository;
    private final ModuleRepository moduleRepository;
    private final StudySlotRepository studySlotRepository;

    public DataInitializer(StudentRepository studentRepository,
                           ModuleRepository moduleRepository,
                           StudySlotRepository studySlotRepository) {
        this.studentRepository = studentRepository;
        this.moduleRepository = moduleRepository;
        this.studySlotRepository = studySlotRepository;
    }

    @Override
    public void run(String... args) {
        // 1. Clear everything to avoid conflicts
        studySlotRepository.deleteAll();
        moduleRepository.deleteAll();
        studentRepository.deleteAll();

        // 2. Create Rosa - Let the database handle the ID
        Student rosa = new Student();
        rosa.setFirstName("Rosa");
        rosa.setLastName("Novela");
        rosa.setEmail("rosa@example.com");

        // Hibernate will save this and give it ID 1 automatically
        studentRepository.save(rosa);

        System.out.println("✅ Database Reset: Rosa created!");
    }
}