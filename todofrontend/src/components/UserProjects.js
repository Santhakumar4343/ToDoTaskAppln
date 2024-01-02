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
import { useNavigate, useParams, useLocation } from "react-router-dom";

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
  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Fetch the projects for the specific user when the component mounts
    fetchUserProjects(username);
  }, [username]);

  const fetchUserProjects = (username) => {
    console.log("Fetching projects for user:", username);

    // Make a GET request to fetch user-specific projects
    fetch(
      `http://13.201.102.118:8082/api/projects/getUserProjects?username=${username}`
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
      ? `http://13.201.102.118:8082/api/projects/update/${selectedProject.id}`
      : "http://13.201.102.118:8082/api/projects/save";

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
            text: `The project has been ${
              selectedProject.id ? "updated" : "created"
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
            text: `An error occurred during the ${
              selectedProject.id ? "update" : "creation"
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
    // Make a DELETE request to delete the project
    fetch(`http://13.201.102.118:8082/api/projects/delete/${projectId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Project deleted successfully");
          Swal.fire({
            icon: "success",
            title: "Project deleted successfully",
            text: "Project deleted successfully!",
            customClass: {
              popup: "max-width-100",
            },
          });
          // Fetch the updated list of projects after deletion
          fetchUserProjects();
        } else {
          console.error("Error deleting project:", response.status);
          Swal.fire({
            icon: "error",
            title: "Error deleting project",
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
          title: "Error deleting project",
          text: "An error occurred during deletion. Please try again.",
          customClass: {
            popup: "max-width-100",
          },
        });
      });
  };

  return (
    <div>
      <h4 className="text-center ">Projects Component</h4>
      {/* <Button variant="success" className="mb-3" onClick={handleShowModal}>
        Create Project
      </Button> */}
      <FormControl
        type="text"
        placeholder="Search by Project Name, Assigned To, or Status"
        className="mb-4 mt-4 "
        style={{ border: "1px solid black" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
                <td className="text-center">{project.assignedTo}</td>

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
                    class="bi bi-trash3 fs-4 m-2"
                    onClick={() => handleDeleteProject(project.id)}
                  ></i>
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
