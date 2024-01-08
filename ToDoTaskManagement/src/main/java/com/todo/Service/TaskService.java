package com.todo.Service;

import java.util.List;


import com.todo.entity.Task;

public interface TaskService {
	 Task saveTask(Task task);
	    Task updateTask(Task task);
	    void deleteTask(Long taskId);
	    List<Task> getTasksByModule(Long moduleId);
		Task getTaskById(Long taskId);
		List<Task> getAllTasks();
		 public List<Task> getUserTasks(String username);
		 
}

