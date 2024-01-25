package com.todo.UserServiceImpl;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.todo.Repository.SuperUserRepository;
import com.todo.entity.SuperUser;


@Service
public class SuperUserService {
    @Autowired
    private SuperUserRepository superUserRepository;
    @Autowired
    private JavaMailSender javaMailSender;
    
    
    public String generateOtpAndSendEmail(SuperUser user) {
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
    
    
    public void sendOtpToSuperUser(SuperUser user) {
        // Retrieve the SuperUser's email from your database or configuration
        String superUserEmail = "santhakumar6787@gmail.com"; // Replace with actual SuperUser's email

        // Generate a random 6-digit OTP and save it to the cache
        String otp = generateOtpAndSendEmail(user);

        // Send the OTP via email to the SuperUser
        sendOtpEmail(superUserEmail, user.getUsername(), otp);
    }
    
    
    private void sendOtpEmail(String to, String username, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("OTP Verification");
        message.setText("Hello " + username + ",\n\nThe requested OTP is: " + otp);
        javaMailSender.send(message);
    }
    
    
   
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
  
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    public SuperUser saveSuperUser(SuperUser superUser) {
        // Additional logic if needed before saving
        return superUserRepository.save(superUser);
    }

    public SuperUser getSuperUserById(Long id) {
        return superUserRepository.findById(id).orElse(null);
    }

}

