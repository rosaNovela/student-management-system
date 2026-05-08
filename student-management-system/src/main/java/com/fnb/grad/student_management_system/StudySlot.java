package com.fnb.grad.student_management_system;

import jakarta.persistence.*; // Required for @Entity, @Id, etc.

@Entity
@Table(name = "study_slots")
public class StudySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayOfWeek; // e.g., "Monday"
    private String startTime; // e.g., "08:00"

    @ManyToOne
    @JoinColumn(name = "module_id") // Links to the Module table
    private Module module;

    @ManyToOne
    @JoinColumn(name = "student_id") // Links to the Student table
    private Student student;

    // 1. Default Constructor (Required by JPA)
    public StudySlot() {}

    // 2. Convenience Constructor
    public StudySlot(String dayOfWeek, String startTime, Module module, Student student) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.module = module;
        this.student = student;
    }

    // 3. Getters and Setters (IntelliJ can generate these with Alt+Insert)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public Module getModule() { return module; }
    public void setModule(Module module) { this.module = module; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}