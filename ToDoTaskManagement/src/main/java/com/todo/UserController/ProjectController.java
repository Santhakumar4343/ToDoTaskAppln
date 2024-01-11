package com.todo.UserController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.Repository.ProjectRepository;
import com.todo.UserServiceImpl.ProjectServiceImpl;
import com.todo.entity.Project;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

	@Autowired
	private ProjectServiceImpl projectService;
	@Autowired
	private ProjectRepository projectRepository;

	@PostMapping("/save")
	public Project saveProject(@RequestParam String projectName, @RequestParam List<String> assignedTo,

			@RequestParam String status, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date closedDate,

			@RequestParam String remarks, @RequestParam String priority) {

		Project project = new Project();
		project.setProjectName(projectName);
		project.setAssignedTo(assignedTo);

		project.setStatus(status);
		project.setStartDate(startDate);
		project.setClosedDate(closedDate);
		project.setRemarks(remarks);
		project.setPriority(priority);
		return projectService.saveProject(project);
	}

	@PutMapping("/update/{projectId}")
	public Project updateProject(@PathVariable Long projectId, @RequestParam(required = false) String projectName,
			@RequestParam(required = false) List<String> assignedTo,

			@RequestParam(required = false) String status,
			@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
			@RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date closedDate,
			@RequestParam(required = false) String remarks, @RequestParam String priority) {

		Project updatedProject = new Project();
		updatedProject.setId(projectId);
		updatedProject.setProjectName(projectName);
		// updatedProject.setAssignedTo(assignedTo);
		// Retrieve the current project
		Project existingProject = projectRepository.getProjectById(projectId);

		// If the existing project is not found, you may want to handle this scenario
		// accordingly

		// Create a new list to preserve the existing assignedTo values
		List<String> updatedAssignedTo = new ArrayList<>(existingProject.getAssignedTo());

		// Append new users if provided
		if (assignedTo != null) {
			updatedAssignedTo.addAll(assignedTo);
		}

		// Set the updated assignedTo list
		updatedProject.setAssignedTo(updatedAssignedTo);

		updatedProject.setStatus(status);
		updatedProject.setStartDate(startDate);
		updatedProject.setPriority(priority);
		updatedProject.setClosedDate(closedDate);
		updatedProject.setRemarks(remarks);
		
		return projectService.updateProject(projectId, updatedProject);
	}

	@DeleteMapping("/delete/{projectId}")
	public void deleteProject(@PathVariable Long projectId) {
		projectService.deleteProject(projectId);
	}

	@GetMapping("/get/{projectId}")
	public Project getProject(@PathVariable Long projectId) {
		return projectService.getProject(projectId);
	}

	@GetMapping("/getAllProjects")
	public List<Project> getAllProjects() {
		return projectService.getAllProjects();
	}

	@GetMapping("/getUserProjects")
	public List<Project> getUserProjects(@RequestParam String username) {
		return projectService.getUserProjects(username);
	}

	@PutMapping("/assign-user/{projectId}")
	public ResponseEntity<String> assignUserToProject(@PathVariable Long projectId, @RequestParam String assignedTo) {

		try {
			projectService.assignUserToProject(projectId, assignedTo);
			return new ResponseEntity<>("User assigned successfully", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Error assigning user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@DeleteMapping("/remove-user/{projectId}")
	public ResponseEntity<String> removeUserFromProject(@PathVariable Long projectId, @RequestParam String userToRemove) {
	    try {
	        projectService.removeUserFromProject(projectId, userToRemove);
	        return new ResponseEntity<>("User removed successfully", HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Error removing user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}


}
