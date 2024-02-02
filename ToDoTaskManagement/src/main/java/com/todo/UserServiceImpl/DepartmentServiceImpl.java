package com.todo.UserServiceImpl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.Repository.DepartmentRepository;
import com.todo.Service.DepartmentService;
import com.todo.entity.Department;

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
     if (departmentRepository.existsById(id)) {
         department.setId(id);
         return departmentRepository.save(department);
     }
     return null; 
 }

 @Override
 public void deleteDepartment(Long id) {
     departmentRepository.deleteById(id);
 }
}

