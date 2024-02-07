package com.todo.UserServiceImpl;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.DepartmentRepository;
import com.todo.Service.DepartmentService;
import com.todo.entity.Department;
import com.todo.entity.Project;

@Service
public class DepartmentServiceImpl implements DepartmentService {
 
 @Autowired
 private DepartmentRepository departmentRepository;

 @Override
 public List<Department> getAllDepartments() {
     return departmentRepository.findAll();
 }

 @Override
 public Department getDepartmentById(Long id) {
     Optional<Department> departmentOptional = departmentRepository.findById(id);
     return departmentOptional.orElse(null);
 }

 @Override
 public Department createDepartment(Department department) {
     return departmentRepository.save(department);
 }

 @Override
 public Department updateDepartment(Long id, Department department) {
     Optional<Department> optionalDepartment = departmentRepository.findById(id);
     
     if (optionalDepartment.isPresent()) {
         Department existingDepartment = optionalDepartment.get();
         
         existingDepartment.setDepartmentName(department.getDepartmentName());
         
         
         // Check and update the assignedTo field to avoid duplicates
         List<String> existingAssignedTo = existingDepartment.getAssignedTo();
         List<String> updatedAssignedTo = department.getAssignedTo();

         // Remove already assigned users from the updated list to avoid duplication
         updatedAssignedTo.removeAll(existingAssignedTo);

         // Add the remaining updated users to the existing assignedTo list
         existingAssignedTo.addAll(updatedAssignedTo);
         
         // Save the updated department
         return departmentRepository.save(existingDepartment);
     }
     
     return null;
 }

 @Override
 public void deleteDepartment(Long id) {
     departmentRepository.deleteById(id);
 }
 
 
 
 
 public void assignUserToDepartment(Long departmentId, String assignedTo) {
	    Optional<Department> optionalDepartment = departmentRepository.findById(departmentId);

	    if (optionalDepartment.isPresent()) {
	        Department department = optionalDepartment.get();
	        List<String> assignedToList = department.getAssignedTo();

	        // Split the assignedTo string into individual users
	        List<String> newUsers = Arrays.asList(assignedTo.split(","));

	        // Remove any duplicates from the new users
	        newUsers = new ArrayList<>(new HashSet<>(newUsers));

	        // Add the new users to the list if not already present
	        for (String newUser : newUsers) {
	            if (!assignedToList.contains(newUser)) {
	                assignedToList.add(newUser);
	            } else {
	                throw new RuntimeException("User " + newUser + " is already assigned to the department.");
	            }
	        }

	        department.setAssignedTo(assignedToList);
	        departmentRepository.save(department);
	    } else {
	        throw new RuntimeException("Department not found with ID: " + departmentId);
	    }
	}

	public void removeUserFromDepartment(Long departmentId, String userToRemove) {
	    Optional<Department> optionalDepartment = departmentRepository.findById(departmentId);

	    if (optionalDepartment.isPresent()) {
	        Department department = optionalDepartment.get();
	        List<String> assignedToList = department.getAssignedTo();

	        // Remove the specified user from the list
	        assignedToList.remove(userToRemove);

	        department.setAssignedTo(assignedToList);
	        departmentRepository.save(department);
	    } else {
	        throw new RuntimeException("Department not found with ID: " + departmentId);
	    }
	}

	public List<Department> getUserDepartments(String username) {
        return departmentRepository.findByAssignedTo(username);
    }
}

