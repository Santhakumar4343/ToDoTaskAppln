package com.todo.UserServiceImpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.ProjectRepository;
import com.todo.Service.ProjectService;
import com.todo.entity.Project;

import jakarta.transaction.Transactional;
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

        // Check and update the assignedTo field to avoid duplicates
        List<String> existingAssignedTo = existingProject.getAssignedTo();
        List<String> updatedAssignedTo = updatedProject.getAssignedTo();

        // Remove already assigned users from the updated list to avoid duplication
        updatedAssignedTo.removeAll(existingAssignedTo);

        // Add the remaining updated users to the existing assignedTo list
        existingAssignedTo.addAll(updatedAssignedTo);

        existingProject.setStatus(updatedProject.getStatus());
        existingProject.setStartDate(updatedProject.getStartDate());
        existingProject.setClosedDate(updatedProject.getClosedDate());
        existingProject.setRemarks(updatedProject.getRemarks());
        existingProject.setPriority(updatedProject.getPriority());
        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }
    @Override
    @Transactional
    public Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }
    @Override
    @Transactional
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    public List<Project> getUserProjects(String username) {
        return projectRepository.findByAssignedTo(username);
    }
//    public void assignUserToProject(Long projectId, String assignedTo) {
//        Optional<Project> optionalProject = projectRepository.findById(projectId);
//
//        if (optionalProject.isPresent()) {
//            Project project = optionalProject.get();
//            List<String> assignedToList = project.getAssignedTo();
//
//            // Add the user to the list if not already present
//            if (!assignedToList.contains(assignedTo)) {
//                assignedToList.add(assignedTo);
//                project.setAssignedTo(assignedToList);
//                projectRepository.save(project);
//            }
//        } else {
//            throw new RuntimeException("Project not found with ID: " + projectId);
//        }
//    }
    public void assignUserToProject(Long projectId, String assignedTo) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            List<String> assignedToList = project.getAssignedTo();

            // Split the assignedTo string into individual users
            List<String> newUsers = Arrays.asList(assignedTo.split(","));

            // Remove any duplicates from the new users
            newUsers = new ArrayList<>(new HashSet<>(newUsers));

            // Add the new users to the list if not already present
            for (String newUser : newUsers) {
                if (!assignedToList.contains(newUser)) {
                    assignedToList.add(newUser);
                } else {
                    // Handle the case where the user is already assigned
                    // You can log an error or throw an exception based on your requirements
                    // For example:
                    // throw new IllegalArgumentException("User " + newUser + " is already assigned to the project.");
                    throw new RuntimeException("User " + newUser + " is already assigned to the project.");
                }
            }

            project.setAssignedTo(assignedToList);
            projectRepository.save(project);
        } else {
            throw new RuntimeException("Project not found with ID: " + projectId);
        }
    }
    public void removeUserFromProject(Long projectId, String userToRemove) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            List<String> assignedToList = project.getAssignedTo();

            // Remove the specified user from the list
            assignedToList.remove(userToRemove);

            project.setAssignedTo(assignedToList);
            projectRepository.save(project);
        } else {
            throw new RuntimeException("Project not found with ID: " + projectId);
        }
    }


}

