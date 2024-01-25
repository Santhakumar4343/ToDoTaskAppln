package com.todo.UserController;
import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.UserServiceImpl.SuperUserService;
import com.todo.entity.SuperUser;


@RestController
@RequestMapping("/api/superuser")

public class SuperUserController {
    @Autowired
    private SuperUserService superUserService;
    @Autowired
    private JavaMailSender javaMailSender;

   
    

    @PostMapping("/save")
    public ResponseEntity<SuperUser> saveSuperUser(@RequestBody SuperUser superUser) {
        SuperUser savedSuperUser = superUserService.saveSuperUser(superUser);
        return new ResponseEntity<>(savedSuperUser, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<SuperUser> getSuperUserById(@PathVariable Long id) {
        SuperUser superUser = superUserService.getSuperUserById(id);
        if (superUser != null) {
            return new ResponseEntity<>(superUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/reset-password/{id}")
    public ResponseEntity<String> resetPassword(@PathVariable Long id, @RequestBody String requestBody) {
        SuperUser superUser = superUserService.getSuperUserById(id);

        if (superUser != null) {
            // Extract the password value from the JSON payload
            String newPassword = extractPasswordFromJson(requestBody);

            // Update the user's password with the new password
            superUser.setPassword(newPassword);
            superUserService.saveSuperUser(superUser);

            // Send an email to the user with the new password
            sendPasswordResetEmail(superUser.getEmail(), newPassword);

            return new ResponseEntity<>("Password reset successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    private String extractPasswordFromJson(String requestBody) {  
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(requestBody);
            return jsonNode.get("newPassword").asText();
        } catch (IOException e) {
            // Handle the exception, e.g., log it or return a default password
            e.printStackTrace();
            return "defaultPassword";
        }
    }
    public void sendPasswordResetEmail(String userEmail, String newPassword) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(userEmail);
        mailMessage.setSubject("Password Reset");
        mailMessage.setText("Your new password is: " + newPassword);

        javaMailSender.send(mailMessage);

        System.out.println("Password reset email sent to: " + userEmail);
    }
    
    
    @PostMapping("/send-otp-to-superuser")
	public ResponseEntity<String> sendOtpToSuperUser(@RequestBody SuperUser user) {
	    try {
	    	
	    	superUserService.sendOtpToSuperUser(user);
	        return new ResponseEntity<>("OTP sent to SuperUser's email", HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Failed to send OTP to SuperUser's email", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
    
    
    @PostMapping("/verify-otp-for-superuser")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> otpVerificationRequest) {
        String username = otpVerificationRequest.get("username");
        String enteredOtp = otpVerificationRequest.get("otp");
        return superUserService.verifyOtp(username, enteredOtp);
    }

}

