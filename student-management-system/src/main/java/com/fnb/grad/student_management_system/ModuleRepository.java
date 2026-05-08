package com.fnb.grad.student_management_system;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    // Find all modules belonging to a specific student
    List<Module> findByStudentId(Long studentId);
}