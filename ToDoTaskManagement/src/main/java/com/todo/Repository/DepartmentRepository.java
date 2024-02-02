package com.todo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department,Long> {
	Optional<Department> findById(Long id);
	Department getDepartmentById(Long departmentId);
}
