package com.todo.UserController;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.Service.ProjectService;
import com.todo.entity.Project;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/save")
    public Project saveProject(
            @RequestParam String projectName,
            @RequestParam String assignedTo,
            
            @RequestParam String status,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date closedDate,
	
            @RequestParam String remarks) {

        Project project = new Project();
        project.setProjectName(projectName);
        project.setAssignedTo(assignedTo);
       
        project.setStatus(status);
        project.setStartDate(startDate);
        project.setClosedDate(closedDate);
        project.setRemarks(remarks);

        return projectService.saveProject(project);
    }

    @PutMapping("/update/{projectId}")
    public Project updateProject(
    		@PathVariable Long projectId,
            @RequestParam(required = false) String projectName,
            @RequestParam(required = false) String assignedTo,
           
            @RequestParam(required = false) String status,
            @RequestParam (required = false)@DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam (required = false)@DateTimeFormat(pattern = "yyyy-MM-dd") Date closedDate,
            @RequestParam(required = false) String remarks) {

        Project updatedProject = new Project();
        updatedProject.setId(projectId);
        updatedProject.setProjectName(projectName);
        updatedProject.setAssignedTo(assignedTo);
       
        updatedProject.setStatus(status);
        updatedProject.setStartDate(startDate);
        updatedProject.setClosedDate(closedDate);
        updatedProject.setRemarks(remarks);

        return projectService.updateProject(projectId, updatedProject);
    }
    @DeleteMapping("/delete/{projectId}")
    public void deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
    }

    @GetMapping("/get/{projectId}")
    public Project getProject(@PathVariable Long projectId) {
        return projectService.getProject(projectId);
    }
    @GetMapping("/getAllProjects")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
}

