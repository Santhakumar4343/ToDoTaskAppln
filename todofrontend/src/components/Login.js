import React, { useState } from "react";
import { Form, Button, Spinner, Modal, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error message
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(new FormData());
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState('');
  const [forgotPasswordNewPassword, setForgotPasswordNewPassword] = useState('');
  const [forgotPasswordConfirmNewPassword, setForgotPasswordConfirmNewPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    formData.set("userType", e.target.value);
  };
  const handleUserTypeChangeForForgotPassword = (e) => {
    setUserType(e.target.value);
    formData.set("userType", e.target.value);
  };
  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPasswordModal = () => {
    // Reset modal input data when it's closed
    setForgotPasswordUsername('');
    setForgotPasswordNewPassword('');
    setForgotPasswordConfirmNewPassword('');
    setShowForgotPasswordModal(false);
    resetModalDetails(); 
  };
  const handleForgotPasswordSubmit = async () => {
    try {
      const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(forgotPasswordNewPassword);

      if (!isPasswordValid) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Password',
          text:
            'Password must be 8 characters and include at least:\n' +
            'one lowercase letter (a-z)\n' +
            'one uppercase letter (A-Z)\n' +
            'one number (0-9)\n' +
            'one special character (!@#$%^&*)',
          customClass: {
            popup: 'max-width-100',
          },
        });
        return;
      }

      // Validate confirm password
      if (forgotPasswordNewPassword !== forgotPasswordConfirmNewPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Passwords do not match',
          text: 'The entered passwords do not match.',
          customClass: {
            popup: 'max-width-100',
          },
        });
        return;
      }
      sendOtpToSuperUser();
    } catch (error) {
    }
  };

  
  const handleUpdatePassword = async () => {
    try {
      let getUserIdEndpoint;
      let updatePasswordEndpoint;
  
      // Determine the appropriate API endpoints based on userType
      if (userType === "user") {
        getUserIdEndpoint = `http://13.233.111.56:8082/api/users/get-user-id/${forgotPasswordUsername}`;
        updatePasswordEndpoint = `http://13.233.111.56:8082/api/users/update-password`;
      } else if (userType === "admin") {
        getUserIdEndpoint = `http://13.233.111.56:8082/api/admins/get-user-id/${forgotPasswordUsername}`;
        updatePasswordEndpoint = `http://13.233.111.56:8082/api/admins/update-password`;
      } else {
        console.error("Unknown userType:", userType);
        return;
      }
  
      // Make a backend request to get the user ID based on the entered username
      const getUserIdResponse = await axios.get(getUserIdEndpoint);
      const userId = getUserIdResponse.data;
  
      if (!userId) {
        // Handle the case where the user is not found
        console.error('User not found.');
        Swal.fire({
          icon: 'error',
          title: 'User not found',
          text: `User with username ${forgotPasswordUsername} not found.`,
          customClass: {
            popup: 'max-width-100',
          },
        });
        return;
      }
  
      const formData = new FormData();
      formData.append('newPassword', forgotPasswordNewPassword);
      formData.append('confirmNewPassword', forgotPasswordConfirmNewPassword);
      formData.append('userType', userType);
  
      // Make a backend request to update the password
      const updatePasswordResponse = await axios.put(
        `${updatePasswordEndpoint}/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Password updated successfully:', updatePasswordResponse.data);
  
      Swal.fire({
        icon: 'success',
        title: 'Password updated',
        text: `Password updated successfully for ${forgotPasswordUsername}`,
        customClass: {
          popup: 'max-width-100',
        },
      });
  
      // Close the modal after the request is completed
      setShowForgotPasswordModal(false);
    } catch (error) {
      // Handle specific error cases
      console.error('Failed to update password:', error.response.data);
  
      let errorMessage = 'Failed to update the password';
  
      if (error.response.status === 404) {
        errorMessage = `User with username ${forgotPasswordUsername} not found.`;
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid input. Please check your data and try again.';
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        customClass: {
          popup: 'max-width-100',
        },
      });
    }
  };
  

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("userType", userType);

      let endpoint;

      if (userType === "user") {
        endpoint = "http://13.233.111.56:8082/api/users/login";
      } else if (userType === "admin") {
        endpoint = "http://13.233.111.56:8082/api/admins/login";
      } else {
        console.error("Unknown userType:", userType);
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const userData = await response.json();
        const userTypeLowerCase = userData.userType.toLowerCase();
        const userUsername = userData.username;

        if (userTypeLowerCase === "user") {
          navigate("/user-dashboard", { state: { username: userUsername } });
        } else if (userTypeLowerCase === "admin") {
          navigate("/admin-dashboard");
        } else {
          console.error("Unknown userType:", userData.userType);
        }
      } else {
        setError("Invalid credentials");
        console.error("Login failed:", response.statusText);
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    } catch (error) {
      setError("Login failed. Please try again later.");
      console.error("Login failed:", error);
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    navigate("/");
  };
  const handleCancelForgotPassword = () => {
    setShowForgotPasswordModal(false);
    resetModalDetails(); 
  };

  const sendOtpToSuperUser = async () => {
    try {
      const requestData = {
        username: forgotPasswordUsername,
        otp: otp,
        userType: userType,
      };
  
      // Determine the appropriate API endpoint based on userType
      const otpEndpoint = userType === "admin"
        ? 'http://13.233.111.56:8082/api/admins/send-otp-admin-forgot-password'
        : 'http://13.233.111.56:8082/api/users/send-otp-user-forgot-password';
  
      // Send OTP to the respective endpoint
      await axios.post(otpEndpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Assuming your server sends the OTP to the SuperUser's email
      console.log("OTP sent to SuperUser's email");
  
      // Open the OTP modal after sending OTP
      setShowOtpModal(true);
    } catch (error) {
      console.error("Error sending OTP to SuperUser's email:", error);
    }
  };
  



  const handleChange = async (e, inputName) => {
    const { value } = e.target;
    const newErrors = { ...errors };

    switch (inputName) {
      case "forgotPasswordNewPassword":
        newErrors.forgotPasswordNewPassword = value.length < 8 ? "Password must be 8 characters" : "";
        newErrors.forgotPasswordConfirmNewPassword =
          forgotPasswordConfirmNewPassword && value !== forgotPasswordConfirmNewPassword
            ? "Passwords do not match"
            : "";
        break;

      case "forgotPasswordConfirmNewPassword":
        const isConfirmPasswordValid = value === forgotPasswordNewPassword;
        newErrors.forgotPasswordConfirmNewPassword = isConfirmPasswordValid
          ? ''
          : 'Passwords do not match';
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleOtpSubmit = async () => {
    try {
        if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
            setOtpError("Invalid OTP. Please enter a 6-digit numeric code.");
            return;
        }

        const otpVerificationEndpoint =
            userType === "admin"
                ? 'http://13.233.111.56:8082/api/admins/verify-otp-admin-forgot-password'
                : 'http://13.233.111.56:8082/api/users/verify-otp-user-forgot-password';

        const otpVerificationResponse = await axios.post(otpVerificationEndpoint, {
            username: forgotPasswordUsername,
            otp: otp,
            userType: userType,
        });

        // Check for success based on the actual response structure
        if (otpVerificationResponse.data.includes("OTP verified successfully")) {
            // Handle success
            await handleUpdatePassword();
            setShowOtpModal(false);

            Swal.fire({
                icon: 'success',
                title: 'OTP Verified',
                text: 'OTP verification successful!',
                customClass: {
                    popup: 'max-width-100',
                },
            });
        } else {
            // Handle other scenarios, e.g., invalid OTP
            setOtpError("Invalid OTP. Please try again.");
            console.error("Invalid OTP:", otpVerificationResponse.data);

            Swal.fire({
                icon: 'error',
                title: 'OTP Verification Failed',
                text: 'Invalid OTP. Please try again.',
                customClass: {
                    popup: 'max-width-100',
                },
            });
        }
    } catch (error) {
        // Handle other errors
        console.error("Error verifying OTP:", error);

        setOtpError("Failed to verify OTP. Please try again.");

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to verify OTP. Please try again.',
            customClass: {
                popup: 'max-width-100',
            },
        });
    }
};
const resetModalDetails = () => {
  setForgotPasswordUsername('');
  setForgotPasswordNewPassword('');
  setForgotPasswordConfirmNewPassword('');
  setShowPassword(false);
  setShowConfirmPassword(false);
  setUserType('user'); // Reset to default value
  setErrors({}); // Reset errors
};
  const resetOtpModal = () => {
    setOtp(''); 
    setOtpError(''); 
  };
  return (
    <div>
      <marquee behavior="slide" direction="down" scrollamount="10">
        <h3 className="mb-4  text-center">Welcome to the To-Do List</h3>
      </marquee>

      <div className="container">

        <Form
          className="mx-auto mt-5"
          style={{
            maxWidth: "300px",
            border: "1px solid black",
            padding: "20px",
            marginTop: "100px",
            textAlign: "center",
            borderRadius: "2px",
          }}
        >
          <h4>Login</h4>
          <Form.Group controlId="formUsername">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ border: "1px solid black" }}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-4">
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: "1px solid black" }}
              />
              <div className="input-group-append">
                <div
                  className="input-group-text cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ border: "1px solid black", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-fill"></i>
                  ) : (
                    <i className="bi bi-eye-slash-fill"></i>
                  )}
                </div>
              </div>
            </div>
          </Form.Group>
          <div className=" mt-3   d-flex justify-content-center align-items-center">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input border border-dark"
                id="user"
                name="userType"
                value="user"
                checked={userType === "user"}
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
                checked={userType === "admin"}
                onChange={handleUserTypeChange}
              />
              <label className="form-check-label" htmlFor="admin">
                Admin
              </label>
            </div>

          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-50 m-2"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2 "
                    style={{ border: "1px solid black" }}
                  />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Button className=" btn btn-secondary w-50" onClick={handleCancel}>Cancel</Button>
          </div>
          <div className="mt-3 d-flex justify-content-center align-items-center">
            <Link to="#" onClick={handleForgotPasswordClick}>
              Forgot Password?
            </Link>

            <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPasswordModal} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title >Forgot Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="formForgotPasswordUsername">
                  <Form.Control
                    type="text"
                    className="border border-dark mb-3"
                    placeholder="Username"
                    value={forgotPasswordUsername}
                    onChange={(e) => setForgotPasswordUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formForgotPasswordNewPassword">
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      className="border border-dark mb-3"
                      placeholder="New Password"
                      value={forgotPasswordNewPassword}
                      onChange={(e) => {
                        setForgotPasswordNewPassword(e.target.value);
                        handleChange(e, 'forgotPasswordNewPassword');
                      }}
                    />
                    <div className="input-group-append">
                      <div
                        className="input-group-text cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ border: "1px solid black", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye-fill"></i>
                        ) : (
                          <i className="bi bi-eye-slash-fill"></i>
                        )}
                      </div>
                    </div>
                  </div>
                  {errors.forgotPasswordNewPassword && (
                    <div className="text-danger">{errors.forgotPasswordNewPassword}</div>
                  )}
                </Form.Group>

                <Form.Group controlId="formForgotPasswordConfirmNewPassword">
                  <div className="input-group">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      className="border border-dark mb-3"
                      placeholder="Confirm New Password"
                      value={forgotPasswordConfirmNewPassword}
                      onChange={(e) => {
                        setForgotPasswordConfirmNewPassword(e.target.value);
                        handleChange(e, 'forgotPasswordConfirmNewPassword');
                      }}
                    />
                    <div className="input-group-append">
                      <div
                        className="input-group-text cursor-pointer"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ border: "1px solid black", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                      >
                        {showConfirmPassword ? (
                          <i className="bi bi-eye-fill"></i>
                        ) : (
                          <i className="bi bi-eye-slash-fill"></i>
                        )}
                      </div>
                    </div>
                  </div>
                  {errors.forgotPasswordConfirmNewPassword && (
                    <div className="mt-2 text-danger">{errors.forgotPasswordConfirmNewPassword}</div>
                  )}
                </Form.Group>

                <div className=" mt-3   d-flex justify-content-center align-items-center">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input border border-dark"
                      id="user"
                      name="userType"
                      value="user"
                      checked={userType === "user"}
                      onChange={handleUserTypeChangeForForgotPassword}

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
                      checked={userType === "admin"}
                      onChange={handleUserTypeChangeForForgotPassword}
                    />
                    <label className="form-check-label" htmlFor="admin">
                      Admin
                    </label>
                  </div>
                </div>
                <div className="mt-2 d-flex align-item-center justify-content-center">
                  <Button className=" btn btn-secondary m-2" onClick={handleCancelForgotPassword}>Cancel</Button>
                  <Button variant="primary m-2" className='text-center' onClick={handleForgotPasswordSubmit}>
                    Submit
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            <Modal show={showOtpModal} onHide={() => {setShowOtpModal(false); resetOtpModal();}} backdrop="static" keyboard={false}>
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
                {otpError && <div className="text-danger mt-2">{otpError}</div>}
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
        </Form>

      </div>
    </div>
  );
};

export default Login;
