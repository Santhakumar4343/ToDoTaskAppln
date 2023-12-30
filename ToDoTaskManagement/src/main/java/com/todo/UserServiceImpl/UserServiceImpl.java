package com.todo.UserServiceImpl;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
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
 public void sendOtpToSuperUser(User user) {
     // Retrieve the SuperUser's email from your database or configuration
     String superUserEmail = "p.devamatha2001@gmail.com"; // Replace with actual SuperUser's email

     // Generate a random 6-digit OTP
     String otp = String.format("%06d", new Random().nextInt(1000000));

     // Save the OTP to the cache or database (if needed)
     // Here, we'll assume you have a method to save the OTP to the database.

     // Send the OTP via email to the SuperUser
     sendOtpEmail(superUserEmail, otp);
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

 @Override
 public void generateOtpAndSendEmail(User user) {
     // Generate a random 6-digit OTP
     String otp = String.format("%06d", new Random().nextInt(1000000));

     // Save the OTP to the cache 
     otpCache.put(user.getUsername(), otp);

     // Send the OTP via email
     sendOtpEmail(user.getEmail(), otp);
 }

// @Override
// public void login(String username, String password) throws AuthException {
//     // Authenticate the user
//     User user = userRepository.findByUsernameAndPassword(username, password);
//
//     if (user != null) {
//         // Generate and send OTP
//         generateOtpAndSendEmail(user);
//     } else {
//         throw new AuthException("Invalid login credentials");
//     }
// }

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

 

 private void sendOtpEmail(String to, String otp) {
     SimpleMailMessage message = new SimpleMailMessage();
     message.setTo(to);
     message.setSubject("OTP Verification");
     message.setText("Your OTP for login: " + otp);
     javaMailSender.send(message);
 }
 
// @Override
// public boolean verifyOtpWithoutUsername(String otp) {
//    
//     for (Map.Entry<String, String> entry : otpCache.entrySet()) {
//         if (entry.getValue().equals(otp)) {
//           
//             otpCache.remove(entry.getKey());
//             return true;
//         }
//     }
//     return false;
// }
 
 public User verifyOtpWithoutUsername(String otp) throws AuthException {
	    for (Iterator<Map.Entry<String, String>> iterator = otpCache.entrySet().iterator(); iterator.hasNext();) {
	        Map.Entry<String, String> entry = iterator.next();
	        if (entry.getValue().equals(otp)) {
	            iterator.remove(); // Remove the entry from the cache
	            // Retrieve or create user details based on your logic
	            User user = new User(); // Replace with your logic or return a DTO if needed
	            return user;
	        }
	    }
	    throw new AuthException("Invalid OTP");
	}

 public boolean verifyOtpForSuperUser(VerificationRequest verificationRequest) {
	    // Retrieve the SuperUser's email from your database or configuration
	    String superUserEmail = "p.devamatha2001@gmail.com"; // Replace with actual SuperUser's email

	    // Retrieve the user-provided OTP and username from the request
	    String enteredOtp = verificationRequest.getOtp();
	    String enteredUsername = verificationRequest.getUsername();

	    // Retrieve the saved OTP from your cache or database based on the username
	    String savedOtp = // Retrieve the saved OTP for the given username

	    // Compare the entered OTP with the saved OTP
	    return enteredOtp.equals(savedOtp);
	}




}

