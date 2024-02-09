import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  FormControl,
  Alert,
  Col,
  Row,
} from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router";
import { API_BASE_URL } from "../Api";

const Modules = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  console.log(location);
  const { state: { username } = {} } = location;

  useEffect(() => {
    // Fetch the projects for the specific user when the component mounts
    fetchUserModules(username);
  }, [username]);
  const titleColors = ["#42ff75", "#3ba3ed", "#fc47ed", "#e82e44", "#f2fa5f","#f2a04e"];
  const fetchUserModules = (username) => {
    console.log("Fetching modules for user:", username);

    // Make a GET request to fetch user-specific projects
    fetch(
      `${API_BASE_URL}/api/modules/getUserModules?username=${username}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched projects:", data);

        // Set the fetched projects to the state
        setModules(data);

        // Set the first project as the selected project
        if (data.length > 0) {
          setSelectedProject(data[0]);

          // Fetch modules and tasks for all projects
         
        }
      })
      .catch((error) => {
        console.error("Error fetching user projects:", error);
        // Handle the error
      });
  };

  const filteredModules = modules.filter((module) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
  
    return (
      (module.moduleName && module.moduleName.toLowerCase().includes(lowerSearchTerm)) ||
      (module.status && module.status.toLowerCase().includes(lowerSearchTerm)) ||
      (module.remarks && module.remarks.toLowerCase().includes(lowerSearchTerm))
    );
  });
  const handleCreateModule = () => {
    setModuleName("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setRemarks("");
    setSelectedModuleId(null);
    // Make sure a project is selected before creating a module
    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    // Display the modal for creating a module
    setShowModal(true);
  };

  const handleUpdateModule = (moduleId) => {
    // Find the selected module by ID
    const selectedModule = modules.find((module) => module.id === moduleId);

    // Set the form fields with the selected module data
    setModuleName(selectedModule.moduleName);
    setStartDate(selectedModule.startDate);
    setEndDate(selectedModule.endDate);
    setStatus(selectedModule.status);
    setRemarks(selectedModule.remarks);
    setSelectedModuleId(moduleId);

    // Display the modal for updating the module
    setShowModal(true);
  };

  const handleSaveModule = () => {
    // Prepare module data using FormData
    const formData = new FormData();
    formData.append("projectId", selectedProject);
    formData.append("moduleName", moduleName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("status", status);
    formData.append("remarks", remarks);

    // Determine whether to create or update based on selectedModuleId
    const requestUrl = selectedModuleId
      ? `${API_BASE_URL}/api/modules/updateModule/${selectedModuleId}`
      : `${API_BASE_URL}/api/modules/saveModule/${selectedProject}`;

    // Use 'PUT' for updating
    const method = selectedModuleId ? "PUT" : "POST";

    // Send a request to create or update a module
    axios({
      method, // Use 'PUT' or 'POST' based on the condition
      url: requestUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("Module saved successfully:", response.data);
        Swal.fire({
          icon: "success",
          title:
            "Module " +
            (selectedModuleId ? "Updated" : "Created") +
            " Successfully",
          text: `The module has been ${
            selectedModuleId ? "updated" : "created"
          } successfully!`,
          customClass: {
            popup: "max-width-100",
          },
        });
        setShowModal(false);
        fetchUserModules();; // Fetch modules again to update the table
      })
      .catch((error) => {
        console.error("Error saving module:", error);
        setShowModal(false);
        Swal.fire({
          icon: "error",
          title: "Operation Failed",
          text: `An error occurred during the ${
            selectedModuleId ? "update" : "creation"
          } of the module. Please try again.`,
          customClass: {
            popup: "max-width-100",
          },
        });
      });
  };
  const handleDeleteModule = (moduleId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this module!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'max-width-100',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Make a DELETE request to delete the module
        fetch(`${API_BASE_URL}/api/modules/deleteModule/${moduleId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              console.log('Module deleted successfully');
              // Close the initial confirmation dialog
              Swal.close();
              // Inform the user about the successful deletion
              Swal.fire({
                icon: 'success',
                title: 'Module Deleted',
                text: 'The module has been deleted successfully!',
                customClass: {
                  popup: 'max-width-100',
                },
              });
              // Fetch the updated list of modules after deletion
              
            } else {
              console.error('Error deleting module:', response.status);
              Swal.fire({
                icon: 'error',
                title: 'Error Deleting Module',
                text: 'An error occurred during deletion. Please try again.',
                customClass: {
                  popup: 'max-width-100',
                },
              });
            }
          })
          .catch((error) => {
            console.error('Error deleting module:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error Deleting Module',
              text: 'An error occurred during deletion. Please try again.',
              customClass: {
                popup: 'max-width-100',
              },
            });
          });
      }
    });
  };
  

  return (
    <div>
      <h4 className="text-center ">Modules Component </h4>
      <FormControl
        type="text"
        placeholder="Search by Module Name, Remarks, or Status"
        className="mb-3 "
        style={{ border: "1px solid black" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
   {filteredModules.length === 0 ? (
  searchTerm !== "" ? (
    <Alert variant="danger text-center" className="mb-3">
      No results found for "{searchTerm}".
    </Alert>
  ) : (
    <Alert variant="info text-center" className="mb-3">
      No modules found.
    </Alert>
  )
) : (
  <div className="row">
    {filteredModules.map((module, index) => (
      <div className="col-md-4 mb-3" key={module.id}>
        <div className="card h-100 d-flex flex-column border border-dark"  style={{ backgroundColor: index < titleColors.length ? titleColors[index] : titleColors[index % titleColors.length] }}>
          <div className="card-body d-flex flex-column">
           
            <h5 className="card-title text-center" style={{ color: "black" }}>{module.moduleName}</h5>
            <p className="card-text" style={{ color: "black" }}><strong>Project Name: {(module.project.projectName)}</strong></p>
            <ul className="list-unstyled">
              <li><strong style={{ color: "black" }}>Assigned To:</strong></li>
              {module.assignedTo.map((user, userIndex) => (
                <li key={userIndex} style={{ color: "black" }}>{user}</li>
              ))}
            </ul>
           
            <p className="card-text" style={{ color: "black" }}><strong>Planned Start Date:</strong> {moment(module.startDate).format("DD-MM-YYYY")}</p>
            <p className="card-text" style={{ color: "black" }}><strong>Planned Closed Date:</strong> {moment(module.endDate).format("DD-MM-YYYY")}</p>
            <div className="flex-grow-1" style={{ overflowY: "auto", overflowX: "auto" }}>
              <p className="card-text" style={{ color: "black" }}><strong>Comments:</strong></p>
              <p className="card-text" style={{ color: "black" }}>{module.remarks}</p>
            </div>
          
            <div className="d-flex align-items-center justify-content-center">
                    <div className="card-text " style={{ color: "black" }}>
                      {module.status === "Closed" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{module.status}</button>
                      ) : module.status === "Open" ? (
                        <button className="btn btn-success" style={{ borderRadius: "20px" }}>{module.status}</button>
                      ) : (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{module.status}</button>
                      )}
                    </div>
                    <div className="card-text m-3" style={{ color: "black" }}>

                      {module.priority === "Critical" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{module.priority}</button>
                      ) : module.priority === "High" ? (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{module.priority}</button>
                      ) : module.priority === "Medium" ? (
                        <button className="btn btn-primary" style={{ borderRadius: "20px" }}>{module.priority}</button>
                      ) : (
                        <button className="btn btn-secondary" style={{ borderRadius: "20px" }}>{module.priority}</button>
                      )}
                    </div>
                  </div>

                
                
          </div>
        </div>
      </div>
    ))}
  </div>
)}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Update Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Label>Module Name</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formModuleName">
                  <Form.Control
                    type="text"
                    className="mb-3 border border-dark"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>Start Date</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formStartDate">
                  <Form.Control
                    type="date"
                    className=" mb-3 border border-dark"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                {" "}
                <Form.Label>End Date</Form.Label>
              </Col>
              <Col md={8}>
                {" "}
                <Form.Group controlId="formEndDate">
                  <Form.Control
                    type="date"
                    className=" mb-3 border border-dark"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Label>Status</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formStatus">
                  <Form.Control
                    type="text"
                    className=" mb-3 border border-dark"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Label>Remarks</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formRemarks">
                  <Form.Control
                    type="text"
                    className=" mb-3 border border-dark"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveModule}>
            Save Module
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Modules;
