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

import com.todo.Repository.AdminRepository;
import com.todo.Service.AdminService;
import com.todo.entity.Admin;
import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;



@Service
public class AdminServiceImpl implements AdminService {

 @Autowired
 private AdminRepository adminRepository;
 @Autowired
 private JavaMailSender javaMailSender;
 @Override
 public List<Admin> getAllUsers() {
     return adminRepository.findAll();
 }

 @Override
 public Admin getUserById(Long userId) {
     Optional<Admin> optionalUser = adminRepository.findById(userId);
     return optionalUser.orElse(null);
 }
 
 @Override
 public Admin createUser(Admin user) {
     // Check if a user with the same employeeId already exists
     if (adminRepository.existsByEmployeeId(user.getEmployeeId())) {
         throw new RuntimeException("admin with this employeeId already exists");
     }
     // Save the user
     Admin createdUser = adminRepository.save(user);
     return createdUser;
 }
 



 @Override
 public Admin updateUser(Long userId, Admin updatedUser) {
     Optional<Admin> optionalUser = adminRepository.findById(userId);
     if (optionalUser.isPresent()) {
         Admin existingUser = optionalUser.get();
         // Update fields as needed
         existingUser.setUsername(updatedUser.getUsername());
         existingUser.setPassword(updatedUser.getPassword());
         existingUser.setConfirmPassword(updatedUser.getConfirmPassword());
         existingUser.setEmployeeId(updatedUser.getEmployeeId());
         existingUser.setEmail(updatedUser.getEmail());
         existingUser.setMobileNumber(updatedUser.getMobileNumber());
         existingUser.setUserType(updatedUser.getUserType());

         return adminRepository.save(existingUser);
     }
     return null; // User not found
 }
 @Override
 public Admin updateAdmin(Long userId, Admin updatedUser) {
     Optional<Admin> optionalUser = adminRepository.findById(userId);
     if (optionalUser.isPresent()) {
         Admin existingUser = optionalUser.get();
         // Update fields as needed
         existingUser.setUsername(updatedUser.getUsername());
         existingUser.setPassword(updatedUser.getPassword());
         existingUser.setEmail(updatedUser.getEmail());
         existingUser.setMobileNumber(updatedUser.getMobileNumber());
         return adminRepository.save(existingUser);
     }
     return null; // User not found
 }

 @Override
 public void deleteUser(Long userId) {
     adminRepository.deleteById(userId);
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
// @Override
// public String generateOtpAndSendEmail(User user) {
//     try {
//         // Generate a random 6-digit OTP
//         String otp = String.format("%06d", new Random().nextInt(1000000));
//
//         // Save the OTP to the cache
//         otpCache.put(user.getUsername(), otp);
//
//         // Log the generated OTP for debugging (you can remove this in production)
//         System.out.println("Generated OTP for user " + user.getUsername() + ": " + otp);
//
//         // Send the OTP via email
//         sendOtpEmail(user.getEmail(), user.getUsername(), otp);
//
//         // Return the generated OTP
//         return otp;
//     } catch (Exception e) {
//         e.printStackTrace();
//         return null; // Handle the case where OTP generation or email sending fails
//     }
// }
//
// @Override
// public void sendOtpToSuperUser(User user) {
//     // Retrieve the SuperUser's email from your database or configuration
//     String superUserEmail = "santhakumar41k@gmail.com"; // Replace with actual SuperUser's email
//
//     // Generate a random 6-digit OTP and save it to the cache
//     generateOtpAndSendEmail(user);
//
//     // Send the OTP via email to the SuperUser
//     sendOtpEmail(superUserEmail, user.getUsername(), otpCache.get(user.getUsername()));
// }
 @Override
 public String generateOtpAndSendEmail(Admin user) {
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
 public void sendOtpToSuperUser(Admin user) {
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




 public Admin login(String username, String password) throws AuthException {
	    // Authenticate the user
	    Admin user = adminRepository.findByUsernameAndPassword(username, password);

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
 public Admin updatePassword(Long userId, Admin updatedUser) {
     Optional<Admin> optionalUser = adminRepository.findById(userId);
     if (optionalUser.isPresent()) {
         Admin existingUser = optionalUser.get();
         // Update the password field only
         existingUser.setPassword(updatedUser.getPassword());
         existingUser.setConfirmPassword(updatedUser.getConfirmPassword());

         // Save the updated user
         Admin savedUser = adminRepository.save(existingUser);

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

