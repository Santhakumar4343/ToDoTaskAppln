import React, { useState } from "react";
import { Form, Button, Spinner,Modal, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error message
  const [formData, setFormData] = useState(new FormData());
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState('');
  const [forgotPasswordNewPassword, setForgotPasswordNewPassword] = useState('');
  const [forgotPasswordConfirmNewPassword, setForgotPasswordConfirmNewPassword] = useState('');

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    formData.set("userType", e.target.value);
  };
  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const handleForgotPasswordSubmit = async () => {
    try {
        // Make a backend request to get the user ID based on the entered username
        const response = await axios.get(`http://localhost:8082/api/admins/get-user-id/${forgotPasswordUsername}`);
        const userId = response.data;

        if (!userId) {
            // Handle the case where the user is not found
            console.error('User not found.');
            return;
        }

        const formData = new FormData();
        formData.append('newPassword', forgotPasswordNewPassword);
        formData.append('confirmNewPassword', forgotPasswordConfirmNewPassword);

        // Make a backend request to update the password
        const updatePasswordResponse = await axios.put(`http://localhost:8082/api/admins/update-password/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Handle success
        console.log('Password updated successfully:', updatePasswordResponse.data);

        // Additional logic...

        // Close the modal after the request is completed
        setShowForgotPasswordModal(false);
    } catch (error) {
        // Handle errors
        console.error('Failed to update password:', error.response.data);
        // Additional error handling...
    }
};


  // const handleLogin = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null); // Clear previous error messages


  //     formData.append("username", username);
  //     formData.append("password", password);


  //     const response = await fetch("http://localhost:8082/api/users/login", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const userData = await response.json();
  //       const userTypeLowerCase = userData.userType.toLowerCase();
  //       const userUsername = userData.username;

  //       if (userTypeLowerCase === "user") {
  //         // Navigate to the user dashboard with state (username)
  //         navigate("/user-dashboard", { state: { username: userUsername } });
  //       } else if (userTypeLowerCase === "admin") {
  //         // Navigate to the admin dashboard if needed
  //         navigate("/admin-dashboard");
  //       } else {
  //         console.error("Unknown userType:", userData.userType);
  //       }
  //     } else {
  //       // Set error message for invalid credentials
  //       setError("Invalid credentials");
  //       console.error("Login failed:", response.statusText);
  //       setTimeout(() => {
  //         setError(null);
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     // Set error message for any other errors
  //     setError("Login failed. Please try again later.");
  //     console.error("Login failed:", error);
  //     setTimeout(() => {
  //       setError(null);
  //     }, 2000);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        endpoint = "http://localhost:8082/api/users/login";
      } else if (userType === "admin") {
        endpoint = "http://localhost:8082/api/admins/login";
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

  return (
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
      
        <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPasswordModal}  backdrop="static" keyboard={false}>
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
              <Form.Control
                type="password"
                className="border border-dark mb-3"
                placeholder="New Password"
                value={forgotPasswordNewPassword}
                onChange={(e) => setForgotPasswordNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formForgotPasswordConfirmNewPassword">
              <Form.Control
                type="password"
                className="border border-dark mb-3"
                placeholder="Confirm New Password"
                value={forgotPasswordConfirmNewPassword}
                onChange={(e) => setForgotPasswordConfirmNewPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" className='text-center' onClick={handleForgotPasswordSubmit}>
              Submit
            </Button>
          </Modal.Body>
        </Modal>
        </div>
      </Form>

    </div>
  );
};

export default Login;
