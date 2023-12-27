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
const Task = () => {
  const [showModal, setShowModal] = useState(false);
  const [modules, setModules] = useState([]);
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
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [modulesForSelectedProject, setModulesForSelectedProject] = useState(
    []
  );
  const location = useLocation();
  const { state: { username } = {} } = location;

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

        // Set the first project as the selected project
        if (data.length > 0) {
          setSelectedProject(data[0]);

          // Fetch modules and tasks for all projects
          fetchModulesForAllProjects(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user projects:", error);
        // Handle the error
      });
  };

  const fetchModulesForAllProjects = async (projects) => {
    // Create a Set to keep track of unique module IDs
    const uniqueModuleIds = new Set();

    // Create an array to store promises for each project
    const fetchPromises = projects.map(async (project) => {
      const newModules = await fetchModules(project.id);

      // Filter out modules that are already present in the Set
      const filteredModules = newModules.filter(
        (newModule) => !uniqueModuleIds.has(newModule.id)
      );

      // Add new module IDs to the Set
      filteredModules.forEach((newModule) => {
        uniqueModuleIds.add(newModule.id);
      });

      return filteredModules;
    });

    // Wait for all promises to resolve
    const modulesArrays = await Promise.all(fetchPromises);

    // Flatten the array of arrays into a single array
    const allModules = modulesArrays.flat();

    // Set the fetched modules to the state
    setModules(allModules);
  };

  const fetchModules = async (projectId) => {
    try {
      // Include projectId as a query parameter
      const apiUrl = projectId
        ? `http://localhost:8082/api/modules/getModuleByPId/${projectId}`
        : "http://localhost:8082/api/modules/getAllModules";

      // Make a GET request to fetch modules
      const response = await axios.get(apiUrl);

      // Use functional update to ensure the latest state is used
      setModules((prevModules) => {
        // Filter out modules that are already present in the state
        const newModules = response.data.filter(
          (newModule) =>
            !prevModules.some(
              (existingModule) => existingModule.id === newModule.id
            )
        );

        // Return the new state
        return [...prevModules, ...newModules];
      });
      setModulesForSelectedProject(response.data);

      return response.data; // Return the new modules for further processing if needed
    } catch (error) {
      console.error("Error fetching modules:", error);
      // Handle the error
    }
  };

  useEffect(() => {
    console.log("Selected Project Changed:", selectedProject);
    // Fetch modules for the selected project when it changes
    if (selectedProject) {
      // Clear the selected module when the project changes
      setSelectedModule("");
      // Fetch modules for the selected project
      fetchModules(selectedProject.id);
    }
  }, [selectedProject]);
  useEffect(() => {
    console.log("Selected Module Changed:", selectedModule);
    // Fetch tasks for the selected module
    if (selectedModule) {
      fetchTasks(selectedModule);
    }
  }, [selectedModule]);

  const fetchTasks = (moduleId) => {
    const apiUrl = moduleId
      ? `http://localhost:8082/api/tasks/getTaskByModule/${moduleId}`
      : "http://localhost:8082/api/tasks/getAllTasks";

    axios
      .get(apiUrl)
      .then((response) => {
        // Ensure that the response data is an array before setting it to state
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error("Error: Response data is not an array", response.data);
          setTasks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
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

    // Display the modal for updating the task
    setShowModal(true);
  };

  const handleSaveTask = () => {
    const formData = new FormData();
    formData.append("taskName", taskName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("status", status);
    formData.append("priority", priority);
    formData.append("remarks", remarks);

    const requestUrl = selectedTaskId
      ? `http://localhost:8082/api/tasks/updateTask/${selectedTaskId}`
      : `http://localhost:8082/api/tasks/saveTask/${selectedProject}/${selectedModule}`;

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
          text: `The task has been ${
            selectedTaskId ? "updated" : "created"
          } successfully!`,
          customClass: {
            popup: "max-width-100",
          },
        });
        setShowModal(false);
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error saving task:", error);
        setShowModal(false);
        Swal.fire({
          icon: "error",
          title: "Operation Failed",
          text: `An error occurred during the ${
            selectedTaskId ? "update" : "creation"
          } of the task. Please try again.`,
          customClass: {
            popup: "max-width-100",
          },
        });
      });
  };

  const filteredTasks =
    tasks && Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`http://localhost:8082/api/tasks/deleteTaskById/${taskId}`)
      .then((response) => {
        console.log("Task deleted successfully");
        Swal.fire({
          icon: "success",
          title: "Task deleted successfully",
          text: "Task deleted successfully!",
          customClass: {
            popup: "max-width-100",
          },
        });
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        Swal.fire({
          icon: "error",
          title: "Error deleting task",
          text: "An error occurred during deletion. Please try again.",
          customClass: {
            popup: "max-width-100",
          },
        });
      });
  };

  return (
    <div>
      <h4 className="text-center ">Tasks Component </h4>
      <select
        id="projectDropdown"
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="">-- Select Project --</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.projectName}
          </option>
        ))}
      </select>

      <select
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
      </Button>
      <FormControl
        type="text"
        placeholder="Search by Task Name, Priority To, or Status"
        className="mb-3 border border-dark "
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {selectedModule ? (
        // Display tasks when a module is selected
        filteredTasks.length === 0 && searchTerm !== "" ? (
          <Alert variant="danger text-center" className="mb-3">
            No results found for "{searchTerm}".
          </Alert>
        ) : (
          <Table
            striped
            bordered
            hover
            className="text-center border border-dark"
          >
            <thead>
              <tr>
                <th className="h6">Task Name</th>
                <th className="h6">Status</th>
                <th className="h6">Planned Start Date</th>
                <th className="h6">Planned Closed Date</th>
                <th className="h6">Priority</th>
                <th className="h6">Comments</th>
                <th className="h6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.taskName}</td>
                  <td>{task.status}</td>
                  <td>{moment(task.startDate).format("YYYY-MM-DD")}</td>
                  <td>{moment(task.endDate).format("YYYY-MM-DD")}</td>
                  <td>{task.priority}</td>
                  <td>{task.remarks}</td>
                  <td>
                    <i
                      className="bi bi-pencil fs-4"
                      onClick={() => handleUpdateTask(task.id)}
                    ></i>{" "}
                    <i
                      className="bi bi-trash3 fs-4 m-2"
                      onClick={() => handleDeleteTask(task.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      ) : (
        // Display a message when no module is selected
        <Alert variant="info text-center" className="mb-3">
          Please select a module to view tasks.
        </Alert>
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
                  />
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
                    className="border border-black mb-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Label>Priority</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formPriority">
                  <Form.Control
                    type="text"
                    className="border border-black mb-3"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
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
