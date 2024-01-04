package com.todo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Additional custom queries can be added if needed
	List<Project> findByAssignedTo(String assignedTo);
	Optional<Project> findById(Long id);
}
