package com.todo.UserController;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo.Service.DepartmentService;
import com.todo.entity.Department;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
 
 @Autowired
 private DepartmentService departmentService;

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
 public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
     Department createdDepartment = departmentService.createDepartment(department);
     return new ResponseEntity<>(createdDepartment, HttpStatus.CREATED);
 }

 @PutMapping("/updateDepartment/{id}")
 public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
     Department updatedDepartment = departmentService.updateDepartment(id, department);
     if (updatedDepartment != null) {
         return new ResponseEntity<>(updatedDepartment, HttpStatus.OK);
     } else {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
     }
 }

 @DeleteMapping("/deleteDepartment/{id}")
 public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
     departmentService.deleteDepartment(id);
     return new ResponseEntity<>(HttpStatus.NO_CONTENT);
 }
}

