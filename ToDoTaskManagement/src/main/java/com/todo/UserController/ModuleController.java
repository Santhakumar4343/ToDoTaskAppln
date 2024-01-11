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

import com.todo.Repository.ModuleRepository;
import com.todo.Service.ModuleService;
import com.todo.Service.ProjectService;
import com.todo.UserServiceImpl.ModuleServiceImpl;
import com.todo.entity.Modules;
import com.todo.entity.Project;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

	@Autowired
	private ProjectService projectService;
	@Autowired
	private ModuleRepository moduleRepository;
	@Autowired
	private ModuleServiceImpl moduleService;

	@PostMapping("/saveModule/{projectId}")
	public Modules createModuleForProject(@PathVariable Long projectId, @RequestParam String moduleName,
			@RequestParam List<String> assignedTo, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate, @RequestParam String status,
			@RequestParam String remarks, @RequestParam String priority) {
		Project project = projectService.getProject(projectId);
		Modules module = new Modules();
		module.setProject(project);
		module.setModuleName(moduleName);
		module.setAssignedTo(assignedTo);
		module.setStartDate(startDate);
		module.setEndDate(endDate);
		module.setStatus(status);
		module.setRemarks(remarks);
		module.setPriority(priority);
		return moduleService.saveModule(module);
	}

	@PutMapping("/updateModule/{moduleId}")
	public Modules updateModule(@PathVariable Long moduleId, @RequestParam String moduleName,
			@RequestParam(required = false) List<String> assignedTo,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate, @RequestParam String status,
			@RequestParam String remarks, @RequestParam String priority) {
		// Retrieve the module from the service
		Modules module = moduleService.getModuleById(moduleId);
		Modules existingModule = moduleRepository.getModuleById(moduleId);

		// If the existing module is not found, you may want to handle this scenario
		// accordingly

		// Create a new list to preserve the existing assignedTo values
		List<String> updatedAssignedTo = new ArrayList<>(existingModule.getAssignedTo());

		// Append new users if provided and not already assigned
		if (assignedTo != null) {
			for (String user : assignedTo) {
				if (!updatedAssignedTo.contains(user)) {
					updatedAssignedTo.add(user);
				} else {
					// Handle the case where the user is already assigned
					// You can log an error or throw an exception based on your requirements
					// For example:
					// throw new IllegalArgumentException("User " + user + " is already assigned to
					// the module.");
					System.err.println("User " + user + " is already assigned to the module.");
				}
			}
		}

		// Set the updated assignedTo list
		module.setAssignedTo(updatedAssignedTo);

		// module.setAssignedTo(assignedTo);

		// Update the module fields
		module.setModuleName(moduleName);
		module.setStatus(status);
		module.setRemarks(remarks);
		module.setStartDate(startDate);
		module.setEndDate(endDate);
		module.setPriority(priority);
		// Save the updated module
		return moduleService.updateModule(module);
	}

	@GetMapping("/getAllModules")
	public List<Modules> getModuleAll() {

		return moduleService.getAllModules();
	}

	@DeleteMapping("/deleteModule/{moduleId}")
	public void deleteModule(@PathVariable Long moduleId) {

		moduleService.deleteModule(moduleId);
	}

	@GetMapping("/getModuleByPId/{projectId}")
	public ResponseEntity<List<Modules>> getModulesByProject(@PathVariable Long projectId) {

		// Create a Project instance and set the ID
		Project project = new Project();
		project.setId(projectId);

		// Call the service method to get modules by project
		List<Modules> modules = moduleService.getModulesByProject(project);

		// Check if modules were found
		if (!modules.isEmpty()) {
			return ResponseEntity.ok(modules);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/assign-user/{moduleId}")
	public ResponseEntity<String> assignUserToProject(@PathVariable Long moduleId, @RequestParam String assignedTo) {

		try {
			moduleService.assignUserToModules(moduleId, assignedTo);
			return new ResponseEntity<>("User assigned successfully", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Error assigning user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

//	@GetMapping("/getUserModules")
//	public List<Modules> getModuleAll() {
//
//		return moduleService.getAllModules();
//	}
	@GetMapping("/getUserModules")
	public List<Modules> getUserModules(@RequestParam String username) {
		return moduleService.getUserModules(username);
	}
	
	@DeleteMapping("/remove-user/{moduleId}")
	public ResponseEntity<String> removeUserFromProject(@PathVariable Long moduleId, @RequestParam String userToRemove) {
	    try {
	        moduleService.removeUserFromModule(moduleId, userToRemove);
	        return new ResponseEntity<>("User removed successfully", HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Error removing user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
}
