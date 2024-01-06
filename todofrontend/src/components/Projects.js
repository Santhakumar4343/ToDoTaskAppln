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

function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

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
    closedDate: "",
    remarks: "",
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject({
      projectName: "",
      assignedTo: "",
      actionItem: "",
      status: "",
      startDate: "",
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

    // Set the selected project to update
    setSelectedProject(selectedProject);

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
            text: "Users have been assigned to the project successfully!",
            customClass: {
              popup: "max-width-100",
            },
          });

          // Optionally, you may want to update the frontend with the latest data
          // Fetch the updated list of projects or update the state accordingly
        } else {
          // Show error message if the request is not successful
          Swal.fire({
            icon: "error",
            title: "Assignment Failed",
            text: "An error occurred during the assignment. Please try again.",
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
          text: "An error occurred during the assignment. Please try again.",
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
                  {/* <Button variant="primary" className='mb-1' >
                    Update
                  </Button>  */}
                  <i
                    class="bi bi-pencil fs-4"
                    onClick={() => handleUpdateProject(project.id)}
                  ></i>{" "}
                  {/* <Button variant="danger" >
                    Delete
                  </Button> */}
                  <i
                    class="bi bi-trash3 fs-4 m-2 text-danger"
                    onClick={() => handleDeleteProject(project.id)}
                  ></i>
                  {/* <Button
            variant="primary"
            onClick={() => handleAssignUser(project.id)}
          >
            Assign User
          </Button> */}
                  <i class="bi bi-person-plus fs-4" onClick={() => handleAssignUser(project.id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {/* Modal for creating or updating a project */}
      <Modal show={showModal} onHide={handleCloseModal}>
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
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>Assigned Person</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formAssignedTo">
                  {/* <Form.Control
                    as="select"
                    value={selectedProject.assignedTo}
                    className="border border-dark mb-3"
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        assignedTo: Array.from(e.target.selectedOptions, (option) => option.value),
                      })
                    }
                    multiple // Enable multiple selection
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                  </Form.Control> */}
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
                  <Form.Control
                    type="text"
                    value={selectedProject.status}
                    className="border border-dark mb-3"
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        status: e.target.value,
                      })
                    }
                  />
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
          <Button variant="primary" onClick={handleSaveProject}>
            {selectedProject.id ? "Update Project" : "Save Project"}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showAssignUserModal} onHide={handleCloseAssignUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Users to Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAssignUser">
              <Form.Label>Select Users</Form.Label>
              <Form.Control
                as="select"

                onChange={(e) =>
                  setSelectedProject({
                    ...selectedProject,
                    assignedTo: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
              >
                {users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignUserModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveAssignUser}>
            Assign User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Projects;
