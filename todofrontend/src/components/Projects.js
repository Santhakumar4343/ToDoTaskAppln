import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Table,
  FormControl,
  Alert,
} from "react-bootstrap";
import Swal from "sweetalert2";
import moment from "moment";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css"
function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [userToRemove, setUserToRemove] = useState("");

  useEffect(() => {
    // Fetch the list of users when the component mounts
    fetch("http://localhost:8082/api/users/userType/user")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  const [selectedProject, setSelectedProject] = useState({
    projectName: "",
    assignedTo: [],
    actionItem: "",
    status: "",
    startDate: "",
    priority: "",
    closedDate: "",
    remarks: "",
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject({
      projectName: "",
      assignedTo: [],
      actionItem: "",
      status: "",
      startDate: "",
      priority: "",
      closedDate: "",
      remarks: "",
    });
  };


  //   //filter Project
  //   const filteredProjects = projects.filter((project) =>
  //   project.assignedTo.some((user) =>
  //     user.toLowerCase().includes(searchTerm.toLowerCase())
  //   ) ||
  //   project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   project.status.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredProjects = projects.filter((project) => {
    const projectName = project.projectName && project.projectName.toLowerCase();
    const assignedTo = project.assignedTo && project.assignedTo.map((user) => user.toLowerCase());
    const status = project.status && project.status.toLowerCase();

    return (
      (projectName && projectName.includes(searchTerm.toLowerCase())) ||
      (assignedTo && assignedTo.some((user) => user.includes(searchTerm.toLowerCase()))) ||
      (status && status.includes(searchTerm.toLowerCase()))
    );
  });

  useEffect(() => {
    // Fetch the projects when the component mounts
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    // Make a GET request to fetch projects
    fetch("http://localhost:8082/api/projects/getAllProjects")
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched projects to the state
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        // Handle the error
      });
  };

  const handleSaveProject = () => {
    const formData = new FormData();
    selectedProject.startDate = moment(selectedProject.startDate).format("YYYY-MM-DD");
    selectedProject.closedDate = moment(selectedProject.closedDate).format("YYYY-MM-DD");
  
    Object.entries(selectedProject).forEach(([key, value]) => {
      // Convert assignedTo array to a comma-separated string
      if (key === "assignedTo" && Array.isArray(value)) {
        value = value.join(',');
      }
      formData.append(key, value);
    });

    const apiUrl = selectedProject.id
      ? `http://localhost:8082/api/projects/update/${selectedProject.id}`
      : "http://localhost:8082/api/projects/save";

    const method = selectedProject.id ? "PUT" : "POST";

    fetch(apiUrl, {
      method,
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Show success message if the request is successful
          Swal.fire({
            icon: "success",
            title:
              "Project " +
              (selectedProject.id ? "Updated" : "Created") +
              " Successfully",
            text: `The project has been ${selectedProject.id ? "updated" : "created"
              } successfully!`,
            customClass: {
              popup: "max-width-100",
            },
          });

          // After saving, fetch the updated list of projects
          fetchProjects();

          // Close the modal after saving
          handleCloseModal();
        } else {
          // Show error message if the request is not successful
          Swal.fire({
            icon: "error",
            title: "Operation Failed",
            text: `An error occurred during the ${selectedProject.id ? "update" : "creation"
              } of the project. Please try again.`,
            customClass: {
              popup: "max-width-100",
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error saving project:", error);
        // Handle the error
      });
  };

  const handleUpdateProject = (projectId) => {
    // Find the selected project
    const selectedProject = projects.find(
      (project) => project.id === projectId
    );
  
    // Format start and end dates before setting them in the state
    const formattedStartDate = selectedProject.startDate
      ? moment(selectedProject.startDate).format("YYYY-MM-DD")
      : "";
    const formattedClosedDate = selectedProject.closedDate
      ? moment(selectedProject.closedDate).format("YYYY-MM-DD")
      : "";
  
    // Set the selected project with formatted dates to update
    setSelectedProject({
      ...selectedProject,
      startDate: formattedStartDate,
      closedDate: formattedClosedDate,
    });
  
    // Show the modal for updating the project
    handleShowModal();
  };
  

  const handleDeleteProject = (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "max-width-100",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Make a DELETE request to delete the project
        fetch(`http://localhost:8082/api/projects/delete/${projectId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              console.log("Project deleted successfully");
              // Fetch the updated list of projects after deletion
              fetchProjects();
              // Close the initial confirmation dialog
              Swal.close();
              // Inform the user about the successful deletion
              Swal.fire({
                icon: "success",
                title: "Project Deleted",
                text: "The project has been deleted successfully!",
                customClass: {
                  popup: "max-width-100",
                },
              });
            } else {
              console.error("Error deleting project:", response.status);
              Swal.fire({
                icon: "error",
                title: "Error Deleting Project",
                text: "An error occurred during deletion. Please try again.",
                customClass: {
                  popup: "max-width-100",
                },
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting project:", error);
            Swal.fire({
              icon: "error",
              title: "Error Deleting Project",
              text: "An error occurred during deletion. Please try again.",
              customClass: {
                popup: "max-width-100",
              },
            });
          });
      }
    });
  };
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);

  // Function to handle showing the assign user modal
  const handleShowAssignUserModal = () => setShowAssignUserModal(true);

  // Function to handle closing the assign user modal
  const handleCloseAssignUserModal = () => setShowAssignUserModal(false);

  // Function to handle assigning a user to the project
  const handleAssignUser = (projectId) => {
    // Set the selected project for assigning users
    const selectedProject = projects.find((project) => project.id === projectId);
    setSelectedProject(selectedProject);

    // Show the assign user modal
    handleShowAssignUserModal();
  };
  const handleSaveAssignUser = () => {
    // Make sure there are assigned users to save
    if (selectedProject.assignedTo.length === 0) {
      // Handle the case where no users are selected
      console.error('No users selected for assignment.');
      return;
    }
    // Check if there's a user to remove
    if (userToRemove) {
      // Remove the selected user from the assignedTo array
      const updatedAssignedTo = selectedProject.assignedTo.filter(
        (user) => user !== userToRemove
      );

      // Update the assignedTo array in the selected project
      setSelectedProject({
        ...selectedProject,
        assignedTo: updatedAssignedTo,
      });
    }
    // Prepare the form data
    const formData = new FormData();
    formData.append('assignedTo', selectedProject.assignedTo.join(',')); // Convert the array to a comma-separated string

    // Make a PUT request to your backend API to assign users to the project
    fetch(`http://localhost:8082/api/projects/assign-user/${selectedProject.id}`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          // Show success message if the request is successful
          Swal.fire({
            icon: "success",
            title: "Users Assigned",
            text: `"${selectedProject.assignedTo}" have been assigned to the "${selectedProject.projectName}" successfully!`,
            customClass: {
              popup: "max-width-100",
            },
          });
          fetchProjects();
          // Optionally, you may want to update the frontend with the latest data
          // Fetch the updated list of projects or update the state accordingly
        } else {
          // Show error message if the request is not successful
          Swal.fire({
            icon: "error",
            title: "Assignment Failed",
            text: `Selected user already assigned to the ${selectedProject.projectName}.`,
            customClass: {
              popup: "max-width-100",
            },
          });
        }
      })
      .catch(error => {
        console.error('Error assigning users:', error);
        // Handle the error
        Swal.fire({
          icon: "error",
          title: "Assignment Failed",
          text: `An error occurred during the assignmentto the "${selectedProject.projectName}"Please try again.`,
          customClass: {
            popup: "max-width-100",
          },
        });
      })
      .finally(() => {
        // Close the modal after handling the assignment
        handleCloseAssignUserModal();
      });
  };

  const handleRemoveUser = () => {
    // Check if there's a user to remove
    if (userToRemove) {
      // Show a confirmation dialog before proceeding with the removal
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to remove user "${userToRemove}" from the project "${selectedProject.projectName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'max-width-100',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // If the user confirms, proceed with the removal
          fetch(`http://localhost:8082/api/projects/remove-user/${selectedProject.id}?userToRemove=${userToRemove}`, {
            method: 'DELETE',
          })
            .then((response) => {
              if (response.ok) {
                // Show success message if the request is successful
                Swal.fire({
                  icon: 'success',
                  title: 'User Removed',
                  text: `User "${userToRemove}" has been removed from the "${selectedProject.projectName}" successfully!`,
                  customClass: {
                    popup: 'max-width-100',
                  },
                });
                fetchProjects();
              } else {
                // Show error message if the request is not successful
                Swal.fire({
                  icon: 'error',
                  title: 'Removal Failed',
                  text: `Error removing user "${userToRemove}" from the project.`,
                  customClass: {
                    popup: 'max-width-100',
                  },
                });
              }
            })
            .catch((error) => {
              console.error('Error removing user:', error);
              // Handle the error
              Swal.fire({
                icon: 'error',
                title: 'Removal Failed',
                text: `An error occurred while removing user "${userToRemove}". Please try again.`,
                customClass: {
                  popup: 'max-width-100',
                },
              });
            })
            .finally(() => {
              // Close the modal after handling the removal
              handleCloseAssignUserModal();
            });
        }
      });
    } else {
      // Handle the case where no user is selected for removal
      console.error('No user selected for removal.');
    }
  };
  
  const [projectNameError, setProjectNameError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (!selectedProject.projectName) {
      setProjectNameError("Project Name is required");
      isValid = false;
    } else {
      setProjectNameError("");
    }

    if (selectedProject.assignedTo.length === 0) {
      setAssignedToError("Assigned Person is required");
      isValid = false;
    } else {
      setAssignedToError("");
    }

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      handleSaveProject();
    } else {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in the required fields.",
        customClass: {
          popup: "max-width-100",
        },
      });
    }
  };
  return (
    <div>
      <h4 className="text-center ">Projects Component</h4>
      <Button variant="success" className="mb-3" onClick={handleShowModal}>
        Create Project
      </Button>
      <FormControl
        type="text"
        placeholder="Search by Project Name, Assigned To, or Status"
        className="mb-4 "
        style={{ border: "1px solid black" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredProjects.length === 0 && searchTerm !== "" ? (
        <Alert variant="danger text-center" className="mb-3">
          No results found for "{searchTerm}".
        </Alert>
      ) : (
        <Table
          striped
          bordered
          hover
          className="text-center border border-dark"
        >
          <thead>
            <tr>
              <th className=" border border-dark h6 ">Project Name</th>
              <th className=" border border-dark h6">Assigned To</th>
              <th className=" border border-dark h6">Status</th>
              <th className=" border border-dark h6">Priority</th>
              <th className=" border border-dark h6">Planned Start Date</th>
              <th className=" border border-dark h6">Planned Closed Date</th>
              <th className=" border border-dark h6">Comments</th>
              <th className=" border border-dark h6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td className="text-center">{project.projectName}</td>
                <td className="text-center">
                  <ol>
                    {project.assignedTo.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ol>
                </td>
                <td className="text-center">{project.status}</td>
                <td className="text-center">{project.priority}</td>
                <td className="text-center">
                  {moment(project.startDate).format("DD-MM-YYYY")}
                </td>
                <td className="text-center">
                  {moment(project.closedDate).format("DD-MM-YYYY")}
                </td>
                <td style={{ maxWidth: "200px", overflowX: "auto" }}>
                  {project.remarks}
                </td>
                <td>
                  <i
                    className="bi bi-pencil fs-4 table-icon"
                    onClick={() => handleUpdateProject(project.id)}
                  ></i>{" "}
                  <i
                    className="bi bi-trash3 fs-4 m-2 text-danger table-icon"
                    onClick={() => handleDeleteProject(project.id)}
                  ></i>
                  <i
                    className="bi bi-person-plus fs-4 table-icon"
                    onClick={() => handleAssignUser(project.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProject.id ? "Update Project" : "Create Project"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                {" "}
                <Form.Label>Project Name</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formProjectName">
                  <Form.Control

                    type="text"
                    value={selectedProject.projectName}
                    className="border border-dark mb-3"
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        projectName: e.target.value,
                      })
                    }
                  />
                  <Form.Text className="text-danger">{projectNameError}</Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>Assigned Person</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formAssignedTo">

                  <Form.Control
                    as="select"
                    value={selectedProject.assignedTo}
                    className="border border-dark mb-3"
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        assignedTo: Array.from(e.target.selectedOptions, (option) => option.value),
                      })
                    }
                  >

                    <option value="">Select Assigned To</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.username}>
                        {user.username}
                      </option>
                    ))}

                  </Form.Control>
                  <Form.Text className="text-danger">{assignedToError}</Form.Text>
                </Form.Group>
              </Col>
            </Row>

           <Row>
              <Col md={4}>
                {" "}
                <Form.Label>Planned Start Date</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formStartDate">
                  <Form.Control
                    type="date"
                    className="border border-dark mb-3"
                    placeholder="Planned Start Date"
                    value={selectedProject.startDate}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        startDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                {" "}
                <Form.Label>Planned End date</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formClosedDate">
                  <Form.Control
                    type="date"
                    placeholder="Planned Closed Date"
                    className="border border-dark mb-3"
                    value={selectedProject.closedDate}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        closedDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                {" "}
                <Form.Label>Status</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formStatus">
                  <Form.Select
                    className="border border-dark mb-3"
                    value={selectedProject.status}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Fix/Fixed">Fix/Fixed</option>
                    <option value="Reopened">Reopened</option>
                    <option value="Closed">Closed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Label>Priority</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formPriority">
                  <Form.Select
                    className="border border-black mb-3"
                    value={selectedProject.priority}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4} className="sans-serif-bold">
                {" "}
                <Form.Label>Remarks</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formRemarks">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Remarks"
                    className="border border-dark mb-3"
                    value={selectedProject.remarks}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        remarks: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className=" d-flex justify-content-center align-items-center">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {selectedProject.id ? "Update Project" : "Save Project"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAssignUserModal} onHide={handleCloseAssignUserModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Assign Users to Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className>
          <Form>
            <Form.Group controlId="formAssignUser">
              <Form.Control
                as="select"
                className="border border-dark"
                onChange={(e) =>
                  setSelectedProject({
                    ...selectedProject,
                    assignedTo: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                    selectedUser: e.target.value, // Add this line to store the selected user
                  })
                }
              >
                {/* Include a default option for selecting users */}
                <option value="">Select User to Assign</option>
                {users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" className="mt-4 "  style={{marginLeft:"160px"}}onClick={handleSaveAssignUser}>
            Assign User
          </Button>
            <Form.Group controlId="formRemoveUser">
            <Modal.Title className="mt-4">Remove Users From Project</Modal.Title>
              <Form.Control
                as="select"
                className="border border-dark mt-3"
                value={userToRemove}
                onChange={(e) => setUserToRemove(e.target.value)}
              >
                <option value="">Select User to Remove</option>
                {selectedProject.assignedTo.map((assignedUser) => (
                  <option key={assignedUser} value={assignedUser}>
                    {assignedUser}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex align-item-center justify-content-center">
          <Button variant="secondary" onClick={handleCloseAssignUserModal}>
            Close
          </Button>
         
          <Button
            variant="danger"
            onClick={() => handleRemoveUser(selectedProject.id, selectedProject.selectedUser)}
          >
            Remove User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Projects;
