import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    employeeId: "",
    email: "",
    mobileNumber: "",
    userType: "user",
  });

  const formDataForSave = new FormData();
  formDataForSave.append("username", formData.username);
  formDataForSave.append("password", formData.password);
  formDataForSave.append("confirmPassword", formData.confirmPassword);
  formDataForSave.append("employeeId", formData.employeeId);
  formDataForSave.append("email", formData.email);
  formDataForSave.append("mobileNumber", formData.mobileNumber);
  formDataForSave.append("userType", formData.userType);

  const handleOtpSubmit = async () => {
    try {
      setOtpError("");
      const response = await axios.post(
        "http://13.201.102.118:8082/api/users/verify-otp",
        { username: formData.username, otp: otp }
      );

      console.log("dgdfdfgdfg", response.data.username);
      if (response.data.toLowerCase().includes("otp verified successfully")) {
        // Save the user in the database
        await saveUser();

        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: `USer registration  was successful!`,
          customClass: {
            popup: "max-width-100",
          },
        });

        navigate("/login");
        setShowOtpModal(false);
        console.log("User registration successful:", response.data);
      } else {
        // Handle OTP verification failure
        setOtpError("Invalid OTP. Please try again.");
        console.error("Invalid OTP:", response.data);
        Swal.fire({
          icon: "error",
          title: "OTP Verification Failed",
          text: "Invalid OTP. Please try again.",
          customClass: {
            popup: "max-width-100",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "An error occurred during registration. Please try again.",
        customClass: {
          popup: "max-width-100",
        },
      });

      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to save the user in the database
  const saveUser = async () => {
    try {
      // Assuming you have an endpoint to save the user after OTP verification
      await axios.post("http://13.201.102.118:8082/api/users/save", formDataForSave);
      console.log("User saved successfully!");
    } catch (error) {
      console.error("Error saving user:", error);
      // Handle the error as needed
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate input fields
    const newErrors = { ...errors };

    switch (name) {
      case "username":
        newErrors.username =
          value.length < 3 ? "Username must be 3 characters" : "";
  
        // Check if the username already exists
        try {
          const response = await axios.get(
            "http://13.201.102.118:8082/api/users/allUsernames"
          );
  
          if (response.data.includes(value)) {
            newErrors.username = "Username already exists";
          }
        } catch (error) {
          console.error("Error fetching usernames:", error);
        }
        break;
        case "employeeId":
          newErrors.employeeId ="";
            // Implement uniqueness check here (e.g., make an API call to check if the employee ID is unique)
            // If not unique, set newErrors.employeeId = 'Employee ID must be unique';
    
          // Check if the employee ID already exists
          try {
            const response = await axios.get(
              "http://13.201.102.118:8082/api/users/allEmployeeIds"
            );
    
            if (response.data.includes(value)) {
              newErrors.employeeId = "Employee ID already exists";
            }
          } catch (error) {
            console.error("Error fetching employee IDs:", error);
          }
          break;
      case "password":
        newErrors.password =
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          )
            ? "Password must be 8 characters "
            : "";
        newErrors.confirmPassword =
          formData.confirmPassword && value !== formData.confirmPassword
            ? "Passwords do not match"
            : "";
        break;

      case "confirmPassword":
        newErrors.confirmPassword =
          formData.password && value !== formData.password
            ? "Passwords do not match"
            : "";
        break;
        case "email":
          newErrors.email = !/^[a-z0-9.]+@[a-z]+\.[a-z]+$/.test(value)
            ? "Invalid email format"
            : "";
    
          // Check if the email already exists
          try {
            const response = await axios.get(
              "http://13.201.102.118:8082/api/users/allEmails"
            );
    
            if (response.data.includes(value)) {
              newErrors.email = "Email already exists";
            }
          } catch (error) {
            console.error("Error fetching emails:", error);
          }
          break;
    
    
      case "mobileNumber":
        newErrors.mobileNumber = !/^[6-9]\d{9}$/.test(value)
          ? "please enter a valid number"
          : "";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleUserTypeChange = (e) => {
    setFormData({ ...formData, userType: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the validation errors before submitting the form.",
        customClass: {
          popup: "max-width-100",
        },
      });
      return;
    }
    sendOtpToSuperUser();

    // Show OTP modal after successful registration
    setShowOtpModal(true);
  };
  const sendOtpToSuperUser = async () => {
    try {
      await axios.post("http://13.201.102.118:8082/api/users/send-otp", formData);
      // Assuming your server sends the OTP to the SuperUser's email
      console.log("OTP sent to SuperUser's email");
    } catch (error) {
      console.error("Error sending OTP to SuperUser's email:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-85  ">
      <form
        onSubmit={handleSubmit}
        className="p-4 border  "
        style={{
          minWidth: "300px",
          maxWidth: "750px",
          width: "100%",
          marginBottom: "80px",
        }}
      >
        <h2 className="mb-4 text-center">Registration</h2>

        <div className="row g-3 d-flex justify-content-center align-items-center  ">
          <div className="col-md-4 mb-2">
            <input
              placeholder="username"
              type="text"
              className="form-control border border-dark"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && (
              <div className="text-danger">{errors.username}</div>
            )}
          </div>
          <div className="col-md-4 mb-2">
            <input
              placeholder="Employee ID"
              type="text"
              className="form-control border border-dark "
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
            {errors.employeeId && (
              <div className="text-danger">{errors.employeeId}</div>
            )}
          </div>
        </div>
        <div className="row g-3 d-flex justify-content-center align-items-center">
          <div className="col-md-4 mb-2">
            <div className="input-group">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="form-control border border-dark border-left-0"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="input-group-append">
                <div
                  className="input-group-text cursor-pointer border border-dark rounded-left"
                  style={{
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-fill"></i>
                  ) : (
                    <i className="bi bi-eye-slash-fill"></i>
                  )}
                </div>
              </div>
            </div>
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>

          <div className="col-md-4 mb-2">
            <div className="input-group">
              <input
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control border border-dark border-right-0 rounded-right"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="input-group-append">
                <div
                  className="input-group-text cursor-pointer border border-dark rounded-left"
                  style={{
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0",
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <i className="bi bi-eye-fill"></i>
                  ) : (
                    <i className="bi bi-eye-slash-fill"></i>
                  )}
                </div>
              </div>
            </div>
            {errors.confirmPassword && (
              <div className="text-danger">{errors.confirmPassword}</div>
            )}
          </div>
        </div>
        <div className="row g-3 d-flex justify-content-center align-items-center">
          <div className="col-md-4 mb-2">
            <input
              placeholder="Email"
              type="email"
              className="form-control border border-dark"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="col-md-4 mb-2">
            <input
              placeholder="Mobile Number"
              type="tel"
              className="form-control border border-dark"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
            {errors.mobileNumber && (
              <div className="text-danger">{errors.mobileNumber}</div>
            )}
          </div>
        </div>
        <div className="mb-2   d-flex justify-content-center align-items-center">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input border border-dark"
              id="user"
              name="userType"
              value="user"
              checked={formData.userType === "user"}
              onChange={handleUserTypeChange}
            />
            <label className="form-check-label" htmlFor="user">
              User
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input m-1 border border-dark"
              id="admin"
              name="userType"
              value="admin"
              checked={formData.userType === "admin"}
              onChange={handleUserTypeChange}
            />
            <label className="form-check-label" htmlFor="admin">
              Admin
            </label>
          </div>
        </div>
        <div className="row g-3  d-flex justify-content-center align-items-center">
          <div className="col-md-4 ">
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
          <div className="col-md-4">
            <button
              type="button"
              className="btn btn-secondary w-100 "
              onClick={handleCancel}
            >
              Cancel
            </button>
            <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Enter OTP</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowOtpModal(false)}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleOtpSubmit}>
                  Submit OTP
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
