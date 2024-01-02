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

  useEffect(() => {
    // Fetch all projects on component mount
    axios.get('http://13.201.102.118:8082/api/projects/getAllProjects')
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
  //   axios.get('http://13.201.102.118:8082/api/modules/getAllModules')
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
      ? `http://13.201.102.118:8082/api/modules/getModuleByPId/${selectedProject}`
      : 'http://13.201.102.118:8082/api/modules/getAllModules';

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

    // Determine whether to create or update based on selectedModuleId
    const requestUrl = selectedModuleId
      ? `http://13.201.102.118:8082/api/modules/updateModule/${selectedModuleId}`
      : `http://13.201.102.118:8082/api/modules/saveModule/${selectedProject}`;

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
    // Make a DELETE request to delete the project
    fetch(`http://13.201.102.118:8082/api/modules/deleteModule/${moduleId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Module deleted successfully');
          Swal.fire({
            icon: 'success',
            title: 'Module deleted successfully',
            text: 'Module deleted successfully!',
            customClass: {
              popup: 'max-width-100',
            },
          });
          fetchModules();

        } else {
          console.error('Error deleting project:', response.status);
          Swal.fire({
            icon: 'error',
            title: 'Error deleting project',
            text: 'An error occurred during deletion. Please try again.',
            customClass: {
              popup: 'max-width-100',
            },
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting project:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error deleting project',
          text: 'An error occurred during deletion. Please try again.',
          customClass: {
            popup: 'max-width-100',
          },
        });
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
          <Table striped bordered hover className="text-center border border-dark" >
            <thead>
              <tr>
              <th className='h6'>project Name </th>
                <th className='h6'>Module Name</th>
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
                    <i class="bi bi-trash3 fs-4 m-2" onClick={() => handleDeleteModule(module.id)}></i>
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
    </div>
  );
};
export default Modules;
