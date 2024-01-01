package com.todo.UserServiceImpl;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.todo.Repository.UserRepository;
import com.todo.Service.UserService;
import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;



@Service
public class UserServiceImpl implements UserService {

 @Autowired
 private UserRepository userRepository;
 @Autowired
 private JavaMailSender javaMailSender;
 @Override
 public List<User> getAllUsers() {
     return userRepository.findAll();
 }

 @Override
 public User getUserById(Long userId) {
     Optional<User> optionalUser = userRepository.findById(userId);
     return optionalUser.orElse(null);
 }
 
 @Override
 public User createUser(User user) {
     // Check if a user with the same employeeId already exists
     if (userRepository.existsByEmployeeId(user.getEmployeeId())) {
         throw new RuntimeException("User with this employeeId already exists");
     }

     // Save the user
     User createdUser = userRepository.save(user);

     // Send OTP to the SuperUser's email
     sendOtpToSuperUser(createdUser);

     return createdUser;
 }
 



 @Override
 public User updateUser(Long userId, User updatedUser) {
     Optional<User> optionalUser = userRepository.findById(userId);
     if (optionalUser.isPresent()) {
         User existingUser = optionalUser.get();
         // Update fields as needed
         existingUser.setUsername(updatedUser.getUsername());
         existingUser.setPassword(updatedUser.getPassword());
         existingUser.setConfirmPassword(updatedUser.getConfirmPassword());
         existingUser.setEmployeeId(updatedUser.getEmployeeId());
         existingUser.setEmail(updatedUser.getEmail());
         existingUser.setMobileNumber(updatedUser.getMobileNumber());
         existingUser.setUserType(updatedUser.getUserType());

         return userRepository.save(existingUser);
     }
     return null; // User not found
 }

 @Override
 public void deleteUser(Long userId) {
     userRepository.deleteById(userId);
 }


 private final Map<String, String> otpCache = new ConcurrentHashMap<>();

// @Override
// public void generateOtpAndSendEmail(User user) {
//     // Generate a random 6-digit OTP
//     String otp = String.format("%06d", new Random().nextInt(1000000));
//
//     // Save the OTP to the cache 
//     otpCache.put(user.getUsername(), otp);
//
//     // Send the OTP via email
//     sendOtpEmail(user.getEmail(), otp);
// }
 @Override
 public String generateOtpAndSendEmail(User user) {
     try {
         // Generate a random 6-digit OTP
         String otp = String.format("%06d", new Random().nextInt(1000000));

         // Save the OTP to the cache
         otpCache.put(user.getUsername(), otp);

         // Log the generated OTP for debugging (you can remove this in production)
         System.out.println("Generated OTP for user " + user.getUsername() + ": " + otp);

         // Send the OTP via email
         sendOtpEmail(user.getEmail(), otp);

         // Return the generated OTP
         return otp;
     } catch (Exception e) {
         e.printStackTrace();
         return null; // Handle the case where OTP generation or email sending fails
     }
 }
 @Override
 public ResponseEntity<String> verifyOtp(String username, String enteredOtp) {
     try {
         System.out.println("Received OTP verification request with payload: " +
                 "username=" + username + ", otp=" + enteredOtp);

         // Retrieve the stored OTP from the cache
         String storedOtp = otpCache.get(username);
         System.out.println("Stored OTP: " + storedOtp);

         // Check if the storedOtp is null or empty
         if (storedOtp == null || storedOtp.isEmpty()) {
             return new ResponseEntity<>("Invalid OTP (Cache is empty)", HttpStatus.BAD_REQUEST);
         }

         // Compare the entered OTP with the stored OTP
         if (storedOtp.equals(enteredOtp)) {
             // OTP verification successful
        	 System.out.println("otp verified succefully");
             return new ResponseEntity<>("OTP verified successfully", HttpStatus.OK);
         } else {
             // OTP verification failed
        	 System.out.println("otp mismatch");
        	 return new ResponseEntity<>("Invalid OTP (Mismatch)", HttpStatus.BAD_REQUEST);
         }
     } catch (Exception e) {
         e.printStackTrace();
         System.out.println("otp verified failed");
         return new ResponseEntity<>("Failed to verify OTP", HttpStatus.INTERNAL_SERVER_ERROR);
     }
 }



 @Override
 public void sendOtpToSuperUser(User user) {
     // Retrieve the SuperUser's email from your database or configuration
     String superUserEmail = "p.devamatha2001@gmail.com"; // Replace with actual SuperUser's email

     // Generate a random 6-digit OTP and save it to the cache
     generateOtpAndSendEmail(user);

     // Send the OTP via email to the SuperUser
     sendOtpEmail(superUserEmail, otpCache.get(user.getUsername()));
 }


 private void sendOtpEmail(String to, String otp) {
     SimpleMailMessage message = new SimpleMailMessage();
     message.setTo(to);
     message.setSubject("OTP Verification");
     message.setText("Your OTP for login: " + otp);
     javaMailSender.send(message);
 }
 



 public User login(String username, String password) throws AuthException {
	    // Authenticate the user
	    User user = userRepository.findByUsernameAndPassword(username, password);

	    if (user != null) {
	        // Additional logic if needed (e.g., send OTP to email)
	        return user; // Return the authenticated user
	    } else {
	        throw new AuthException("Invalid login credentials");
	    }
	}



 

 





}

