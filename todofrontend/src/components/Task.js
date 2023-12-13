import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table,FormControl,Alert } from 'react-bootstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import axios from 'axios';
const Task = () =>{
  const [showModal, setShowModal] = useState(false);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    // Fetch all modules on component mount
    axios.get('http://localhost:8082/api/modules/getAllModules')
      .then(response => {
        setModules(response.data);
      })
      .catch(error => {
        console.error('Error fetching modules:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch tasks when the selected module changes
    fetchTasks();
  }, []);

  const fetchTasks = () => {
   
      axios.get(`http://localhost:8082/api/tasks/getAllTasks`)
        .then(response => {
          setTasks(response.data);
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
    setSelectedTaskId(null);

    // Make sure a module is selected before creating a task
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
    setSelectedTaskId(taskId);

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

    const requestUrl = selectedTaskId
      ? `http://localhost:8082/api/tasks/updateTask/${selectedTaskId}`
      : `http://localhost:8082/api/tasks/saveTask/${selectedModule}`;

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
//search filter 
const filteredTasks = tasks.filter(
  (task) =>
    task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
);
  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:8082/api/tasks/deleteTaskById/${taskId}`)
      .then(response => {
        console.log('Task deleted successfully');
        Swal.fire({
          icon: 'success',
          title: 'Task deleted successfully',
          text: 'Task deleted successfully!',
          customClass: {
            popup: 'max-width-100',
          },
        });
        fetchTasks();
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error deleting task',
          text: 'An error occurred during deletion. Please try again.',
          customClass: {
            popup: 'max-width-100',
          },
        });
      });
  };

  return (
    <div>
      
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
        className="mb-3 "
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    {filteredTasks.length === 0 && searchTerm !== '' ? (
        <Alert variant="danger text-center" className="mb-3">
          No results found for "{searchTerm}".
        </Alert>
      ):(

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td>{task.taskName}</td>
              <td>{moment(task.startDate).format('YYYY-MM-DD')}</td>
              <td>{moment(task.endDate).format('YYYY-MM-DD')}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>
                <Button variant="primary" className="mb-1" onClick={() => handleUpdateTask(task.id)}>
                  Update
                </Button>
                {' '}
                <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create/Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskName">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
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

