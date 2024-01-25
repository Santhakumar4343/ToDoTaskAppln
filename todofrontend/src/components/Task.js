import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, FormControl, Alert, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import axios from 'axios';

const Task = () => {
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

  useEffect(() => {
    // Fetch modules when the selected project changes
    if (selectedProject) {
      axios.get(`http://13.233.111.56:8082/api/modules/getModuleByPId/${selectedProject}`)
        .then(response => {
          setModules(response.data);
        })
        .catch(error => {
          console.error('Error fetching modules:', error);
        });
    }
  }, [selectedProject]);

  useEffect(() => {
    // Fetch tasks when the selected module changes
    fetchTasks();
  }, [selectedModule]);

  const fetchTasks = () => {
    const apiUrl = selectedModule
      ? `http://13.233.111.56:8082/api/tasks/getTaskByModule/${selectedModule}`
      : 'http://13.233.111.56:8082/api/tasks/getAllTasks';

    axios.get(apiUrl)
      .then(response => {
        // Ensure that the response data is an array before setting it to state
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error('Error: Response data is not an array', response.data);
          setTasks([]);
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

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
    axios.get(`http://13.233.111.56:8082/api/modules/getModuleByPId/${selectedTask.module.project.id}`)
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
      ? `http://13.233.111.56:8082/api/tasks/updateTask/${selectedTaskId}`
      : `http://13.233.111.56:8082/api/tasks/saveTask/${selectedProject}/${selectedModule}`;

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
        setSelectedModule(null);
        fetchTasks();
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
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

    const handleDeleteTask = (taskId) => {
      // Fetch the task details to check its status
      axios.get(`http://13.233.111.56:8082/api/tasks/getTaskById/${taskId}`)
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
                axios.delete(`http://13.233.111.56:8082/api/tasks/deleteTaskById/${taskId}`)
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
                    fetchTasks();
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
      .put(`http://13.233.111.56:8082/api/modules/assign-user/${selectedTaskId}`, formData)
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
          fetchTasks();
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
    fetchTasks();
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
        placeholder="Search by Task Name, Priority To, or Status"
        className="mb-3 border border-dark "
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredTasks.length === 0 && searchTerm !== '' ? (
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
                  {/* <i class="bi bi-person-plus fs-4" onClick={() => handleAssignUser(task.id)}></i> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
