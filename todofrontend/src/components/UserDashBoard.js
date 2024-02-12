import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";
import { Dropdown, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../Api";
import UserProjects from "./UserProjects";
import UserModules from "./UserModules";
import UserTasks from "./UserTasks";

function UserDashboard() {
  const location = useLocation();
  const { state: { userData } = {} } = location;

  const Navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [selectedNavLink, setSelectedNavLink] = useState("projects");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admins/userType/admin`)
      .then((response) => response.json())
      .then((data) => {
        setAdmins(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  const [editedUserData, setEditedUserData] = useState({
    username: userData ? userData.username : "",
    employeeId: userData ? userData.employeeId : "",
    email: userData ? userData.email : "",
    mobileNumber: userData ? userData.mobileNumber : "",
    manager: userData ? userData.manager : "",
  });
  const [errors, setErrors] = useState({
    username: "",
    employeeId: "",
    email: "",
    mobileNumber: "",
    manager: "",
  });

  const handleLogout = () => {
    window.history.replaceState(null, '', '/');
    Navigate('/');
  }

  const handleProfile = () => {
    setShowModal(true);
  }

  const handleNavLinkClick = (navLink, event) => {
    event.preventDefault();
    setSelectedNavLink(navLink);
  };

  const renderContent = () => {
    switch (selectedNavLink) {
      case "projects":
        return <UserProjects />;
      case "modules":
        return <UserModules />;
      case "tasks":
        return <UserTasks />;
      default:
        return null;
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value,
    });
    const newErrors = { ...errors };

    switch (name) {
      case "username":
        newErrors.username = value.length < 3 ? "Username must be 3 characters" : "";

        // Check if the username already exists
        try {
          const response = await axios.get(`${API_BASE_URL}/api/users/allUsernames`);

          if (response.data.includes(value)) {
            newErrors.username = "Username already exists";
          }
        } catch (error) {
          console.error("Error fetching usernames:", error);
        }
        break;
      case "employeeId":
        newErrors.employeeId = value.length === 0 ? "Employee ID is required" : "";

        // Check if the employee ID already exists
        try {
          const response = await axios.get(`${API_BASE_URL}/api/users/allEmployeeIds`);

          if (response.data.includes(value)) {
            newErrors.employeeId = "Employee ID already exists";
          }
        } catch (error) {
          console.error("Error fetching employee IDs:", error);
        }
        break;
      case "email":
        newErrors.email = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? "Invalid email format"
          : "";

        // Check if the email already exists
        try {
          const response = await axios.get(`${API_BASE_URL}/api/users/allEmails`);

          if (response.data.includes(value)) {
            newErrors.email = "Email already exists";
          }
        } catch (error) {
          console.error("Error fetching emails:", error);
        }
        break;
      case "mobileNumber":
        newErrors.mobileNumber = !/^[6-9]\d{9}$/.test(value)
          ? "Please enter a valid 10 digit number"
          : "";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleUserDataUpdate = async () => {
    // Check for errors
    for (const error of Object.values(errors)) {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fix the validation errors before updating the profile.',
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append('username', editedUserData.username);
    formData.append('employeeId', editedUserData.employeeId);
    formData.append('email', editedUserData.email);
    formData.append('mobileNumber', editedUserData.mobileNumber);
    formData.append('manager', editedUserData.manager);

    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile-update/${userData.id}`, formData);
      // Display success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!',
      });
      console.log("Profile updated successfully:", response.data);
      setShowModal(false);
    } catch (error) {
      // Display error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating profile. Please try again later.',
      });
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Side Navigation */}
        <div className="col-md-3" style={{ backgroundColor: "", padding: "20px", width: "200px", height: "400px", overflowY: "auto", borderColor: "1px" }}>
          <ul className="list-unstyled">
            <li className="mb-4">
              <button onClick={(e) => handleNavLinkClick("projects", e)} className="btn btn-link text-decoration-none text-dark fs-5">
                Projects
              </button>
            </li>
            <li className="mb-4">
              <button onClick={(e) => handleNavLinkClick("modules", e)} className="btn btn-link text-decoration-none text-dark fs-5">
                Modules
              </button>
            </li>
            <li className="mb-4">
              <button onClick={(e) => handleNavLinkClick("tasks", e)} className="btn btn-link text-decoration-none text-dark fs-5">
                Tasks
              </button>
            </li>
          </ul>
        </div>
        <div className="col-md-9" style={{ padding: "20px", position: "relative" }}>
          <div className="d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="userDropdown">
                <i className="bi bi-person-circle fs-7"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleProfile} style={{ fontSize: '14px', color: "red" }}>Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} style={{ fontSize: '14px', color: "red" }}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {renderContent()}
        </div>
      </div>
      {/* Modal for User Profile */}
      <Modal show={showModal} onHide={() => setShowModal(false)} keyboard={false} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Label>Username</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formUsername">

                  <Form.Control className="border border-dark mb-4" type="text" placeholder="Enter username" name="username" value={editedUserData.username} onChange={handleInputChange} />
                  {errors.username && <Form.Text className="text-danger">{errors.username}</Form.Text>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Label>Employee ID</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formEmployeeId">

                  <Form.Control className="border border-dark mb-4" type="text" placeholder="Enter employee ID" name="employeeId" value={editedUserData.employeeId} onChange={handleInputChange} />
                  {errors.employeeId && <Form.Text className="text-danger">{errors.employeeId}</Form.Text>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>Email</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formEmail">

                  <Form.Control  className="border border-dark mb-4" type="email" placeholder="Enter email" name="email" value={editedUserData.email} onChange={handleInputChange} />
                  {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>Mobile Number</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formMobileNumber">

                  <Form.Control  className="border border-dark mb-4" type="text" placeholder="Enter mobile number" name="mobileNumber" value={editedUserData.mobileNumber} onChange={handleInputChange} />
                  {errors.mobileNumber && <Form.Text className="text-danger">{errors.mobileNumber}</Form.Text>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>Manager</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formManager">

                  <Form.Control
                    as="select"
                    name="manager"
                    className="border border-dark mb-4"
                    value={editedUserData.manager}
                    onChange={handleInputChange} // Handle manager selection
                  >
                    <option value="">Select Manager</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.username}>
                        {admin.username}
                      </option>
                    ))}
                  </Form.Control>
                  {errors.manager && <Form.Text className="text-danger">{errors.manager}</Form.Text>}
                </Form.Group>
              </Col>
            </Row>






          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex align-items-center justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUserDataUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserDashboard;
