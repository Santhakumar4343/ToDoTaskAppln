import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("http://localhost:8082/api/users/login", {
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
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
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
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ border: "1px solid black" }}
          />
        </Form.Group>

        <div className="mt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-50"
            disabled={loading}
            onClick={handleLogin}
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
              "Login"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
