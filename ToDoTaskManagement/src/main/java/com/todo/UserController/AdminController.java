package com.todo.UserController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

//UserController.java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.Repository.AdminRepository;
import com.todo.UserServiceImpl.AdminServiceImpl;
import com.todo.entity.Admin;
import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

	@Autowired
	private AdminServiceImpl adminService;
	 @Autowired
	    private AdminRepository adminRepository;
	 private final Map<String, String> otpCache = new ConcurrentHashMap<>();
	 
	 
	 
	 
	 
	    @GetMapping("/userType/{type}")
	    public ResponseEntity<List<Admin>> getUsersByUserType(@PathVariable String type) {
	        List<Admin> users = adminRepository.findByUserType(type);

	        if (users.isEmpty()) {
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        }

	        return new ResponseEntity<>(users, HttpStatus.OK);
	    }
	@GetMapping
	public List<Admin> getAllUsers() {
		return adminService.getAllUsers();
	}

	@GetMapping("/get/{userId}")
	public ResponseEntity<Admin> getUserById(@PathVariable Long userId) {
		Admin user = adminService.getUserById(userId);
		return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@PostMapping("/save")
	public ResponseEntity<Admin> createUser(@RequestParam String username, @RequestParam String password,
			@RequestParam String confirmPassword, @RequestParam String employeeId, @RequestParam String email,
			@RequestParam String mobileNumber, @RequestParam String userType) {
		Admin user = new Admin();
		user.setUsername(username);
		user.setPassword(password);
		user.setConfirmPassword(confirmPassword);
		user.setEmployeeId(employeeId);
		user.setEmail(email);
		user.setMobileNumber(mobileNumber);
		user.setUserType(userType);

		Admin createdUser = adminService.createUser(user);
		return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
	}

	@PutMapping("/update/{userId}")
	public ResponseEntity<Admin> updateUser(@PathVariable Long userId, @RequestParam String username,
			@RequestParam String password, @RequestParam String confirmPassword, @RequestParam String employeeId,
			@RequestParam String email, @RequestParam String mobileNumber, @RequestParam String userType) {
		Admin updatedUser = new Admin();
		updatedUser.setId(userId);
		updatedUser.setUsername(username);
		updatedUser.setPassword(password);
		updatedUser.setConfirmPassword(confirmPassword);
		updatedUser.setEmployeeId(employeeId);
		updatedUser.setEmail(email);
		updatedUser.setMobileNumber(mobileNumber);
		updatedUser.setUserType(userType);

		Admin user = adminService.updateUser(userId, updatedUser);
		return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/delete/{userId}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
		adminService.deleteUser(userId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/login")
	public ResponseEntity<Admin> login(@RequestParam String username, @RequestParam String password) {
	    try {
	        Admin authenticatedUser = adminService.login(username, password);
	        return new ResponseEntity<>(authenticatedUser, HttpStatus.OK);
	    } catch (AuthException e) {
	        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	    }
	}



	


	@PostMapping("/send-otp")
	public ResponseEntity<String> sendOtpToSuperUser(@RequestBody Admin user) {
	    try {
	    	
	        adminService.sendOtpToSuperUser(user);
	        return new ResponseEntity<>("OTP sent to SuperUser's email", HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Failed to send OTP to SuperUser's email", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
   

//	@PostMapping("/verify-otp")
//	public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> otpVerificationRequest) {
//	    try {
//	        String username = otpVerificationRequest.get("username");
//	        String enteredOtp = otpVerificationRequest.get("otp");
//	        System.out.println("Received OTP verification request with payload: " +
//	                "username=" + username + ", otp=" + enteredOtp);
//
//	        // Retrieve the stored OTP from the cache
//	        String storedOtp = otpCache.get(username);
//	        System.out.println("Stored OTP: " + storedOtp);
//
//	        // Check if the storedOtp is null or empty
//	        if (storedOtp == null || storedOtp.isEmpty()) {
//	            return new ResponseEntity<>("Invalid OTP (Cache is empty)", HttpStatus.BAD_REQUEST);
//	        }
//
//	        // Compare the entered OTP with the stored OTP
//	        if (storedOtp.equals(enteredOtp)) {
//	            // OTP verification successful
//	            return new ResponseEntity<>("OTP verified successfully", HttpStatus.OK);
//	        } else {
//	            // OTP verification failed
//	            return new ResponseEntity<>("Invalid OTP (Mismatch)", HttpStatus.BAD_REQUEST);
//	        }
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	        return new ResponseEntity<>("Failed to verify OTP", HttpStatus.INTERNAL_SERVER_ERROR);
//	    }
//	}
	 @PostMapping("/verify-otp")
	    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> otpVerificationRequest) {
	        String username = otpVerificationRequest.get("username");
	        String enteredOtp = otpVerificationRequest.get("otp");
	        return adminService.verifyOtp(username, enteredOtp);
	    }
	 @GetMapping("/allUsernames")
	    public List<String> getAllUsernames() {
	        return adminRepository.findAllUsernames();
	    }

	    // Endpoint to get all emails
	    @GetMapping("/allEmails")
	    public List<String> getAllEmails() {
	        return adminRepository.findAllEmails();
	    }

	    // Endpoint to get all employee IDs
	    @GetMapping("/allEmployeeIds")
	    public List<String> getAllEmployeeIds() {
	        return adminRepository.findAllEmployeeIds();
	    }

	    @PutMapping("/update-password/{userId}")
	    public ResponseEntity<Admin> updatePassword(@PathVariable Long userId, @RequestParam String newPassword,@RequestParam String confirmNewPassword) {
	        Admin updatedUser = new Admin();
	        updatedUser.setId(userId);
	        updatedUser.setPassword(newPassword);
	        updatedUser.setConfirmPassword(confirmNewPassword);

	        Admin user = adminService.updatePassword(userId, updatedUser);
	        return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	    @GetMapping("/get-user-id/{username}")
	    public ResponseEntity<Long> getUserIdByUsername(@PathVariable String username) {
	        Admin user = adminRepository.findByUsername(username);

	        if (user != null) {
	            return new ResponseEntity<>(user.getId(), HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }
	    }

}
