package com.todo.UserServiceImpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.ModuleRepository;
import com.todo.Service.ModuleService;
import com.todo.entity.Modules;
import com.todo.entity.Project;

import jakarta.transaction.Transactional;

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
	    @Transactional
	    public List<Modules> getModulesByProject(Project project) {
	        return moduleRepository.findByProject(project);
	    }
	    // Implement other methods

		@Override
		@Transactional
		public Modules getModuleById(Long moduleId) {
			return moduleRepository.findById(moduleId)
	                .orElseThrow(() -> new RuntimeException("Modules not found with id: " + moduleId));
		}

		@Override
		@Transactional
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

		        // Split the assignedTo string into individual users
		        List<String> newUsers = Arrays.asList(assignedTo.split(","));

		        // Remove any duplicates from the new users
		        newUsers = new ArrayList<>(new HashSet<>(newUsers));

		        // Check if the user is already assigned
		        for (String newUser : newUsers) {
		            if (!assignedToList.contains(newUser)) {
		                assignedToList.add(newUser);
		            } else {
		                // Handle the case where the user is already assigned
		                // You can log an error or throw an exception based on your requirements
		                // For example:
		                // throw new IllegalArgumentException("User " + newUser + " is already assigned to the module.");
		                throw new RuntimeException("User " + newUser + " is already assigned to the module.");
		            }
		        }

		        module.setAssignedTo(assignedToList);
		        moduleRepository.save(module);
		    } else {
		        throw new RuntimeException("Module not found with ID: " + moduleId);
		    }
		}
		 public void removeUserFromModule(Long moduleId, String userToRemove) {
		        Optional<Modules> optionalModule = moduleRepository.findById(moduleId);

		        if (optionalModule.isPresent()) {
		            Modules module = optionalModule.get();
		            List<String> assignedToList = module.getAssignedTo();

		            // Remove the specified user from the list
		            assignedToList.remove(userToRemove);

		            module.setAssignedTo(assignedToList);
		            moduleRepository.save(module);
		        } else {
		            throw new RuntimeException("Project not found with ID: " + moduleId);
		        }
		    }


		
	}


