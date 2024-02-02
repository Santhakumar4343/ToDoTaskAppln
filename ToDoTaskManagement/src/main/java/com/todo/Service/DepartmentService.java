package com.todo.Service;

import java.util.List;

import com.todo.entity.Department;

public interface DepartmentService {
	 List<Department> getAllDepartments();
	    Department getDepartmentById(Long id);
	    Department createDepartment(Department department);
	    Department updateDepartment(Long id, Department department);
	    void deleteDepartment(Long id);
}
