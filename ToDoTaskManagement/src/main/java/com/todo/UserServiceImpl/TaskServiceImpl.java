package com.todo.UserServiceImpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.TaskRepository;
import com.todo.Service.TaskService;
import com.todo.entity.Task;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task) {
        // Assuming that the task already exists in the database
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Override
    public List<Task> getTasksByModule(Long moduleId) {
        return taskRepository.findByModuleId(moduleId);
    }

	@Override
	public Task getTaskById(Long taskId) {
		return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
	}

	@Override
	public List<Task> getAllTasks() {
		
		return taskRepository.findAll();
	}

	@Override
	public List<Task> getUserTasks(String username) {
		
	        return taskRepository.findByAssignedTo(username);
	    
	}
	
    
//	 public void assignUserToTask(Long taskId, String assignedTo) {
//	        Optional<Task> optionalTask = taskRepository.findById(taskId);
//
//	        if (optionalTask.isPresent()) {
//	            Task task = optionalTask.get();
//	            List<String> assignedToList = task.getAssignedTo();
//
//	            // Add the user to the list if not already present
//	            if (!assignedToList.contains(assignedTo)) {
//	                assignedToList.add(assignedTo);
//	                task.setAssignedTo(assignedToList);
//	                taskRepository.save(task);
//	            }
//	        } else {
//	            throw new RuntimeException("Project not found with ID: " + taskId);
//	        }
//	    }
	public void assignUserToTask(Long taskId, String assignedTo) {
	    Optional<Task> optionalTask = taskRepository.findById(taskId);

	    if (optionalTask.isPresent()) {
	        Task task = optionalTask.get();
	        List<String> assignedToList = task.getAssignedTo();

	        // Split the assignedTo string into individual users
	        List<String> newUsers = Arrays.asList(assignedTo.split(","));

	        // Remove any duplicates from the new users
	        newUsers = new ArrayList<>(new HashSet<>(newUsers));

	        // Check if the user is already assigned
	        for (String newUser : newUsers) {
	            if (!assignedToList.contains(newUser)) {
	                assignedToList.add(newUser);
	            } else {
	               
	                // throw new IllegalArgumentException("User " + newUser + " is already assigned to the task.");
	                throw new RuntimeException("User " + newUser + " is already assigned to the task.");
	            }
	        }

	        task.setAssignedTo(assignedToList);
	        taskRepository.save(task);
	    } else {
	        throw new RuntimeException("Task not found with ID: " + taskId);
	    }
	}

	
	
	
	
	
	
	
	
	
}