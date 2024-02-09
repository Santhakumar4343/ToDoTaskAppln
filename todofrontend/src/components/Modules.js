import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, FormControl, Alert, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import Swal from "sweetalert2";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from '../Api';
const Modules = () => {
  const titleColors = ["#42ff75", "#3ba3ed", "#fc47ed", "#e82e44", "#f2fa5f","#f2a04e"];
  const location = useLocation();
  const { state: { username } = {} } = location;
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
    fetch(`${API_BASE_URL}/api/users/userType/user`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

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
    fetchModules(projects);
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
      ? `${API_BASE_URL}/api/modules/updateModule/${selectedModuleId}`
      : `${API_BASE_URL}/api/modules/saveModule/${selectedProject}`;

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
        fetchModules(projects);
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
    fetch(`${API_BASE_URL}/api/modules/getModuleById/${moduleId}`)
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
                      text: `The module "${module.moduleName}" has been deleted successfully!`,
                      customClass: {
                        popup: 'max-width-100',
                      },
                    });
                    fetchModules(projects);
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
      .put(`${API_BASE_URL}/api/modules/assign-user/${selectedModuleId}`, formData)
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
          fetchModules(projects);
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
            .delete(`${API_BASE_URL}/api/modules/remove-user/${selectedModuleId}?userToRemove=${userToRemove}`)
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
                fetchModules(projects); // Fetch the updated list of modules or update the state accordingly
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

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (username) {
      fetchUserDepartments(username);
    }
  }, [username]);


  const fetchUserDepartments = (username) => {
    console.log("Fetching departments for user:", username);

    return axios.get(`${API_BASE_URL}/api/departments/getAdminDepartments?username=${username}`)
      .then(response => {
        setDepartments(response.data);
        return response.data; // Return the departments
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
        throw error; // Throw the error to be caught by fetchProjects
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const userDepartments = await fetchUserDepartments(username);
          fetchProjects(userDepartments);
        }
      } catch (error) {
        console.error("Error fetching user departments:", error);
      }
    };

    fetchData();
  }, [username]);

  const fetchProjects = (userDepartments) => {
    return fetch(`${API_BASE_URL}/api/projects/getAllProjects`)
      .then((response) => response.json())
      .then((projectsData) => {
        try {
          // Filter projects to include only those that contain at least one of the user's assigned departments
          const filteredProjects = projectsData.filter((project) => {
            // Check if any of the user's departments match the project's department
            return userDepartments.some((userDepartment) =>
              project.department.departmentName === userDepartment.departmentName
            );
          });
          // Set the filtered projects directly to the projects state
          setProjects(filteredProjects);
          return filteredProjects;
        } catch (error) {
          console.error("Error filtering projects:", error);
          // Handle the error
          throw error;
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        // Handle the error
        throw error;
      });
  };

  const fetchModules = (userProjects) => {
    // Check if userProjects is available
    if (!userProjects || userProjects.length === 0) {
      console.error("No user projects available");
      return;
    }

    // Extract project names from userProjects
    const projectNames = userProjects.map(project => project.projectName);

    // Fetch all modules
    const apiUrl = `${API_BASE_URL}/api/modules/getAllModules`;

    // Make a GET request to fetch modules
    axios.get(apiUrl)
      .then((response) => {
        // Filter modules to include only those associated with user projects
        const filteredModules = response.data.filter(module => projectNames.includes(module.project.projectName));
        // Set the fetched modules to the state
        setModules(filteredModules);
      })
      .catch((error) => {
        console.error('Error fetching modules:', error);
        // Handle the error
      });
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const userDepartments = await fetchUserDepartments(username);
          const userProjects = await fetchProjects(userDepartments);
          fetchModules(userProjects);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [username]);

  const filteredModules = modules.filter((module) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      (module.project.projectName && module.project.projectName.toLowerCase().includes(lowerSearchTerm)) ||
      (module.moduleName && module.moduleName.toLowerCase().includes(lowerSearchTerm)) ||
      (module.status && module.status.toLowerCase().includes(lowerSearchTerm)) ||
      (module.remarks && module.remarks.toLowerCase().includes(lowerSearchTerm))
    );
  });

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
        placeholder="Search by Project Name. Module Name, Remarks, or Status"
        className="mb-3 "
        style={{ border: '1px solid black' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* {filteredModules.length > 0 ? (
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
      )} */}
      {filteredModules.length > 0 ? (
  <div className="row" >
    {filteredModules.map((module,index) => (
      <div className="col-md-4 mb-3" key={module.id}>
        <div className="card h-100 d-flex flex-column border border-dark" style={{ backgroundColor: index < titleColors.length ? titleColors[index] : titleColors[index % titleColors.length] }}>
          <div className="card-body">
            <h5 className="card-title text-center">{module.moduleName}</h5>
            <p><strong>Project Name:</strong> {module.project.projectName}</p>
            <p><strong>Assigned To:</strong></p>
            <ul>
              {module.assignedTo.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          
            <p><strong>Planned Start Date:</strong> {moment(module.startDate).format('YYYY-MM-DD')}</p>
            <p><strong>Planned Closed Date:</strong> {moment(module.endDate).format('YYYY-MM-DD')}</p>
            <p style={{ maxWidth: '200px', overflowX: 'auto' }}><strong>Comments:</strong> {module.remarks}</p>
            <div className="d-flex justify-content-center align-items-center">
                    <div className="mr-2">
                      {module.status === "Closed" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{module.status}</button>
                      ) : module.status === "Open" ? (
                        <button className="btn btn-success" style={{ borderRadius: "20px" }}>{module.status}</button>
                      ) : (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{module.status}</button>
                      )}
                    </div>
                    <div className="m-2">
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
          <div className="card-footer d-flex justify-content-center align-items-center border border-dark">
              <i className="bi bi-pencil-square fs-4" style={{color:"black"}} onClick={() => handleUpdateModule(module.id)}></i>
              <i className="bi bi-trash3 fs-4 m-2 " style={{color:"black"}} onClick={() => handleDeleteModule(module.id)}></i>
              <i className="bi bi-person-plus fs-4" style={{color:"black"}} onClick={() => handleAssignUser(module.id)}></i>
            </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <Alert variant="danger text-center" className="mb-3">
    No results found for "{searchTerm}".
  </Alert>
)}





      <Modal show={showModal} onHide={() => { setShowModal(false); handleModalClose(); }} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedModuleId ? 'Update Module' : 'Create Module'}</Modal.Title>
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
            {/* Conditionally render fields based on whether module is being updated */}
            {selectedModuleId && (
              <>
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
              </>
            )}
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
        <Modal.Footer className="d-flex justify-content-center align-content-center">
          <Button variant="secondary" onClick={() => { setShowModal(false); handleModalClose(); }}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveModule}>
            {selectedModuleId ? 'Update Module' : 'Create Module'}
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
