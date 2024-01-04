package com.todo.UserServiceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.ProjectRepository;
import com.todo.Service.ProjectService;
import com.todo.entity.Project;
@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(Long projectId, Project updatedProject) {
        Project existingProject = getProject(projectId);

        // Update fields based on your requirements
        existingProject.setProjectName(updatedProject.getProjectName());
        existingProject.setAssignedTo(updatedProject.getAssignedTo());
       
        existingProject.setStatus(updatedProject.getStatus());
        existingProject.setStartDate(updatedProject.getStartDate());
        existingProject.setClosedDate(updatedProject.getClosedDate());
        existingProject.setRemarks(updatedProject.getRemarks());

        return projectRepository.save(existingProject);
    }
    @Override
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }
    @Override
    public Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }
    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    public List<Project> getUserProjects(String username) {
        return projectRepository.findByAssignedTo(username);
    }
    public void assignUserToProject(Long projectId, String assignedTo) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            List<String> assignedToList = project.getAssignedTo();

            // Add the user to the list if not already present
            if (!assignedToList.contains(assignedTo)) {
                assignedToList.add(assignedTo);
                project.setAssignedTo(assignedToList);
                projectRepository.save(project);
            }
        } else {
            throw new RuntimeException("Project not found with ID: " + projectId);
        }
    }
}

