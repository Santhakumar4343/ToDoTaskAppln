package com.todo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Additional custom queries can be added if needed
}
