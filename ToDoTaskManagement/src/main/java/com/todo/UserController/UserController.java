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

import com.todo.Repository.UserRepository;
import com.todo.UserServiceImpl.UserServiceImpl;
import com.todo.entity.User;

import jakarta.security.auth.message.AuthException;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserServiceImpl userService;
	 @Autowired
	    private UserRepository userRepository;
	 private final Map<String, String> otpCache = new ConcurrentHashMap<>();
	 
	 
	 
	 
	 
	    @GetMapping("/userType/{type}")
	    public ResponseEntity<List<User>> getUsersByUserType(@PathVariable String type) {
	        List<User> users = userRepository.findByUserType(type);

	        if (users.isEmpty()) {
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        }

	        return new ResponseEntity<>(users, HttpStatus.OK);
	    }
	@GetMapping("/getAll")
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}

	@GetMapping("/get/{userId}")
	public ResponseEntity<User> getUserById(@PathVariable Long userId) {
		User user = userService.getUserById(userId);
		return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@PostMapping("/save")
	public ResponseEntity<User> createUser(@RequestParam String username, @RequestParam String password,
			@RequestParam String confirmPassword, @RequestParam String employeeId, @RequestParam String email,
			@RequestParam String mobileNumber, @RequestParam String userType) {
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
	public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestParam String username,
			@RequestParam String password, @RequestParam String confirmPassword, @RequestParam String employeeId,
			@RequestParam String email, @RequestParam String mobileNumber, @RequestParam String userType) {
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
		return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	@PutMapping("/update-user/{userId}")
	public ResponseEntity<User> updateUserSuper(@PathVariable Long userId,
			@RequestParam String username,
			@RequestParam String password, 
			
			
			@RequestParam String email,
			@RequestParam String mobileNumber
			) {
		User updatedUser = new User();
		updatedUser.setId(userId);
		updatedUser.setUsername(username);
		updatedUser.setPassword(password);
		
		
		updatedUser.setEmail(email);
		updatedUser.setMobileNumber(mobileNumber);
		User user = userService.updateUserSuper(userId, updatedUser);
		return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/delete/{userId}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
		userService.deleteUser(userId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/login")
	public ResponseEntity<User> login(@RequestParam String username, @RequestParam String password) {
	    try {
	        User authenticatedUser = userService.login(username, password);
	        return new ResponseEntity<>(authenticatedUser, HttpStatus.OK);
	    } catch (AuthException e) {
	        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	    }
	}



	


	@PostMapping("/send-otp")
	public ResponseEntity<String> sendOtpToSuperUser(@RequestBody User user) {
	    try {
	    	
	        userService.sendOtpToSuperUser(user);
	        return new ResponseEntity<>("OTP sent to SuperUser's email", HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Failed to send OTP to SuperUser's email", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	

	 @PostMapping("/verify-otp")
	    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> otpVerificationRequest) {
	        String username = otpVerificationRequest.get("username");
	        String enteredOtp = otpVerificationRequest.get("otp");
	        return userService.verifyOtp(username, enteredOtp);
	    }
	 @GetMapping("/allUsernames")
	    public List<String> getAllUsernames() {
	        return userRepository.findAllUsernames();
	    }

	    @GetMapping("/allEmails")
	    public List<String> getAllEmails() {
	        return userRepository.findAllEmails();
	    }

	   
	    @GetMapping("/allEmployeeIds")
	    public List<String> getAllEmployeeIds() {
	        return userRepository.findAllEmployeeIds();
	    }
	    @PutMapping("/update-password/{userId}")
	    public ResponseEntity<User> updatePassword(@PathVariable Long userId, @RequestParam String newPassword,@RequestParam String confirmNewPassword) {
	        User updatedUser = new User();
	        updatedUser.setId(userId);
	        updatedUser.setPassword(newPassword);
	        updatedUser.setConfirmPassword(confirmNewPassword);

	        User user = userService.updatePassword(userId, updatedUser);
	        return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	    @GetMapping("/get-user-id/{username}")
	    public ResponseEntity<Long> getUserIdByUsername(@PathVariable String username) {
	        User user = userRepository.findByUsername(username);

	        if (user != null) {
	            return new ResponseEntity<>(user.getId(), HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }
	    }



}
