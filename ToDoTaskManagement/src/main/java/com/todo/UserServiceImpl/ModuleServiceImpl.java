package com.todo.UserServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.ModuleRepository;
import com.todo.Service.ModuleService;
import com.todo.entity.Modules;
import com.todo.entity.Project;

@Service
	public class ModuleServiceImpl implements ModuleService {

	   @Autowired
	    private ModuleRepository moduleRepository;

	    @Override
	    public Modules saveModule(Modules module) {
	        return moduleRepository.save(module);
	    }

	    @Override
	    public Modules updateModule(Modules  module) {
	        // Assuming that the module already exists in the database
	        return moduleRepository.save(module);
	    }

	    @Override
	    public void deleteModule(Long moduleId) {
	        moduleRepository.deleteById(moduleId);
	    }

	  
	    @Override
	    public List<Modules> getModulesByProject(Project project) {
	        return moduleRepository.findByProject(project);
	    }
	    // Implement other methods

		@Override
		public Modules getModuleById(Long moduleId) {
			return moduleRepository.findById(moduleId)
	                .orElseThrow(() -> new RuntimeException("Modules not found with id: " + moduleId));
		}

		@Override
		public List<Modules> getAllModules() {
			
			return moduleRepository.findAll();
		}
		
	}


