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
import {  useLocation } from "react-router-dom";
import "./Department.css"
function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { state: { username } = {} } = location;
  const [selectedProject, setSelectedProject] = useState({
    projectName: "",
    assignedTo: "",
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
  //project search function
  // const filteredProjects = projects.filter(
  //   (project) =>
  //     project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     project.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     project.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Fetch the projects for the specific user when the component mounts
    fetchUserProjects(username);
  }, [username]);

  const fetchUserProjects = (username) => {
    console.log("Fetching projects for user:", username);

    // Make a GET request to fetch user-specific projects
    fetch(
      `http://localhost:8082/api/projects/getUserProjects?username=${username}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched projects:", data);
        // Set the fetched projects to the state
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching user projects:", error);
        // Handle the error
      });
  };

  const handleSaveProject = () => {
    const formData = new FormData();

    // Append each field to the FormData
    Object.entries(selectedProject).forEach(([key, value]) => {
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
          fetchUserProjects();

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
              fetchUserProjects();
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

  const titleColors = ["#42ff75", "#3ba3ed", "#fc47ed", "#e82e44", "#f2fa5f","#f2a04e"];
  return (
    <div>
      <h4 className="text-center ">Projects Component</h4>
      {/* <Button variant="success" className="mb-3" onClick={handleShowModal}>
        Create Project
      </Button> */}
      <FormControl
        type="text"
        placeholder="Search by Project Name, Assigned To, or Status"
        className="mb-4 mt-4"
        style={{ border: "1px solid black", position: 'relative' }} 
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <span style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
      <i class="bi bi-search"></i>
      </span>

      {filteredProjects.length === 0 ? (
        searchTerm !== "" ? (
          <Alert variant="danger text-center" className="mb-3">
            No results found for "{searchTerm}".
          </Alert>
        ) : (
          <Alert variant="info text-center" className="mb-3">
            No projects found.
          </Alert>
        )
      ) : (


        <div className="row">
          {filteredProjects.map((project, index) => (
            <div className="col-md-4 mb-3" key={project.id}>
              <div className="card h-100 d-flex flex-column border border-dark"  style={{ backgroundColor: index < titleColors.length ? titleColors[index] : titleColors[index % titleColors.length] }}>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center" style={{ color: "black" }}>{project.projectName}</h5>
                  <ul className="list-unstyled">
                    <li><strong style={{ color: "black" }}>Assigned To:</strong></li>
                    {project.assignedTo.map((user, userIndex) => (
                      <li key={userIndex} style={{ color: "black" }}>{user}</li>
                    ))}
                  </ul>
                 <p className="card-text" style={{ color: "black" }}><strong>Planned Start Date:</strong> {moment(project.startDate).format("DD-MM-YYYY")}</p>
                  <p className="card-text" style={{ color: "black" }}><strong>Planned Closed Date:</strong> {moment(project.closedDate).format("DD-MM-YYYY")}</p>
                  <div className="flex-grow-1" style={{ overflowY: "auto" }}>
                    <p className="card-text" style={{ color: "black" }}><strong>Comments:</strong></p>
                    <p className="card-text" style={{ color: "black" }}>{project.remarks}</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="card-text " style={{ color: "black" }}>
                      {project.status === "Closed" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{project.status}</button>
                      ) : project.status === "Open" ? (
                        <button className="btn btn-success" style={{ borderRadius: "20px" }}>{project.status}</button>
                      ) : (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{project.status}</button>
                      )}
                    </div>
                    <div className="card-text m-3" style={{ color: "black" }}>

                      {project.priority === "Critical" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{project.priority}</button>
                      ) : project.priority === "High" ? (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{project.priority}</button>
                      ) : project.priority === "Medium" ? (
                        <button className="btn btn-primary" style={{ borderRadius: "20px" }}>{project.priority}</button>
                      ) : (
                        <button className="btn btn-secondary" style={{ borderRadius: "20px" }}>{project.priority}</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


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
                {" "}
                <Form.Label>Assigned Person</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formAssignedTo">
                  <Form.Control
                    type="text"
                    value={selectedProject.assignedTo}
                    className="border border-dark mb-3"
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        assignedTo: e.target.value,
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
    </div>
  );
}

export default Projects;
