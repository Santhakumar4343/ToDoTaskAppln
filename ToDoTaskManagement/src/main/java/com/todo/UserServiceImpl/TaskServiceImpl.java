package com.todo.UserServiceImpl;

import java.util.List;

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
    public List<Task> getTasksByModule(Module module) {
        return taskRepository.findByModule(module);
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
    
}