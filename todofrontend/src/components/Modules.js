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
  const [priority, setPriority] = useState('');
  const [users, setUsers] = useState([]);
  const [userToRemove, setUserToRemove] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {

    // Fetch the list of users when the component mounts
    fetch("http://13.233.111.56:8082/api/users/userType/user")
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
    axios.get('http://13.233.111.56:8082/api/projects/getAllProjects')
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
  //   axios.get('http://13.233.111.56:8082/api/modules/getAllModules')
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
    // Include selectedProject as a query parameter if it exists
    const apiUrl = selectedProject
      ? `http://13.233.111.56:8082/api/modules/getModuleByPId/${selectedProject}`
      : 'http://13.233.111.56:8082/api/modules/getAllModules';
  
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
  

  const filteredModules = modules.filter((module) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      (module.moduleName && module.moduleName.toLowerCase().includes(lowerSearchTerm)) ||
      (module.status && module.status.toLowerCase().includes(lowerSearchTerm)) ||
      (module.remarks && module.remarks.toLowerCase().includes(lowerSearchTerm))
    );
  });


  const handleCreateModule = () => {

    setModuleName('');
    setStartDate('');
    setEndDate('');
    setStatus('');
    setRemarks('');
    setPriority('')
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
    setStartDate(moment(selectedModule.startDate).format("YYYY-MM-DD"));
    setEndDate(moment(selectedModule.endDate).format("YYYY-MM-DD"));
    setStatus(selectedModule.status);
    setRemarks(selectedModule.remarks);
    setAssignedTo(selectedModule.assignedTo);
    setSelectedModuleId(moduleId);

    setPriority(selectedModule.priority);
    // Set the selected project based on the module's project
    setSelectedProject(selectedModule.project.id);
    setSelectedModule(selectedModule);
    // Display the modal for updating the module
    setShowModal(true);
  };
  const handleModalClose = () => {
    // Fetch all modules when the modal is closed
    console.log('Closing modal...');
    fetchModules();
    // Set selectedProject to null
    setSelectedProject(null);
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
    formData.append('priority', priority);
    formData.append('assignedTo', assignedTo.join(','));
    // Determine whether to create or update based on selectedModuleId
    const requestUrl = selectedModuleId
      ? `http://13.233.111.56:8082/api/modules/updateModule/${selectedModuleId}`
      : `http://13.233.111.56:8082/api/modules/saveModule/${selectedProject}`;

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
        setSelectedProject(null);
        fetchModules();
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
    // Fetch the module details to check its status
    fetch(`http://13.233.111.56:8082/api/modules/getModuleById/${moduleId}`)
      .then((response) => response.json())
      .then((module) => {
        const moduleStatus = module.status;
  
        // Check if the module status is "Closed"
        if (moduleStatus === 'Closed') {
          Swal.fire({
            title: 'Are you sure?',
            text: `Once deleted, you will not be able to recover this ${module.moduleName}`,
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
              fetch(`http://13.233.111.56:8082/api/modules/deleteModule/${moduleId}`, {
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
                      text: `The module "${module.moduleName}" has been deleted successfully!`,
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
                      title: `Error Deleting ${response.moduleName}`,
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
        } else {
          // Display an error message if the module status is not "Closed"
          Swal.fire({
            icon: 'error',
            title: `Cannot Delete Module`,
            text: `You can only delete "${module.moduleName}" with the status "Closed".`,
            customClass: {
              popup: 'max-width-100',
            },
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching module details:', error);
        Swal.fire({
          icon: 'error',
          title: `Error Deleting Module`,
          text: 'An error occurred. Please try again.',
          customClass: {
            popup: 'max-width-100',
          },
        });
      });
  };
  
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  // ... other state variables

  // Function to handle showing the assign user modal for modules
  const handleAssignUser = (moduleId) => {
    // Set the selected module for assigning users
    const selectedModule = modules.find((module) => module.id === moduleId);
    setSelectedModuleId(moduleId);
    setSelectedModule(selectedModule);
    setAssignedTo(selectedModule.assignedTo);
    setShowAssignUserModal(true);
    setSelectedProject(selectedModule.project.id);
  };


  // Function to handle closing the assign user modal for modules
  const handleCloseAssignUserModal = () => setShowAssignUserModal(false);

  // Function to handle assigning a user to the module
  const handleAssignUserToModule = () => {
    // Make sure there are assigned users to save
    const selectedModule = modules.find((module) => module.id === selectedModuleId);
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
      .put(`http://13.233.111.56:8082/api/modules/assign-user/${selectedModuleId}`, formData)
      .then((response) => {
        if (response.status === 200) {
          // Show success message if the request is successful
          Swal.fire({
            icon: 'success',
            title: 'Users Assigned',
            text: `User have been assigned to the "${selectedModule?.moduleName}"  successfully!`,
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
            text: `An error occurred during the assignment to module "${selectedModule?.moduleName}". Please try again.`,
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
          text: `An error occurred during the assignment to module "${selectedModule?.moduleName}". Please try again.`,
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
  const handleRemoveUser = () => {
    if (userToRemove) {
      // Show a confirmation dialog before proceeding with the removal
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to remove user "${userToRemove}" from the module "${selectedModule.moduleName}"?`,
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
          axios
            .delete(`http://13.233.111.56:8082/api/modules/remove-user/${selectedModuleId}?userToRemove=${userToRemove}`)
            .then((response) => {
              if (response.status === 200) {
                // Show success message if the request is successful
                Swal.fire({
                  icon: 'success',
                  title: 'User Removed',
                  text: `User "${userToRemove}" has been removed from the ${selectedModule.moduleName} successfully!`,
                  customClass: {
                    popup: 'max-width-100',
                  },
                });
                fetchModules(); // Fetch the updated list of modules or update the state accordingly
              } else {
                // Show error message if the request is not successful
                console.error(`Error removing user from ${selectedModule.moduleName}:`, response.status);
                Swal.fire({
                  icon: 'error',
                  title: 'Removal Failed',
                  text: `Error removing user "${userToRemove}" from the ${selectedModule.moduleName}.`,
                  customClass: {
                    popup: 'max-width-100',
                  },
                });
              }
            })
            .catch((error) => {
              console.error('Error removing user from module:', error);
              // Handle the error
              Swal.fire({
                icon: 'error',
                title: 'Removal Failed',
                text: `An error occurred while removing user "${userToRemove}" from the ${selectedModule.moduleName}. Please try again.`,
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

  // Filter users based on the selected project's assigned users
  const filteredUsers = users.filter(user => {
    return projects.find(project => project.id === parseInt(selectedProject, 10))?.assignedTo.includes(user.username);
  });

  //validations for module creation 
  const [moduleNameError, setModuleNameError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (!moduleName) {
      setModuleNameError("Module Name is required");
      isValid = false;
    } else {
      setModuleNameError("");
    }

    if (assignedTo.length === 0) {
      setAssignedToError("Assigned To is required");
      isValid = false;
    } else {
      setAssignedToError("");
    }

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      handleSaveModule();
    }
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
                <th className='h6'>Priority</th>
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
                  <td>{module.priority}</td>
                  <td>{moment(module.startDate).format('YYYY-MM-DD')}</td>
                  <td>{moment(module.endDate).format('YYYY-MM-DD')}</td>

                  <td style={{ maxWidth: '200px', overflowX: 'auto' }}>{module.remarks}</td>
                  <td>
                   
                    <i className="bi bi-pencil fs-4" onClick={() => handleUpdateModule(module.id)}></i>
                    {' '}
                    <i class="bi bi-trash3 fs-4 m-2 text-danger" onClick={() => handleDeleteModule(module.id)}></i>
                   
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




      <Modal show={showModal} onHide={() => { setShowModal(false); handleModalClose(); }} backdrop="static" keyboard={false}>
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
                  <Form.Text className="text-danger">{moduleNameError}</Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}><Form.Label>Assigned To </Form.Label></Col>
              <Col md={8} >
                <Form.Group controlId="formAssignedTo">
                  <Form.Control
                    as="select"
                    value={assignedTo}
                    className="border border-dark mb-3"
                    onChange={(e) => setAssignedTo(Array.from(e.target.selectedOptions, (option) => option.value))}
                  >
                    <option value="">Select Assigned To</option>
                    {filteredUsers.map((user) => (
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
              <Col md={4}>
                <Form.Label>Status</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formStatus">
                  <Form.Select
                    className="mb-3 border border-dark"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
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
          <Button variant="secondary" onClick={() => {setShowModal(false);setSelectedProject(null);fetchModules();}}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Module
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAssignUserModal} onHide={handleCloseAssignUserModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Users to Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAssignUser">

              <Form.Control
                as="select"
                className="border border-dark"
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(Array.from(e.target.selectedOptions, (option) => option.value))
                }
              >
                <option value="">Select User to Assign</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" className="mt-4 " style={{ marginLeft: "160px" }} onClick={handleAssignUserToModule}>
              Assign User
            </Button>
            <Form.Group controlId="formRemoveUser">
              <Modal.Title className="mt-4">Remove Users From Module </Modal.Title>
              <Form.Control
                as="select"
                className="border border-dark mt-3"
                value={userToRemove}
                onChange={(e) => setUserToRemove(e.target.value)}
              >
                <option value="">Select User to Remove</option>
                {selectedModule?.assignedTo.map((assignedUser) => (
                  <option key={assignedUser} value={assignedUser}>
                    {assignedUser}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className=' d-flex align-item-center justify-content-center'>
          <Button variant="secondary" onClick={handleCloseAssignUserModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleRemoveUser}>
            Remove User
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
export default Modules;
