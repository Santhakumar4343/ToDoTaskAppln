package com.todo.Service;

import java.util.List;

import com.todo.entity.Project;

public interface ProjectService {
	 Project saveProject(Project project);
	    Project updateProject(Long projectId, Project updatedProject);
	    void deleteProject(Long projectId);
	    Project getProject(Long projectId);
	    List<Project> getAllProjects();
	    public List<Project> getUserProjects(String username);
}
