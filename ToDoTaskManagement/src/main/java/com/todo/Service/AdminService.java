package com.todo.Service;


import java.util.List;

import org.springframework.http.ResponseEntity;

import com.todo.entity.Admin;
import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;

public interface AdminService {

 List<Admin> getAllUsers();

 Admin getUserById(Long userId);

 Admin createUser(Admin user);

 Admin updateUser(Long userId, Admin user);

 void deleteUser(Long userId);
 Admin login(String username, String password) throws AuthException;

 String generateOtpAndSendEmail(Admin user);
 
  void sendOtpToSuperUser(Admin user);
  public ResponseEntity<String> verifyOtp(String username, String enteredOtp);
}
