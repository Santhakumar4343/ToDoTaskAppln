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
     return createdUser;
 }
 



 @Override
 public User updateUser(Long userId, User updatedUser) {
     Optional<User> optionalUser = userRepository.findById(userId);
     if (optionalUser.isPresent()) {
         User existingUser = optionalUser.get();
         
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
 public User updateUserProfile(Long userId, User updatedUser) {
     Optional<User> optionalUser = userRepository.findById(userId);
     if (optionalUser.isPresent()) {
         User existingUser = optionalUser.get();
         // Update fields as needed
         existingUser.setUsername(updatedUser.getUsername());
         existingUser.setManager(updatedUser.getManager());
         existingUser.setEmployeeId(updatedUser.getEmployeeId());
         existingUser.setEmail(updatedUser.getEmail());
         existingUser.setMobileNumber(updatedUser.getMobileNumber());
       

         return userRepository.save(existingUser);
     }
     return null; // User not found
 }
 @Override
 public User updateUserSuper(Long userId, User updatedUser) {
     Optional<User> optionalUser = userRepository.findById(userId);
     if (optionalUser.isPresent()) {
         User existingUser = optionalUser.get();
         // Update fields as needed
         existingUser.setUsername(updatedUser.getUsername());
         existingUser.setPassword(updatedUser.getPassword());
         
        
         existingUser.setEmail(updatedUser.getEmail());
         existingUser.setMobileNumber(updatedUser.getMobileNumber());
       
         return userRepository.save(existingUser);
     }
     return null; // User not found
 }

 @Override
 public void deleteUser(Long userId) {
     userRepository.deleteById(userId);
 }


 private final Map<String, String> otpCache = new ConcurrentHashMap<>();


 @Override
 public String generateOtpAndSendEmail(User user) {
     try {
         // Generate a random 6-digit OTP
         String otp = String.format("%06d", new Random().nextInt(1000000));

         // Save the OTP to the cache
         otpCache.put(user.getUsername(), otp);

         // Log the generated OTP for debugging (you can remove this in production)
         System.out.println("Generated OTP for user " + user.getUsername() + ": " + otp);

         // Return the generated OTP
         return otp;
     } catch (Exception e) {
         e.printStackTrace();
         return null; // Handle the case where OTP generation fails
     }
 }

 @Override
 public void sendOtpToSuperUser(User user) {
     // Retrieve the SuperUser's email from your database or configuration
     String superUserEmail = "santhakumar6787@gmail.com"; // Replace with actual SuperUser's email

     // Generate a random 6-digit OTP and save it to the cache
     String otp = generateOtpAndSendEmail(user);

     // Send the OTP via email to the SuperUser
     sendOtpEmail(superUserEmail, user.getUsername(), otp);
 }

 // Rest of your code remains unchanged

 private void sendOtpEmail(String to, String username, String otp) {
     SimpleMailMessage message = new SimpleMailMessage();
     message.setTo(to);
     message.setSubject("OTP Verification");
     message.setText("Hello " + username + ",\n\nThe requested OTP is: " + otp);
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
 public User updatePassword(Long userId, User updatedUser) {
     Optional<User> optionalUser = userRepository.findById(userId);
     if (optionalUser.isPresent()) {
         User existingUser = optionalUser.get();
         // Update the password field only
         existingUser.setPassword(updatedUser.getPassword());
         existingUser.setConfirmPassword(updatedUser.getConfirmPassword());

         // Save the updated user
         User savedUser = userRepository.save(existingUser);

         // Send the new password to the user's email
         sendNewPasswordEmail(existingUser.getEmail(), existingUser.getUsername(), updatedUser.getPassword());

         return savedUser;
     }
     return null;
 }

 private void sendNewPasswordEmail(String to, String username, String newPassword) {
     SimpleMailMessage message = new SimpleMailMessage();
     message.setTo(to);
     message.setSubject("Password Updated");
     message.setText("Hello " + username + ",\n\nYour password has been successfully updated.\nNew Password: " + newPassword);
     javaMailSender.send(message);
 }






}

