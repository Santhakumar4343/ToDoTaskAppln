package com.todo.UserServiceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.TaskRepository;
import com.todo.Service.TaskService;
import com.todo.entity.Modules;
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
	
    
	 public void assignUserToTask(Long taskId, String assignedTo) {
	        Optional<Task> optionalTask = taskRepository.findById(taskId);

	        if (optionalTask.isPresent()) {
	            Task task = optionalTask.get();
	            List<String> assignedToList = task.getAssignedTo();

	            // Add the user to the list if not already present
	            if (!assignedToList.contains(assignedTo)) {
	                assignedToList.add(assignedTo);
	                task.setAssignedTo(assignedToList);
	                taskRepository.save(task);
	            }
	        } else {
	            throw new RuntimeException("Project not found with ID: " + taskId);
	        }
	    }
	
	
	
	
	
	
	
	
	
}