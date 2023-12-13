package com.todo.UserController;

import java.util.List;

//UserController.java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.Service.UserService;
import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;

@RestController
@RequestMapping("/api/users")
public class UserController {

 @Autowired
 private UserService userService;

 @GetMapping
 public List<User> getAllUsers() {
     return userService.getAllUsers();
 }

 @GetMapping("/get/{userId}")
 public ResponseEntity<User> getUserById(@PathVariable Long userId) {
     User user = userService.getUserById(userId);
     return user != null
             ? new ResponseEntity<>(user, HttpStatus.OK)
             : new ResponseEntity<>(HttpStatus.NOT_FOUND);
 }

 @PostMapping("/save")
 public ResponseEntity<User> createUser(
         @RequestParam String username,
         @RequestParam String password,
         @RequestParam String confirmPassword,
         @RequestParam String employeeId,
         @RequestParam String email,
         @RequestParam String mobileNumber,
         @RequestParam String userType
 ) {
     User user = new User();
     user.setUsername(username);
     user.setPassword(password);
     user.setConfirmPassword(confirmPassword);
     user.setEmployeeId(employeeId);
     user.setEmail(email);
     user.setMobileNumber(mobileNumber);
     user.setUserType(userType);

     User createdUser = userService.createUser(user);
     return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
 }
 @PutMapping("/update/{userId}")
 public ResponseEntity<User> updateUser(
         @PathVariable Long userId,
         @RequestParam String username,
         @RequestParam String password,
         @RequestParam String confirmPassword,
         @RequestParam String employeeId,
         @RequestParam String email,
         @RequestParam String mobileNumber,
         @RequestParam String userType
 ) {
     User updatedUser = new User();
     updatedUser.setId(userId);  
     updatedUser.setUsername(username);
     updatedUser.setPassword(password);
     updatedUser.setConfirmPassword(confirmPassword);
     updatedUser.setEmployeeId(employeeId);
     updatedUser.setEmail(email);
     updatedUser.setMobileNumber(mobileNumber);
     updatedUser.setUserType(userType);

     User user = userService.updateUser(userId, updatedUser);
     return user != null
             ? new ResponseEntity<>(user, HttpStatus.OK)
             : new ResponseEntity<>(HttpStatus.NOT_FOUND);
 }

 @DeleteMapping("/delete/{userId}")
 public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
     userService.deleteUser(userId);
     return new ResponseEntity<>(HttpStatus.NO_CONTENT);
 }
 @PostMapping("/login")
 public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
     try {
         userService.login(username, password);
         return new ResponseEntity<>("Login successful. OTP sent to your email.", HttpStatus.OK);
     } catch (AuthException e) {
         return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
     }
 }
 
 
// @PostMapping("/verify-otp")
// public ResponseEntity<String> verifyOtpWithoutUsername(@RequestParam String otp) {
//     boolean otpVerified = userService.verifyOtpWithoutUsername(otp);
//	 if (otpVerified) {
//	     return new ResponseEntity<>("OTP verified. Login successful.", HttpStatus.OK);
//	 } else {
//	     return new ResponseEntity<>("Invalid OTP.", HttpStatus.UNAUTHORIZED);
//	 }
// }
 @PostMapping("/verify-otp")
 public ResponseEntity<?> verifyOtpWithoutUsername(@RequestParam String otp) {
     try {
         // Verify OTP and get user details
         User user = userService.verifyOtpWithoutUsername(otp);

         // If OTP is verified, return user details in the response
         return new ResponseEntity<>(user, HttpStatus.OK);
     } catch (AuthException e) {
         return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
     }
 }

 

}
