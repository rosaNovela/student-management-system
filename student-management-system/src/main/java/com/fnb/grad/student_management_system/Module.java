package com.fnb.grad.student_management_system;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "modules")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer targetHoursPerWeek;

    private Integer actualHoursStudied = 0; // Default to 0

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @JsonBackReference // Prevents infinite loops when converting to JSON
    private Student student;

    // Default Constructor (Required by JPA)
    public Module() {}

    // Convenience Constructor
    public Module(String name, Integer targetHoursPerWeek, Student student) {
        this.name = name;
        this.targetHoursPerWeek = targetHoursPerWeek;
        this.student = student;
        this.actualHoursStudied = 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getTargetHoursPerWeek() { return targetHoursPerWeek; }
    public void setTargetHoursPerWeek(Integer targetHoursPerWeek) { this.targetHoursPerWeek = targetHoursPerWeek; }

    public Integer getActualHoursStudied() { return actualHoursStudied; }
    public void setActualHoursStudied(Integer actualHoursStudied) { this.actualHoursStudied = actualHoursStudied; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}