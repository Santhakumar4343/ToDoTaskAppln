package com.todo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.entity.Modules;
import com.todo.entity.Project;

@Repository
public interface ModuleRepository extends JpaRepository<Modules, Long> {
    List<Modules> findByProject(Project project);
    
}
