package com.todo.Repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.todo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmployeeId(String employeeId);
	boolean existsByEmployeeId(String employeeId);
	User findByUsernameAndPassword(String username, String password);
	User findByUsername(String username);
	 List<User> findByUserType(String userType);
	 @Query("SELECT u.username FROM User u")
	    List<String> findAllUsernames();

	    @Query("SELECT u.email FROM User u")
	    List<String> findAllEmails();

	    @Query("SELECT u.employeeId FROM User u")
	    List<String> findAllEmployeeIds();
}

