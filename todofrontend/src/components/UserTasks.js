import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  FormControl,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router";
import { API_BASE_URL } from "../Api";
const Task = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedModule, setSelectedModule] = useState("");
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProject, setSelectedProject] = useState("");

  const location = useLocation();
  const { state: { username } = {} } = location;
  const [assignedTo, setAssignedTo] = useState([]);

  const [users, setUsers] = useState([]);
  const titleColors = ["#42ff75", "#3ba3ed", "#fc47ed", "#e82e44", "#f2fa5f","#f2a04e"];
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

  useEffect(() => {
    // Fetch the projects for the specific user when the component mounts
    fetchUserTasks(username);
  }, [username]);

  const fetchUserTasks = (username) => {
    console.log("Fetching projects for user:", username);

    // Make a GET request to fetch user-specific projects
    fetch(
      `${API_BASE_URL}/api/tasks/getUserTasks?username=${username}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched projects:", data);

        // Set the fetched projects to the state
        setTasks(data);

        // Set the first project as the selected project
        if (data.length > 0) {
          setSelectedProject(data[0]);

          // Fetch modules and tasks for all projects
          //  fetchModulesForAllProjects(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user projects:", error);
        // Handle the error
      });
  };


  const handleCreateTask = () => {
    setTaskName("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setPriority("");
    setRemarks("");
    setSelectedTaskId(null);

    // Make sure a module is selected before creating a task
    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    if (!selectedModule) {
      alert("Please select a module");
      return;
    }

    // Display the modal for creating a task
    setShowModal(true);
  };

  const handleUpdateTask = (taskId) => {
    const selectedTask = tasks.find((task) => task.id === taskId);

    setTaskName(selectedTask.taskName);
    setStartDate(moment(selectedTask.startDate).format("YYYY-MM-DD"));
    setEndDate(moment(selectedTask.endDate).format("YYYY-MM-DD"));
    setStatus(selectedTask.status);
    setPriority(selectedTask.priority);
    setRemarks(selectedTask.remarks);
    setSelectedTaskId(taskId);
    setAssignedTo(selectedTask.assignedTo);
    // Display the modal for updating the task
    setShowModal(true);
    fetchUserTasks(username);
  };

  const handleSaveTask = () => {
    const formData = new FormData();
    formData.append("taskName", taskName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("status", status);
    formData.append("priority", priority);
    formData.append("remarks", remarks);
    formData.append('assignedTo', assignedTo.join(','));

    const requestUrl = selectedTaskId
      ? `${API_BASE_URL}/api/tasks/updateTask/${selectedTaskId}`
      : `${API_BASE_URL}/api/tasks/saveTask/${selectedProject}/${selectedModule}`;

    const method = selectedTaskId ? "PUT" : "POST";

    axios({
      method,
      url: requestUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("Task saved successfully:", response.data);
        Swal.fire({
          icon: "success",
          title:
            "Task " +
            (selectedTaskId ? "Updated" : "Created") +
            " Successfully",
          text: `The task has been ${selectedTaskId ? "updated" : "created"
            } successfully!`,
          customClass: {
            popup: "max-width-100",
          },
        });
        fetchUserTasks(username);
        setShowModal(false);

      })
      .catch((error) => {
        console.error("Error saving task:", error);
        setShowModal(false);
        Swal.fire({



          icon: "error",
          title: "Operation Failed",
          text: `An error occurred during the ${selectedTaskId ? "update" : "creation"
            } of the task. Please try again.`,
          customClass: {
            popup: "max-width-100",
          },
        });
      });
  };

  const filteredTasks = tasks && Array.isArray(tasks)
    ? tasks.filter((task) => (
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    : [];


  const handleDeleteTask = (taskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this task!',
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
              text: 'The task has been deleted successfully!',
              customClass: {
                popup: 'max-width-100',
              },
            });
            // Fetch the updated list of tasks after deletion
            fetchUserTasks(username);
          })
          .catch(error => {
            console.error('Error deleting task:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error Deleting Task',
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
      <h4 className="text-center ">Tasks</h4>
      {/* <select
        id="projectDropdown"
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="">-- Select Project --</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.projectName}
          </option>
        ))}
      </select> */}

      {/* <select
        id="moduleDropdown"
        onChange={(e) => setSelectedModule(e.target.value)}
      >
        <option value="">-- Select Module --</option>
        {modulesForSelectedProject.map((module) => (
          <option key={module.id} value={module.id}>
            {module.moduleName}
          </option>
        ))}
      </select>

      <Button variant="success" className="mb-3 m-2" onClick={handleCreateTask}>
        Create Task
      </Button> */}
      <FormControl
        type="text"
        placeholder="Search by Task Name, Priority To, or Status"
        className="mb-3 border border-dark "
        onChange={(e) => setSearchTerm(e.target.value)}
      />


      {filteredTasks.length === 0 && searchTerm !== "" ? (
        <Alert variant="danger text-center" className="mb-3">
          No results found for "{searchTerm}".
        </Alert>
      ) : (
        <div className="row">
          {filteredTasks.map((task, index) => (
            <div className="col-md-4 mb-3" key={task.id}>
              <div className="card h-80 d-flex flex-column border border-dark zoom-in"  style={{ backgroundColor: index < titleColors.length ? titleColors[index] : titleColors[index % titleColors.length] }}>
                
                <div className="card-body d-flex flex-column ">
                  <h5 className="card-title text-center" style={{ color: "black" }}>{task.taskName}</h5>
                  <p className="card-text" style={{ color: "black" }}><strong>Project Name:</strong>{task.module.project.projectName} </p>
                  <p className="card-text" style={{ color: "black" }}><strong>Module Name:</strong> {task.module.moduleName}</p>
                  <ul className="list-unstyled">
                    <li><strong style={{ color: "black" }}>Assigned To:</strong></li>
                    {task.assignedTo.map((user, userIndex) => (
                      <li key={userIndex} style={{ color: "black" }}>{user}</li>
                    ))}
                  </ul>

                  <p className="card-text" style={{ color: "black" }}><strong>Planned Start Date:</strong> {moment(task.startDate).format("DD-MM-YYYY")}</p>
                  <p className="card-text" style={{ color: "black" }}><strong>Planned Closed Date:</strong> {moment(task.endDate).format("DD-MM-YYYY")}</p>

                  <div className="flex-grow-1" style={{ overflowY: "auto" }}>
                    <p className="card-text" style={{ color: "black" }}><strong>Comments:</strong></p>
                    <p className="card-text" style={{ color: "black" }}>{task.remarks}</p>
                  </div>

                  <div className="d-flex align-items-center justify-content-center">
                    <div className="card-text " style={{ color: "black" }}>
                      {task.status === "Closed" ? (
                        <button className="btn btn-danger" style={{ borderRadius: "20px" }}>{task.status}</button>
                      ) : task.status === "Open" ? (
                        <button className="btn btn-success" style={{ borderRadius: "20px" }}>{task.status}</button>
                      ) : (
                        <button className="btn btn-warning" style={{ borderRadius: "20px" }}>{task.status}</button>
                      )}
                    </div>
                    <div className="card-text m-3" style={{ color: "black" }}>

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
                <div className="card-footer d-flex justify-content-center aligin-items-center border border-dark">
                  <i
                    className="bi bi-pencil-square fs-3"
                    style={{ color: "black" }}
                    onClick={() => handleUpdateTask(task.id)}
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </div>

      )}


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Label>Task Name</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formTaskName">
                  <Form.Control
                    type="text"
                    className="border border-black mb-3"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    disabled
                  />
                </Form.Group>
              </Col>
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
                    disabled
                  >


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
                <Form.Label>Start Date</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formStartDate">
                  <Form.Control
                    type="date"
                    className="border border-black mb-3"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>End Date</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formEndDate">
                  <Form.Control
                    type="date"
                    className="border border-black mb-3"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled
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
                    disabled
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
              <Col md={4}>
                <Form.Label>Remarks</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formPriority">
                  <Form.Control
                    type="text"
                    className="border border-black mb-3"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex algin-items-center justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            Save Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Task;
