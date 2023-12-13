import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col, Table,FormControl ,Alert} from 'react-bootstrap';
import Swal from 'sweetalert2';
import moment from 'moment';

function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState({
    projectName: '',
    assignedTo: '',
    actionItem: '',
    status: '',
    startDate: '',
    closedDate: '',
    remarks: '',
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject({
      projectName: '',
      assignedTo: '',
      actionItem: '',
      status: '',
      startDate: '',
      closedDate: '',
      remarks: '',
    });
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    // Fetch the projects when the component mounts
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    // Make a GET request to fetch projects
    fetch('http://localhost:8082/api/projects/getAllProjects')
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched projects to the state
        setProjects(data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
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
      : 'http://localhost:8082/api/projects/save';

    const method = selectedProject.id ? 'PUT' : 'POST';

    fetch(apiUrl, {
      method,
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Show success message if the request is successful
          Swal.fire({
            icon: 'success',
            title: 'Project ' + (selectedProject.id ? 'Updated' : 'Created') + ' Successfully',
            text: `The project has been ${selectedProject.id ? 'updated' : 'created'} successfully!`,
            customClass: {
              popup: 'max-width-100',
            },
          });

          // After saving, fetch the updated list of projects
          fetchProjects();

          // Close the modal after saving
          handleCloseModal();
        } else {
          // Show error message if the request is not successful
          Swal.fire({
            icon: 'error',
            title: 'Operation Failed',
            text: `An error occurred during the ${selectedProject.id ? 'update' : 'creation'} of the project. Please try again.`,
            customClass: {
              popup: 'max-width-100',
            },
          });
        }
      })
      .catch((error) => {
        console.error('Error saving project:', error);
        // Handle the error
      });
  };


  const handleUpdateProject = (projectId) => {
    // Find the selected project
    const selectedProject = projects.find((project) => project.id === projectId);

    // Set the selected project to update
    setSelectedProject(selectedProject);

    // Show the modal for updating the project
    handleShowModal();
  };

  // const handleDeleteProject = (projectId) => {
  //   // Make a DELETE request to delete the project
  //   fetch(`http://localhost:8082/api/projects/delete/${projectId}`, {
  //     method: 'DELETE',
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         console.log('Project deleted successfully');
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Project deleted successfully',
  //           text: 'Project deleted successfully!',
  //           customClass: {
  //             popup: 'max-width-100',
  //           },
  //         });
  //         // Fetch the updated list of projects after deletion
  //         fetchProjects();
  //       } else {
  //         console.error('Error deleting project:', response.status);
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error deleting project',
  //           text: 'An error occurred during deletion. Please try again.',
  //           customClass: {
  //             popup: 'max-width-100',
  //           },
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting project:', error);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error deleting project',
  //         text: 'An error occurred during deletion. Please try again.',
  //         customClass: {
  //           popup: 'max-width-100',
  //         },
  //       });
  //     });
  // };

  return (
    <div>
      <FormControl
        type="text"
        placeholder="Search by Project Name, Assigned To, or Status"
        className="mb-4 "
        style={{ border: '1px solid black' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
 {filteredProjects.length === 0 && searchTerm !== '' ? (
    <Alert variant="danger text-center" className="mb-3">
      No results found for "{searchTerm}".
    </Alert>
  ) : (
    <Table striped bordered hover>
      <thead>
        <th>Project Name</th>
        <th>Assigned To</th>
        <th>Action Item</th>
        <th>Status</th>
        <th>Start Date</th>
        <th>Closed Date</th>
        <th>Remarks</th>
        <th>Actions</th>
      </thead>
      <tbody>
        {filteredProjects.map((project) => (
          <tr key={project.id}>
            <td>{project.projectName}</td>
            <td>{project.assignedTo}</td>
            <td>{project.actionItem}</td>
            <td>{project.status}</td>
            <td>{moment(project.startDate).format('DD-MM-YYYY')}</td>
            <td>{moment(project.closedDate).format('DD-MM-YYYY')}</td>
            <td style={{ maxWidth: '200px', overflowX: 'auto' }}>{project.remarks}</td>
            <td>
              <Button variant="primary" className='mb-1' onClick={() => handleUpdateProject(project.id)}>
                Update
              </Button>
              {' '}
              {/* <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>
                Delete
              </Button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}

      {/* Modal for creating or updating a project */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProject.id ? 'Update Project' : 'Create Project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formProjectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project name"
                    value={selectedProject.projectName}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        projectName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formAssignedTo">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter assigned person"
                    value={selectedProject.assignedTo}
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
              <Col>
                <Form.Group controlId="formActionItem">
                  <Form.Label>Action Item</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter action item"
                    value={selectedProject.actionItem}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        actionItem: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter status"
                    value={selectedProject.status}
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
              <Col>
                <Form.Group controlId="formStartDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
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
              <Col>
                <Form.Group controlId="formClosedDate">
                  <Form.Label>Closed Date</Form.Label>
                  <Form.Control
                    type="date"
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
              <Col>
                <Form.Group controlId="formRemarks">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter remarks"
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
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveProject}>
            {selectedProject.id ? 'Update Project' : 'Save Project'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Projects;
