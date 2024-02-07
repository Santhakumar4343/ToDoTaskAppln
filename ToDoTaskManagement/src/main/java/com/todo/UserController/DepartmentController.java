package com.todo.UserController;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.UserServiceImpl.DepartmentServiceImpl;
import com.todo.entity.Department;
import com.todo.entity.Project;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
 
 @Autowired
 private DepartmentServiceImpl departmentService;

 @GetMapping("/getAllDepartments")
 public List<Department> getAllDepartments() {
     return departmentService.getAllDepartments();
 }

 @GetMapping("/getDepartment/{id}")
 public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
     Department department = departmentService.getDepartmentById(id);
     if (department != null) {
         return new ResponseEntity<>(department, HttpStatus.OK);
     } else {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
     }
 }

 @PostMapping("/saveDepartment")
 public ResponseEntity<Department> createDepartment(@RequestParam String departmentName, @RequestParam List<String> assignedTo) {
    
	 Department createdDepartment = new Department();
	  createdDepartment.setDepartmentName(departmentName);
	  createdDepartment.setAssignedTo(assignedTo);
	 departmentService.createDepartment(createdDepartment);
     return new ResponseEntity<>(createdDepartment, HttpStatus.CREATED);
 }

 @PutMapping("/updateDepartment/{id}")
 public ResponseEntity<Department> updateDepartment(@PathVariable Long id,
                                                    @RequestParam String departmentName,
                                                    @RequestParam(required = false) List<String> assignedTo) {
     // Retrieve the current department
     Department existingDepartment = departmentService.getDepartmentById(id);
     
     if (existingDepartment == null) {
         return ResponseEntity.notFound().build();
     }
     
     // Update the department name
     existingDepartment.setDepartmentName(departmentName);
     
     // Retrieve the current list of assigned users
     List<String> updatedAssignedTo = existingDepartment.getAssignedTo();
     
     // Check for duplicates and throw error if user already exists
     if (assignedTo != null) {
         for (String user : assignedTo) {
             if (updatedAssignedTo.contains(user)) {
                 throw new RuntimeException("User '" + user + "' already exists in the assigned users list.");
             }
         }
         // Append new users if no duplicates found
         updatedAssignedTo.addAll(assignedTo);
     }
     
     // Set the updated assignedTo list
     existingDepartment.setAssignedTo(updatedAssignedTo);
     
     // Save the updated department
     Department updatedDepartment = departmentService.createDepartment(existingDepartment);
     
     return ResponseEntity.ok(updatedDepartment);
 }



 @DeleteMapping("/deleteDepartment/{id}")
 public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
     departmentService.deleteDepartment(id);
     return new ResponseEntity<>(HttpStatus.NO_CONTENT);
 }
 
 
 
 @PutMapping("/assign-user/{departmentId}")
 public ResponseEntity<String> assignUserToDepartment(@PathVariable Long departmentId, @RequestParam String assignedTo) {
     try {
         departmentService.assignUserToDepartment(departmentId, assignedTo);
         return new ResponseEntity<>("User assigned successfully", HttpStatus.OK);
     } catch (Exception e) {
         return new ResponseEntity<>("Error assigning user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     }
 }

 @DeleteMapping("/remove-user/{departmentId}")
 public ResponseEntity<String> removeUserFromDepartment(@PathVariable Long departmentId,
         @RequestParam String userToRemove) {
     try {
         departmentService.removeUserFromDepartment(departmentId, userToRemove);
         return new ResponseEntity<>("User removed successfully", HttpStatus.OK);
     } catch (Exception e) {
         return new ResponseEntity<>("Error removing user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
     }
 }

 @GetMapping("/getAdminDepartments")
	public List<Department> getUserProjects(@RequestParam String username) {
		return departmentService.getUserDepartments(username);
	}

}

