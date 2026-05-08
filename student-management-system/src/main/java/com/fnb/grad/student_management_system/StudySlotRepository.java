package com.fnb.grad.student_management_system;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudySlotRepository extends JpaRepository<StudySlot, Long> {
    // This allows us to fetch the whole calendar for a specific student
    List<StudySlot> findByStudentId(Long studentId);
}