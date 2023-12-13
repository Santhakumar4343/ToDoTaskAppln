package com.todo.Service;


import java.util.List;

import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;

public interface UserService {

 List<User> getAllUsers();

 User getUserById(Long userId);

 User createUser(User user);

 User updateUser(Long userId, User user);

 void deleteUser(Long userId);
 User login(String username, String password) throws AuthException;

 void generateOtpAndSendEmail(User user);
 

 public User verifyOtpWithoutUsername(String otp) throws AuthException;


}
