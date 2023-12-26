package com.todo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByModuleId(Long moduleId);
    
}
