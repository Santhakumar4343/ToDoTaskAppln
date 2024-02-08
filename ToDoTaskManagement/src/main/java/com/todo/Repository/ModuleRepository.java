package com.todo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.entity.Modules;
import com.todo.entity.Project;

@Repository
public interface ModuleRepository extends JpaRepository<Modules, Long> {
    List<Modules> findByProject(Project project);
    List<Modules> findByAssignedTo(String assignedTo);
	Optional<Modules> findById(Long id);
	Modules getModuleById(Long moduleId);
//	 List<Modules> getModulesByProjectId(List<Long> projectIds);
}
