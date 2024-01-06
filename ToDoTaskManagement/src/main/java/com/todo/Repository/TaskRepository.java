package com.todo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByModuleId(Long moduleId);
    List<Task> findByAssignedTo(String assignedTo);
  	Optional<Task> findById(Long id);
  Task	getTaskById(Long taskId);
}
