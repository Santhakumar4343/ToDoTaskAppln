package com.todo.Service;

import java.util.List;

import com.todo.entity.Modules;
import com.todo.entity.Project;
import com.todo.entity.Task;

public interface ModuleService {
	public Modules saveModule(Modules module);
    Modules updateModule(Modules module);
    void deleteModule(Long moduleId);
    List<Modules> getModulesByProject(Project project);
	public Modules getModuleById(Long moduleId);
	List<Modules> getAllModules();
	 public List<Modules> getUserModules(String username);
//	  public List<Modules> getModulesByProjectIds(List<Long> projectIds);
   
}
