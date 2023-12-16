package com.todo.UserController;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.Service.ModuleService;
import com.todo.Service.TaskService;
import com.todo.entity.Modules;
import com.todo.entity.Task;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private TaskService taskService;

    @PostMapping("/saveTask/{projectId}/{moduleId}")
    public Task createTaskForModule(
    		@PathVariable Long projectId,
            @PathVariable Long moduleId,
            @RequestParam String taskName,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam String status,
            @RequestParam String remarks,
            
            @RequestParam String priority) {
        Modules module = moduleService.getModuleById(moduleId);

        Task task = new Task();
        task.setModule(module);
        task.setTaskName(taskName);
        task.setStartDate(startDate);
        task.setEndDate(endDate);
        task.setStatus(status);
        task.setRemarks(remarks);
        task.setPriority(priority);

        return taskService.saveTask(task);
    }

    @PutMapping("/updateTask/{taskId}")
    public Task updateTask(
            @PathVariable Long taskId,
            @RequestParam String taskName,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam String status,
            @RequestParam String remarks,
            @RequestParam String priority) {
        // Retrieve the task from the service
        Task task = taskService.getTaskById(taskId);

        // Update the task fields
        task.setTaskName(taskName);
        task.setStartDate(startDate);
        task.setEndDate(endDate);
        task.setStatus(status);
        task.setRemarks(remarks);
        task.setPriority(priority);

        // Save the updated task
        return taskService.updateTask(task);
    }
    @GetMapping("/getTaskById/{taskId}")
    public Task getTaskById(@PathVariable Long taskId) {
    	return taskService.getTaskById(taskId);
    }
    @GetMapping("/getAllTasks")
    public List<Task> getAllTasks() {
    	return taskService.getAllTasks();
    }
    @DeleteMapping("/deleteTaskById/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
    	taskService.deleteTask(taskId);
    }
}
