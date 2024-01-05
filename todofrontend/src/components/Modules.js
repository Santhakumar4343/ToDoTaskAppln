import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, FormControl, Alert, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import Swal from "sweetalert2";
import axios from 'axios';

const Modules = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);

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
  useEffect(() => {
    // Fetch all projects on component mount
    axios.get('http://localhost:8082/api/projects/getAllProjects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  // useEffect(() => {
  //   // Fetch all modules on component mount and when modules change
  //   fetchModules();
  // }, []);

  // const fetchModules = () => {
  //   // Make a GET request to fetch modules
  //   axios.get('http://localhost:8082/api/modules/getAllModules')
  //     .then((response) => {
  //       // Set the fetched modules to the state
  //       setModules(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching modules:', error);
  //       // Handle the error
  //     });

  // };
  useEffect(() => {
    // Fetch all modules on component mount and when modules or selectedProject change
    fetchModules();
  }, [selectedProject]); // Include selectedProject in the dependency array

  const fetchModules = () => {
    // Include selectedProject as a query parameter
    const apiUrl = selectedProject
      ? `http://localhost:8082/api/modules/getModuleByPId/${selectedProject}`
      : 'http://localhost:8082/api/modules/getAllModules';

    // Make a GET request to fetch modules
    axios.get(apiUrl)
      .then((response) => {
        // Set the fetched modules to the state
        setModules(response.data);
      })
      .catch((error) => {
        console.error('Error fetching modules:', error);
        // Handle the error
      });
  };

  const filteredModules = modules.filter(
    (module) =>
      module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateModule = () => {

    setModuleName('');
    setStartDate('');
    setEndDate('');
    setStatus('');
    setRemarks('');
    setSelectedModuleId(null);
    // Make sure a project is selected before creating a module
    if (!selectedProject) {
      alert('Please select a project');
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
    formData.append('projectId', selectedProject);
    formData.append('moduleName', moduleName);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('status', status);
    formData.append('remarks', remarks);
    formData.append('assignedTo', assignedTo.join(','));
    // Determine whether to create or update based on selectedModuleId
    const requestUrl = selectedModuleId
      ? `http://localhost:8082/api/modules/updateModule/${selectedModuleId}`
      : `http://localhost:8082/api/modules/saveModule/${selectedProject}`;

    // Use 'PUT' for updating
    const method = selectedModuleId ? 'PUT' : 'POST';

    // Send a request to create or update a module
    axios({
      method,  // Use 'PUT' or 'POST' based on the condition
      url: requestUrl,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Module saved successfully:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Module ' + (selectedModuleId ? 'Updated' : 'Created') + ' Successfully',
          text: `The module has been ${selectedModuleId ? 'updated' : 'created'} successfully!`,
          customClass: {
            popup: 'max-width-100',
          },
        });
        setShowModal(false);
        fetchModules(); // Fetch modules again to update the table

      })
      .catch(error => {
        console.error('Error saving module:', error);
        setShowModal(false);
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: `An error occurred during the ${selectedModuleId ? 'update' : 'creation'} of the module. Please try again.`,
          customClass: {
            popup: 'max-width-100',
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
        fetch(`http://localhost:8082/api/modules/deleteModule/${moduleId}`, {
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
              fetchModules();
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

  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  // ... other state variables

  // Function to handle showing the assign user modal for modules
  const handleAssignUser = (moduleId) => {
    // Set the selected module for assigning users
    const selectedModule = modules.find((module) => module.id === moduleId);
    setSelectedModuleId(moduleId);
    setAssignedTo(selectedModule.assignedTo);
    setShowAssignUserModal(true);
  };


  // Function to handle closing the assign user modal for modules
  const handleCloseAssignUserModal = () => setShowAssignUserModal(false);

  // Function to handle assigning a user to the module
  const handleAssignUserToModule = () => {
    // Make sure there are assigned users to save
    if (assignedTo.length === 0) {
      // Handle the case where no users are selected
      console.error('No users selected for assignment.');
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append('assignedTo', assignedTo.join(',')); // Convert the array to a comma-separated string

    // Make a PUT request to your backend API to assign users to the module
    axios
      .put(`http://localhost:8082/api/modules/assign-user/${selectedModuleId}`, formData)
      .then((response) => {
        if (response.status === 200) {
          // Show success message if the request is successful
          Swal.fire({
            icon: 'success',
            title: 'Users Assigned',
            text: 'Users have been assigned to the module successfully!',
            customClass: {
              popup: 'max-width-100',
            },
          });

          // Optionally, you may want to update the frontend with the latest data
          // Fetch the updated list of modules or update the state accordingly
          fetchModules();
        } else {
          // Show error message if the request is not successful
          console.error('Error assigning users to module:', response.status);
          Swal.fire({
            icon: 'error',
            title: 'Assignment Failed',
            text: 'An error occurred during the assignment. Please try again.',
            customClass: {
              popup: 'max-width-100',
            },
          });
        }
      })
      .catch((error) => {
        console.error('Error assigning users to module:', error);
        // Handle the error
        Swal.fire({
          icon: 'error',
          title: 'Assignment Failed',
          text: 'An error occurred during the assignment. Please try again.',
          customClass: {
            popup: 'max-width-100',
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
      <h4 className='text-center '>Modules Component </h4>
      <select id="projectDropdown" onChange={(e) => setSelectedProject(e.target.value)}>
        <option value="" className=''>-- Select Project --</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>{project.projectName}</option>
        ))}
      </select>

      <Button variant="success" className="mb-3 m-2" onClick={handleCreateModule}>
        Create Module
      </Button>
      <FormControl
        type="text"
        placeholder="Search by Module Name, Remarks, or Status"
        className="mb-3 "
        style={{ border: '1px solid black' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredModules.length > 0 ? (
        <>
          <Table striped bordered hover className="text-center  border border-dark " style={{ borderRadius: '10px  !important' }} >
            <thead>
              <tr>
                <th className='h6'>project Name </th>
                <th className='h6'>Module Name</th>
                <th className=" border border-dark h6">Assigned To</th>
                <th className='h6'>Status</th>
                <th className='h6'>Planned Start Date</th>
                <th className='h6'>Planned Closed Date</th>
                <th className='h6'>Comments</th>
                <th className='h6'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((module) => (
                <tr key={module.id}>
                  <td>{module.project.projectName}</td>
                  <td>{module.moduleName}</td>
                  <td className="text-center">
                    <ol>
                      {module.assignedTo.map((user, index) => (
                        <li key={index}>{user}</li>
                      ))}
                    </ol>
                  </td>

                  <td>{module.status}</td>
                  <td>{moment(module.startDate).format('YYYY-MM-DD')}</td>
                  <td>{moment(module.endDate).format('YYYY-MM-DD')}</td>

                  <td style={{ maxWidth: '200px', overflowX: 'auto' }}>{module.remarks}</td>
                  <td>
                    {/* <Button
                      variant="primary"
                      className='mb-1'
                      onClick={() => handleUpdateModule(module.id)}
                    >
                      Update
                    </Button>{' '}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteModule(module.id)}
                    >
                      Delete
                    </Button> */}
                    <i className="bi bi-pencil fs-4" onClick={() => handleUpdateModule(module.id)}></i>
                    {' '}
                    <i class="bi bi-trash3 fs-4 m-2 text-danger" onClick={() => handleDeleteModule(module.id)}></i>
                    {/* <Button
                      variant="primary"
                      onClick={() => handleAssignUser(module.id)}
                    >
                      Assign User
                    </Button> */}
                    <i class="bi bi-person-plus fs-4" onClick={() => handleAssignUser(module.id)}></i>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Alert variant="danger text-center" className="mb-3">
          No results found for "{searchTerm}".
        </Alert>
      )}




      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Update Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}><Form.Label>Module Name</Form.Label></Col>
              <Col md={8} >
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
              <Col md={4}><Form.Label>Module Name</Form.Label></Col>
              <Col md={8} >
                <Form.Group controlId="formAssignedTo">
                  <Form.Control
                    as="select"
                    value={assignedTo}
                    className="border border-dark mb-3"
                    onChange={(e) => setAssignedTo(Array.from(e.target.selectedOptions, (option) => option.value))}

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
              <Col md={4}><Form.Label>Start Date</Form.Label></Col>
              <Col md={8}><Form.Group controlId="formStartDate">

                <Form.Control
                  type="date"
                  className=" mb-3 border border-dark"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group></Col>
            </Row>

            <Row>
              <Col md={4}> <Form.Label>End Date</Form.Label></Col>
              <Col md={8}> <Form.Group controlId="formEndDate">

                <Form.Control
                  type="date"
                  className=" mb-3 border border-dark"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group></Col>
            </Row>

            <Row>
              <Col md={4}><Form.Label>Status</Form.Label></Col>
              <Col md={8}><Form.Group controlId="formStatus">

                <Form.Control
                  type="text"
                  className=" mb-3 border border-dark"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </Form.Group></Col>
            </Row>

            <Row>
              <Col md={4}><Form.Label>Remarks</Form.Label></Col>
              <Col md={8}><Form.Group controlId="formRemarks">

                <Form.Control
                  type="text"
                  className=" mb-3 border border-dark"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Form.Group></Col>
            </Row>

          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-content-center" >
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveModule}>
            Save Module
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAssignUserModal} onHide={handleCloseAssignUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Users to Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAssignUser">
              <Form.Label>Select Users</Form.Label>
              <Form.Control
                as="select"

                value={assignedTo}
                onChange={(e) => setAssignedTo(Array.from(e.target.selectedOptions, (option) => option.value))}
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
          <Button variant="primary" onClick={handleAssignUserToModule}>
            Assign User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Modules;
