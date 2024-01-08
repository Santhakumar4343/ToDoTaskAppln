package com.todo.Service;

import java.util.List;

import com.todo.entity.Modules;
import com.todo.entity.Project;

public interface ModuleService {
	public Modules saveModule(Modules module);
    Modules updateModule(Modules module);
    void deleteModule(Long moduleId);
    List<Modules> getModulesByProject(Project project);
	public Modules getModuleById(Long moduleId);
	List<Modules> getAllModules();
	 public List<Modules> getUserModules(String username);
	
   
}
