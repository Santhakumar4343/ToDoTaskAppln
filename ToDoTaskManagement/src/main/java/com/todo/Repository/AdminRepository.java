package com.todo.Repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.todo.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
	Optional<Admin> findByEmployeeId(String employeeId);
	boolean existsByEmployeeId(String employeeId);
	Admin findByUsernameAndPassword(String username, String password);
	Admin findByUsername(String username);
	 List<Admin> findByUserType(String userType);
	 @Query("SELECT u.username FROM Admin u")
	    List<String> findAllUsernames();

	    @Query("SELECT u.email FROM Admin u")
	    List<String> findAllEmails();

	    @Query("SELECT u.employeeId FROM Admin u")
	    List<String> findAllEmployeeIds();
}

