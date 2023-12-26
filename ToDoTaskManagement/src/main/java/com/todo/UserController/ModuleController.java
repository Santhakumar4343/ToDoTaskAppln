package com.todo.UserController;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.Service.ModuleService;
import com.todo.Service.ProjectService;
import com.todo.entity.Modules;
import com.todo.entity.Project;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

	@Autowired
	private ProjectService projectService; 

	@Autowired
	private ModuleService moduleService;

	@PostMapping("/saveModule/{projectId}")
	public Modules createModuleForProject(@PathVariable Long projectId,
            @RequestParam String moduleName,
  
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam String status,
            @RequestParam String remarks) {
		Project project = projectService.getProject(projectId);
		 Modules module = new Modules();
	        module.setProject(project);
	        module.setModuleName(moduleName);
	        module.setStartDate(startDate);
	        module.setEndDate(endDate);
	        module.setStatus(status);
	        module.setRemarks(remarks);

	        return moduleService.saveModule(module);
	}
	@PutMapping("/updateModule/{moduleId}")
    public Modules updateModule(
            @PathVariable Long moduleId,
            @RequestParam String moduleName,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam String status,
            @RequestParam String remarks) {
        // Retrieve the module from the service
        Modules module = moduleService.getModuleById(moduleId);

        // Update the module fields
        module.setModuleName(moduleName);
        module.setStatus(status);
        module.setRemarks(remarks);
       module.setStartDate(startDate);
       module.setEndDate(endDate);
        // Save the updated module
        return moduleService.updateModule(module);
    }
	@GetMapping("/getAllModules")
	public List<Modules> getModuleAll() {
		
    	 return moduleService.getAllModules();
     }
	@DeleteMapping("/deleteModule/{moduleId}")
	public void deleteModule(@PathVariable Long moduleId) {
		
    	  moduleService.deleteModule(moduleId);
     }
	
	 
	 @GetMapping("/getModuleByPId/{projectId}")
	 public ResponseEntity<List<Modules>> getModulesByProject(@PathVariable Long projectId) {
	     

	     // Create a Project instance and set the ID
	     Project project = new Project();
	     project.setId(projectId);

	     // Call the service method to get modules by project
	     List<Modules> modules = moduleService.getModulesByProject(project);

	     // Check if modules were found
	     if (!modules.isEmpty()) {
	         return ResponseEntity.ok(modules);
	     } else {
	         return ResponseEntity.notFound().build();
	     }
	 }
	
}
