package com.todo.Service;


import java.util.List;

import org.springframework.http.ResponseEntity;

import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;

public interface UserService {

 List<User> getAllUsers();

 User getUserById(Long userId);

 User createUser(User user);

 User updateUser(Long userId, User user);

 void deleteUser(Long userId);
 User login(String username, String password) throws AuthException;

 String generateOtpAndSendEmail(User user);
 
  void sendOtpToSuperUser(User user);
  public ResponseEntity<String> verifyOtp(String username, String enteredOtp);
  User updatePassword(Long userId, User updatedUser);
}
