package com.todo.UserServiceImpl;

import java.util.List;
import java.util.Optional;

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
		@Override

		public List<Modules> getUserModules(String username) {
	        return moduleRepository.findByAssignedTo(username);
	    }
		
		 public void assignUserToModules(Long moduleId, String assignedTo) {
		        Optional<Modules> optionalModule = moduleRepository.findById(moduleId);

		        if (optionalModule.isPresent()) {
		            Modules module = optionalModule.get();
		            List<String> assignedToList = module.getAssignedTo();

		            // Add the user to the list if not already present
		            if (!assignedToList.contains(assignedTo)) {
		                assignedToList.add(assignedTo);
		                module.setAssignedTo(assignedToList);
		                moduleRepository.save(module);
		            }
		        } else {
		            throw new RuntimeException("Project not found with ID: " + moduleId);
		        }
		    }
		
		
	}


