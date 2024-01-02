import React, { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous error messages

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("http://13.201.102.118:8082/api/users/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const userData = await response.json();
        const userTypeLowerCase = userData.userType.toLowerCase();
        const userUsername = userData.username;

        if (userTypeLowerCase === "user") {
          // Navigate to the user dashboard with state (username)
          navigate("/user-dashboard", { state: { username: userUsername } });
        } else if (userTypeLowerCase === "admin") {
          // Navigate to the admin dashboard if needed
          navigate("/admin-dashboard");
        } else {
          console.error("Unknown userType:", userData.userType);
        }
      } else {
        // Set error message for invalid credentials
        setError("Invalid credentials");
        console.error("Login failed:", response.statusText);
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    } catch (error) {
      // Set error message for any other errors
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
      </Form>
    </div>
  );
};

export default Login;
