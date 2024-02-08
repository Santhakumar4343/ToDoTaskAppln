import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import {API_BASE_URL} from "../../Api.js";
function SuperUserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    resetPasswordModal();
    // Only close the modal if the reset password process is not ongoing
    if (!loading) {
      setShowModal(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!username || !newPassword) {
      setResetPasswordError("Both fields are required");
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/superuser/get/1`
      );
      const userData = response.data;

      
      if (userData.username === username) {
        sendOtpToSuperUser();
        console.log("OTP sent to the super user successfully");
        setShowOtpModal(true);
        setShowModal(false);
        setLoading(true);
        setResetPasswordError("");
      } else {
        setResetPasswordError("Username not found");
      }
    } catch (error) {
      console.error("Error during username verification:", error);
      setResetPasswordError("Error during username verification");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

      const response = await axios.get(
        `${API_BASE_URL}/api/superuser/get/1`
      );
      const userData = response.data;

      if (userData.username === username && userData.password === password) {
        console.log("Authentication successful");

        navigate("/superuserdashboard")
      } else {
        setError("Invalid username or password");
        Swal.fire({
          icon: "error",
          title: "Invalid username or password",
          text: "An error occurred during Login. Please try again.",
          customClass: {
            popup: "max-width-100",
          },
        });
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setError("Error during authentication");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      // Make a request to verify the OTP
      const otpVerificationResponse = await axios.post(
        `${API_BASE_URL}/api/superuser/verify-otp-for-superuser`,
        {
          username: username,
          otp: otp,
        }
      );

      // Check if OTP verification was successful
      if (otpVerificationResponse.status === 200) {
        Swal.fire({
          icon: "success",
          title: "OTP Verification Successful",
          text: "Your OTP has been verified successfully!",
          customClass: {
            popup: "max-width-100",
          },
        });
        setShowOtpModal(false);
        handleResetPasswordForSuperUser();
       
        
        handleShowModal();
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setOtpError("An error occurred during OTP verification. Please try again.");
    }
  };
 const resetPasswordModal=()=>{
  setUsername("");
  setNewPassword("");
 }
  const sendOtpToSuperUser = async () => {
    try {
      // Make a request to send OTP to the SuperUser
      await axios.post(
        `${API_BASE_URL}/api/superuser/send-otp-to-superuser`,
        {
          username: username,
        }
      );

      // Assuming your server sends the OTP to the SuperUser's email
      console.log("OTP sent to SuperUser's email");

      // Open the OTP modal after sending OTP
      setShowOtpModal(true);
    } catch (error) {
      console.error("Error sending OTP to SuperUser's email:", error);
    }
  };

  const resetOtpModal = () => {
    setOtp('');
    setOtpError('');
  };
  const handleResetPasswordForSuperUser = async () => {
    try {
      
     
      const resetResponse = await axios.post(
        `${API_BASE_URL}/api/superuser/reset-password/1`,
        {
          newPassword: newPassword,
        }
      );

      // Check if the password reset was successful
      if (resetResponse.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "Your password has been reset successfully!",
          customClass: {
            popup: "max-width-100",
          },
        });
        handleCloseModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Password Reset Failed",
          text: "An error occurred during the password reset. Please try again.",
          customClass: {
            popup: "max-width-100",
          },
        });
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      Swal.fire({
        icon: "error",
        title: "Password Reset Failed",
        text: "An error occurred during the password reset. Please try again.",
        customClass: {
          popup: "max-width-100",
        },
      });
    } finally {
      console.log("super user password updated successfully");
    }
  };
  
  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form
            onSubmit={handleSubmit}
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
            <h2>Login</h2>
            <div className="mt-3 mb-3">
              <input
                placeholder="username"
                type="text"
                id="username"
                className="form-control border border-dark"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                placeholder="password"
                type="password"
                id="password"
                className="form-control border border-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <p className="mt-2">
              <Link onClick={handleShowModal} to="#">
                Forgot Password?
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Modal className="mt-4" show={showModal} onHide={()=>{handleCloseModal();resetPasswordModal();}} keyboard={false} backdrop="static">
  <Modal.Header closeButton>
    <Modal.Title>Reset Password</Modal.Title>
  </Modal.Header>
  <form onSubmit={handleResetPassword}>
    <Modal.Body className=" border-0">
      <input
        type="text"
        placeholder="username"
        className="form-control border border-dark mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {resetPasswordError && (
        <div className="text-danger mt-2">{resetPasswordError}</div>
      )}
      <input
        type="password"
        placeholder="new password"
        className="form-control border border-dark"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
     
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-center align-items-center">
      <Button variant="secondary" onClick={handleCloseModal}>
        Close
      </Button>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        onClick={handleResetPassword}
      >
        {loading ? (
          <>
            <Spinner
              animation="border"
              size="sm"
              className="me-2"
              style={{ border: "1px solid black" }}
            />
            Loading...
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </Modal.Footer>
  </form>
</Modal>

      <Modal
        show={showOtpModal}
        onHide={() => {
          setShowOtpModal(false);
          resetOtpModal();
        }}
        backdrop="static"
        keyboard={false}
      >
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
          <Button variant="secondary" onClick={() => {setShowOtpModal(false); resetOtpModal();}}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOtpSubmit}>
            Submit OTP
          </Button>
        </Modal.Footer>
      </Modal>




    </div>
  );
}

export default SuperUserLogin;
