import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, FormControl, Alert, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from '../Api';
const Task = () => {
  const titleColors = ["#42ff75", "#3ba3ed", "#fc47ed", "#e82e44", "#f2fa5f","#f2a04e"];
  const location = useLocation();
  const { state: { username } = {} } = location;
  const [showModal, setShowModal] = useState(false);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [tasks, setTasks] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);

  const [users, setUsers] = useState([]);

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
  return axios.get(apiUrl)
    .then((response) => {
      // Filter modules to include only those associated with user projects
      const filteredModules = response.data.filter(module => projectNames.includes(module.project.projectName));
      console.log("Filtered modules:", filteredModules); // Log filtered modules
      // Set the fetched modules to the state
      setModules(filteredModules);
      return filteredModules; // Return filtered modules
    })
    .catch((error) => {
      console.error('Error fetching modules:', error);
      // Handle the error
      throw error;
    });
};



useEffect(() => {
  const fetchData = async () => {
    try {
      if (username) {
        const userDepartments = await fetchUserDepartments(username);
        const userProjects = await fetchProjects(userDepartments);
        const userModules = await fetchModules(userProjects);
        console.log(userModules);
        fetchTasks(userModules);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchData();
}, [username]);

const fetchTasks = (userModules) => {
  // Check if userModules is available
  if (!userModules || userModules.length === 0) {
    console.error("No user modules available");
    return;
  }

  // Extract module names from userModules
  const moduleNames = userModules.map(module => module.moduleName);

  // Fetch all tasks
  const apiUrl = `${API_BASE_URL}/api/tasks/getAllTasks`;

  // Make a GET request to fetch tasks
  axios.get(apiUrl)
    .then((response) => {
      // Filter tasks to include only those associated with user modules
      const filteredTasks = response.data.filter(task => moduleNames.includes(task.module.moduleName));
      // Set the fetched tasks to the state
      setTasks(filteredTasks);
    })
    .catch((error) => {
      console.error('Error fetching tasks:', error);
     
    });
};

  useEffect(() => {
   
    fetch(`${API_BASE_URL}/api/users/userType/user`)
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
    axios.get( `${API_BASE_URL}/api/projects/getAllProjects`)
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch modules when the selected project changes
    if (selectedProject) {
      axios.get(`${API_BASE_URL}/api/modules/getModuleByPId/${selectedProject}`)
        .then(response => {
          setModules(response.data);
        })
        .catch(error => {
          console.error('Error fetching modules:', error);
        });
    }
  }, [selectedProject]);

  // useEffect(() => {
  //   // Fetch tasks when the selected module changes
  //   fetchTasks(modules);
  // }, [selectedModule]);

  // const fetchTasks = () => {
  //   const apiUrl = selectedModule
  //     ? `${API_BASE_URL}/api/tasks/getTaskByModule/${selectedModule}`
  //     : '${API_BASE_URL}/api/tasks/getAllTasks';

  //   axios.get(apiUrl)
  //     .then(response => {
  //       // Ensure that the response data is an array before setting it to state
  //       if (Array.isArray(response.data)) {
  //         setTasks(response.data);
  //       } else {
  //         console.error('Error: Response data is not an array', response.data);
  //         setTasks([]);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching tasks:', error);
  //     });
  // };

  const handleCreateTask = () => {
    setTaskName('');
    setStartDate('');
    setEndDate('');
    setStatus('');
    setPriority('');
    setRemarks('');
    setSelectedTaskId(null);

    // Make sure a module is selected before creating a task
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }

    if (!selectedModule) {
      alert('Please select a module');
      return;
    }

    // Display the modal for creating a task
    setShowModal(true);
  };

  const handleUpdateTask = (taskId) => {
    const selectedTask = tasks.find((task) => task.id === taskId);

    setTaskName(selectedTask.taskName);
    setStartDate(moment(selectedTask.startDate).format('YYYY-MM-DD'));
    setEndDate(moment(selectedTask.endDate).format('YYYY-MM-DD'));
    setStatus(selectedTask.status);
    setPriority(selectedTask.priority);
    setRemarks(selectedTask.remarks);
    setAssignedTo(selectedTask.assignedTo);
    setSelectedTaskId(taskId);
    // Fetch modules for the selected project
    axios.get(`${API_BASE_URL}/api/modules/getModuleByPId/${selectedTask.module.project.id}`)
      .then(response => {
        setModules(response.data);

        // Set the selected project and module based on the task's data
        setSelectedProject(selectedTask.module.project.id);
        setSelectedModule(selectedTask.module.id);

        // Display the modal for updating the task
        setShowModal(true);
      })
      .catch(error => {
        console.error('Error fetching modules:', error);
      });
    // Display the modal for updating the task
    setShowModal(true);
  };

  const handleSaveTask = () => {
    const formData = new FormData();
    formData.append('taskName', taskName);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('status', status);
    formData.append('priority', priority);
    formData.append('remarks', remarks);
    formData.append('assignedTo', assignedTo.join(','));
    const requestUrl = selectedTaskId
      ? `${API_BASE_URL}/api/tasks/updateTask/${selectedTaskId}`
      : `${API_BASE_URL}/api/tasks/saveTask/${selectedProject}/${selectedModule}`;

    const method = selectedTaskId ? 'PUT' : 'POST';

    axios({
      method,
      url: requestUrl,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Task saved successfully:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Task ' + (selectedTaskId ? 'Updated' : 'Created') + ' Successfully',
          text: `The task has been ${selectedTaskId ? 'updated' : 'created'} successfully!`,
          customClass: {
            popup: 'max-width-100',
          },
        });
        setShowModal(false);
        
        // Fetch all tasks owned by the user
        fetchTasks();
  
        // Update the selected task fields if it was being updated
        if (selectedTaskId) {
          axios.get(`${API_BASE_URL}/api/tasks/getTaskById/${selectedTaskId}`)
            .then(response => {
              const updatedTask = response.data;
              setTaskName(updatedTask.taskName);
              setStartDate(moment(updatedTask.startDate).format('YYYY-MM-DD'));
              setEndDate(moment(updatedTask.endDate).format('YYYY-MM-DD'));
              setStatus(updatedTask.status);
              setPriority(updatedTask.priority);
              setRemarks(updatedTask.remarks);
              setAssignedTo(updatedTask.assignedTo);
            })
            .catch(error => {
              console.error('Error fetching updated task details:', error);
            });
        } else {
          // Reset fields if a new task was created
          setTaskName('');
          setStartDate('');
          setEndDate('');
          setStatus('');
          setPriority('');
          setRemarks('');
          setAssignedTo([]);
        }
        
        setSelectedModule(null);
      })
      .catch(error => {
        console.error('Error saving task:', error);
        setShowModal(false);
        Swal.fire({
          icon: 'error',
          title: 'Operation Failed',
          text: `An error occurred during the ${selectedTaskId ? 'update' : 'creation'} of the task. Please try again.`,
          customClass: {
            popup: 'max-width-100',
          },
        });
      });
  };

  const filteredTasks = tasks && Array.isArray(tasks)
    ? tasks.filter(task =>
      task.module.project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

    const handleDeleteTask = (taskId) => {
      // Fetch the task details to check its status
      axios.get(`${API_BASE_URL}/api/tasks/getTaskById/${taskId}`)
        .then(response => {
          const taskStatus = response.data.status;
    
          // Check if the task status is "Closed"
          if (taskStatus === 'Closed') {
            Swal.fire({
              title: 'Are you sure?',
              text: `Once deleted, you will not be able to recover this ${response.data.taskName}`,
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
                // Make a DELETE request to delete the task
                axios.delete(`${API_BASE_URL}/api/tasks/deleteTaskById/${taskId}`)
                  .then(response => {
                    console.log('Task deleted successfully');
                    // Close the initial confirmation dialog
                    Swal.close();
                    // Inform the user about the successful deletion
                    Swal.fire({
                      icon: 'success',
                      title: 'Task Deleted',
                      text: `The "${response.data.taskName}" has been deleted successfully!`,
                      customClass: {
                        popup: 'max-width-100',
                      },
                    });
                    // Fetch the updated list of tasks after deletion
                    fetchTasks(modules);
                  })
                  .catch(error => {
                    console.error('Error deleting task:', error);
                    Swal.fire({
                      icon: 'error',
                      title: 'Error Deleting Task',
                      text: `An error occurred during deletion of "${response.data.taskName}". Please try again.`,
                      customClass: {
                        popup: 'max-width-100',
                      },
                    });
                  });
              }
            });
          } else {
            // Display an error message if the task status is not "Closed"
            Swal.fire({
              icon: 'error',
              title: `Cannot Delete Task`,
              text: `You can only delete "${response.data.taskName}" with the status "Closed".`,
              customClass: {
                popup: 'max-width-100',
              },
            });
          }
        })
        .catch(error => {
          console.error('Error fetching task details:', error);
          Swal.fire({
            icon: 'error',
            title: `Error Deleting Task`,
            text: 'An error occurred. Please try again.',
            customClass: {
              popup: 'max-width-100',
            },
          });
        });
    };    
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  // ... other state variables

  // Function to handle showing the assign user modal for tasks
  const handleAssignUser = (taskId) => {
    // Set the selected module for assigning users
    const selectedTask = tasks.find((task) => task.id === taskId);
    setSelectedTaskId(taskId);
    setAssignedTo(selectedTask.assignedTo);
    setShowAssignUserModal(true);
  };


  // Function to handle closing the assign user modal for tasks
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
      .put(`${API_BASE_URL}/api/modules/assign-user/${selectedTaskId}`, formData)
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
          fetchTasks(modules);
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
  // Filter users based on the selected module's assigned users
  const filteredUsers = users.filter(user => {
    return modules.find(module => module.id === parseInt(selectedModule, 10))?.assignedTo.includes(user.username);
  });


  //validation for creating task
  const [taskNameError, setTaskNameError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (!taskName) {
      setTaskNameError("Task Name is required");
      isValid = false;
    } else {
      setTaskNameError("");
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
      handleSaveTask();
    }
  };
  const handleModalClose = () => {
   
    console.log('Closing modal...');
    setSelectedModule(null);
    fetchTasks(modules);
  };




 
  return (
    <div>
      <h4 className='text-center '>Tasks Component </h4>
      <select id="projectDropdown" onChange={(e) => setSelectedProject(e.target.value)}>
        <option value="">-- Select Project --</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>{project.projectName}</option>
        ))}
      </select>

      <select id="moduleDropdown" onChange={(e) => setSelectedModule(e.target.value)}>
        <option value="">-- Select Module --</option>
        {modules.map(module => (
          <option key={module.id} value={module.id}>{module.moduleName}</option>
        ))}
      </select>

      <Button variant="success" className="mb-3 m-2" onClick={handleCreateTask}>
        Create Task
      </Button>
      <FormControl
        type="text"
        placeholder="Search by Project Name, Module Name, Task Name, Priority To, or Status"
        className="mb-3 border border-dark "
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* {filteredTasks.length === 0 && searchTerm !== '' ? (
        <Alert variant="danger text-center" className="mb-3">
          No results found for "{searchTerm}".
        </Alert>
      ) : (
        <Table striped bordered hover className='text-center border border-dark'>
          <thead>
            <tr>
              <th className="h6">Project Name</th>
              <th className="h6">Module Name</th>
              <th className='h6'>Task Name</th>
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
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.module && task.module.project && task.module.project.projectName}</td>
                <td>{task.module.moduleName}</td>
                <td>{task.taskName}</td>
                <td className="text-center">
                  <ol>
                    {task.assignedTo.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ol>
                </td>

                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{moment(task.startDate).format('YYYY-MM-DD')}</td>
                <td>{moment(task.endDate).format('YYYY-MM-DD')}</td>
                <td>{task.remarks}</td>
                <td>
                  <i className="bi bi-pencil fs-4 " onClick={() => handleUpdateTask(task.id)}></i>
                  {' '}
                  <i className="bi bi-trash3 fs-4 m-2 text-danger" onClick={() => handleDeleteTask(task.id)}></i>
                 
                </td>
              </tr>
            ))}

          </tbody>
        </Table>
      )} */}
      {filteredTasks.length === 0 && searchTerm !== '' ? (
  <Alert variant="danger text-center" className="mb-3">
    No results found for "{searchTerm}".
  </Alert>
) : (
  <div className="row">
    {filteredTasks.map((task, index) => (
      <div className="col-md-4 mb-2" key={task.id}>
        <div className="card h-100 d-flex flex-column border border-dark" style={{ backgroundColor: index < titleColors.length ? titleColors[index] : titleColors[index % titleColors.length] }}>
          <div className="card-body">
            <h5 className="card-title text-center">{task.taskName}</h5>
            <p><strong>Project Name:</strong> {task.module && task.module.project && task.module.project.projectName}</p>
            <p><strong>Module Name:</strong> {task.module && task.module.moduleName}</p>
            <p><strong>Assigned To:</strong></p>
            <ul>
              {task.assignedTo.map((user, userIndex) => (
                <li key={userIndex}>{user}</li>
              ))}
            </ul>
            <p><strong>Planned Start Date:</strong> {moment(task.startDate).format('YYYY-MM-DD')}</p>
            <p><strong>Planned Closed Date:</strong> {moment(task.endDate).format('YYYY-MM-DD')}</p>
            <p><strong>Comments:</strong> {task.remarks}</p>
            <div className="d-flex justify-content-center align-items-center">
                    <div className="mr-2">
                      {task.status === "Closed" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{task.status}</button>
                      ) : task.status === "Open" ? (
                        <button className="btn btn-success" style={{ borderRadius: "20px" }}>{task.status}</button>
                      ) : (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{task.status}</button>
                      )}
                    </div>
                    <div className="m-2">
                      {task.priority === "Critical" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{task.priority}</button>
                      ) : task.priority === "High" ? (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{task.priority}</button>
                      ) : task.priority === "Medium" ? (
                        <button className="btn btn-primary" style={{ borderRadius: "20px" }}>{task.priority}</button>
                      ) : (
                        <button className="btn btn-secondary" style={{ borderRadius: "20px" }}>{task.priority}</button>
                      )}
                    </div>
                  
                  </div>
          </div>
          <div className="card-footer d-flex align-items-center  justify-content-center border border-dark">
              <i className="bi bi-pencil-square  fs-4" onClick={() => handleUpdateTask(task.id)}></i>
              <i className="bi bi-trash3 fs-4 m-2 " onClick={() => handleDeleteTask(task.id)}></i>
            </div>
        </div>
      </div>
    ))}
  </div>
)}

      <Modal show={showModal} onHide={() => { setShowModal(false); handleModalClose(); }} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}><Form.Label>Task Name</Form.Label></Col>
              <Col md={8}><Form.Group controlId="formTaskName">
                <Form.Control
                  type="text"
                  className='border border-black mb-3'
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <Form.Text className="text-danger">{taskNameError}</Form.Text>
              </Form.Group></Col>
            </Row>
            <Row>
              <Col md={4}><Form.Label>Assigned To</Form.Label></Col>
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
              <Col md={4}> <Form.Label>Start Date</Form.Label></Col>
              <Col md={8}><Form.Group controlId="formStartDate">
                <Form.Control
                  type="date"
                  className='border border-black mb-3'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group></Col>
            </Row>
            <Row>
              <Col md={4}><Form.Label>End Date</Form.Label></Col>
              <Col md={8}><Form.Group controlId="formEndDate">
                <Form.Control
                  type="date"
                  className='border border-black mb-3'
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
              <Col md={8}><Form.Group controlId="formPriority">
                <Form.Control
                  type="text"
                  className='border border-black mb-3'
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Form.Group></Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className='d-flex algin-items-center justify-content-center'>
          <Button variant="secondary" onClick={() => {setShowModal(false); setSelectedModule(null);fetchTasks();}}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            Save Task
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
                <option value="">Select User</option>
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
          <Button variant="secondary" onClick={() => { handleCloseAssignUserModal();   }}>
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

export default Task;
