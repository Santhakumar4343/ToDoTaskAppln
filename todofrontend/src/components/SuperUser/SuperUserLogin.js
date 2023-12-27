import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button,Spinner } from "react-bootstrap";

function SuperUserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Added showModal state
  const [newPassword, setNewPassword] = useState(""); // Added state for new password
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleResetPassword = async () => {
    try {
      setLoading(true); // Set loading to true during the password reset process

      // Make a request to reset the password
      const resetResponse = await axios.post(
        `http://localhost:8082/api/superuser/reset-password/1`,
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
      setLoading(false); // Set loading back to false after the password reset process
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:8082/api/superuser/get/1"
      );
      const userData = response.data;

      // Check if the entered username and password match the fetched user data
      if (userData.username === username && userData.password === password) {
        // Authentication successful - redirect to user dashboard or perform other actions
        console.log("Authentication successful");
        Swal.fire({
          icon: "success",
          title: "Login successfully",
          text: "Authentication successfully!",
          customClass: {
            popup: "max-width-100",
          },
        });
        navigate("/superuserdashboard");
        // Redirect to user dashboard or perform other actions
      } else {
        // Authentication failed - display error message
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
      

<Modal className="mt-4" show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Reset Password</Modal.Title>
  </Modal.Header>
  {/* Separate form for the modal */}
  <form onSubmit={handleResetPassword}>
    <Modal.Body className=" border-0">
      <input
        type="password"
        placeholder="password"
        className="form-control border border-dark"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </Modal.Body>  
    <Modal.Footer className="d-flex justify-content-center align-items-center">
      <Button variant="secondary" onClick={handleCloseModal}>
        Close
      </Button>
      {/* Trigger form submission when this button is clicked */}
      <button type="submit" className="btn btn-primary" disabled={loading}>
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
    </div>
  );
}

export default SuperUserLogin;
