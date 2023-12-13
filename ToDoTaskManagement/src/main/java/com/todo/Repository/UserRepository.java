package com.todo.Repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmployeeId(String employeeId);
	boolean existsByEmployeeId(String employeeId);
	User findByUsernameAndPassword(String username, String password);
	User findByUsername(String username);
	

}

