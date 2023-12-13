package com.todo.UserServiceImpl;

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
     
     if (userRepository.existsByEmployeeId(user.getEmployeeId())) {
         throw new RuntimeException("User with this employeeId already exists");
     }

     
     return userRepository.save(user);
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
         // Generate and send OTP
         generateOtpAndSendEmail(user);
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
 
 @Override
 public User verifyOtpWithoutUsername(String otp) throws AuthException {
     for (Map.Entry<String, String> entry : otpCache.entrySet()) {
         if (entry.getValue().equals(otp)) {
             otpCache.remove(entry.getKey());
             // Retrieve and return the authenticated user details
             return userRepository.findByUsername(entry.getKey());
         }
     }
     throw new AuthException("Invalid OTP");
 }

}

