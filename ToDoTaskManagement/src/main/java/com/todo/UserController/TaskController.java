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

import com.todo.Repository.TaskRepository;
import com.todo.UserServiceImpl.ModuleServiceImpl;
import com.todo.UserServiceImpl.TaskServiceImpl;
import com.todo.entity.Modules;
import com.todo.entity.Task;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

	@Autowired
	private ModuleServiceImpl moduleService;

	@Autowired
	private TaskServiceImpl taskService;
	@Autowired
	private TaskRepository taskRepository;

	@PostMapping("/saveTask/{projectId}/{moduleId}")
	public Task createTaskForModule(@PathVariable Long projectId, @PathVariable Long moduleId,
			@RequestParam String taskName, @RequestParam List<String> assignedTo,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate, @RequestParam String status,
			@RequestParam String remarks,

			@RequestParam String priority) {
		Modules module = moduleService.getModuleById(moduleId);

		Task task = new Task();
		task.setModule(module);
		task.setTaskName(taskName);
		task.setAssignedTo(assignedTo);
		task.setStartDate(startDate);
		task.setEndDate(endDate);
		task.setStatus(status);
		task.setRemarks(remarks);
		task.setPriority(priority);

		return taskService.saveTask(task);
	}

	@PutMapping("/updateTask/{taskId}")
	public Task updateTask(@PathVariable Long taskId, @RequestParam String taskName,
			@RequestParam List<String> assignedTo, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate, @RequestParam String status,
			@RequestParam String remarks, @RequestParam String priority) {
		// Retrieve the task from the service
		Task task = taskService.getTaskById(taskId);

		// Update the task fields
		task.setTaskName(taskName);
		task.setStartDate(startDate);

//        Task existingTask =taskRepository.getTaskById(taskId);
//
//        // If the existing project is not found, you may want to handle this scenario accordingly
//
//        // Create a new list to preserve the existing assignedTo values
//        List<String> updatedAssignedTo = new ArrayList<>(existingTask.getAssignedTo());
//
//        // Append new users if provided
//        if (assignedTo != null) {
//            updatedAssignedTo.addAll(assignedTo);
//        }
//
//        // Set the updated assignedTo list
//        task.setAssignedTo(updatedAssignedTo);

		task.setAssignedTo(assignedTo);

		task.setEndDate(endDate);
		task.setStatus(status);
		task.setRemarks(remarks);
		task.setPriority(priority);

		// Save the updated task
		return taskService.updateTask(task);
	}
//    @GetMapping("/getTaskByModule/{moduleId}")
//    public Task getTaskById(@PathVariable Long moduleId) {
//    	return taskService.getTaskById(moduleId);
//    }
//    @GetMapping("/getAllTasks")
//    public List<Task> getAllTasks() {
//    	return taskService.getAllTasks();
//    }

	@GetMapping("/getTaskByModule/{moduleId}")
	public List<Task> getTasksByModule(@PathVariable Long moduleId) {
		// Assuming taskService.getTasksByModule returns a list of tasks
		return taskService.getTasksByModule(moduleId);
	}

	@GetMapping("/getAllTasks")
	public List<Task> getAllTasks() {
		return taskService.getAllTasks();
	}

	@DeleteMapping("/deleteTaskById/{taskId}")
	public void deleteTask(@PathVariable Long taskId) {
		taskService.deleteTask(taskId);
	}

	@PutMapping("/assign-user/{taskId}")
	public ResponseEntity<String> assignUserToTask(@PathVariable Long taskId, @RequestParam String assignedTo) {

		try {
			taskService.assignUserToTask(taskId, assignedTo);
			return new ResponseEntity<>("User assigned successfully", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Error assigning user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getUserTasks")
	public List<Task> getUserTasks(@RequestParam String username) {
		return taskService.getUserTasks(username);
	}

}
