import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';

import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
function Department() {
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const titleColors = ["#FF5733", "#33FF57", "#5733FF", "#33FFFF", "#FF33E9", "#FFFF33"];
    useEffect(() => {
        axios.get("http://13.233.111.56:8082/api/departments/getAllDepartments")
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }, []);
    const handleSave = () => {
        const departmentData = {
            departmentName: departmentName
        };

        if (selectedDepartment) {
            axios.put(`http://13.233.111.56:8082/api/departments/updateDepartment/${selectedDepartment.id}`, departmentData)
                .then(response => {
                    const updatedDepartments = departments.map(department =>
                        department.id === response.data.id ? response.data : department
                    );
                    setDepartments(updatedDepartments);
                    handleCloseModal();
                    Swal.fire('Updated!', 'Department has been updated.', 'success');
                })
                .catch(error => {
                    console.error('Error updating department:', error);
                });
        } else {
            axios.post("http://13.233.111.56:8082/api/departments/saveDepartment", departmentData)
                .then(response => {
                    setDepartments([...departments, response.data]);
                    handleCloseModal();
                    Swal.fire('Saved!', 'Department has been saved.', 'success');
                })
                .catch(error => {
                    console.error('Error saving department:', error);
                });
        }
    };



    const handleDeleteDepartment = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this department!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://13.233.111.56:8082/api/departments/deleteDepartment/${id}`)
                    .then(() => {
                        setDepartments(departments.filter(department => department.id !== id));
                        Swal.fire('Deleted!', 'Your department has been deleted.', 'success');
                    })
                    .catch(error => {
                        console.error('Error deleting department:', error);
                    });
            }
        });
    };


    const handleUpdateDepartment = (department) => {
        setSelectedDepartment(department);
        setDepartmentName(department.departmentName);
        handleShowModal("Update Department");
    };

    const handleCreateDepartment = () => {
        setSelectedDepartment(null);
        setDepartmentName("");
        handleShowModal("Create Department");
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setDepartmentName("");
        setSelectedDepartment(null);
        setModalTitle("");
    };
    const handleShowModal = (title) => {
        setModalTitle(title);
        setShowModal(true);
    };

    return (
        <div>
            <Button variant="success" className="mb-3" onClick={handleCreateDepartment}>
                Create Department
            </Button>
            <div className="row">
  {departments.map((department, index) => (
    <div className="col-md-4 mb-3" key={department.id}>
      <div className="card h-100 d-flex flex-column border border-dark" style={{ backgroundColor: "#474646" }}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-center" style={{ color: "white" }}>{department.departmentName}</h5>
        </div>
        <div className="card-footer d-flex justify-content-center align-items-center">
          <i
            className="bi bi-pencil fs-4 table-icon"
            style={{ color: "white" }}
            onClick={() => handleUpdateDepartment(department)}
          ></i>{" "}
          <i
            className="bi bi-trash3 fs-4 m-2  table-icon"
            style={{ color: "white" }}
            onClick={() => handleDeleteDepartment(department.id)}
          ></i>
        </div>
      </div>
    </div>
  ))}
</div>


            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={4}>
                                {" "}
                                <Form.Label>Department Name</Form.Label>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="formDepartmentName">
                                    <Form.Control

                                        type="text"
                                        value={departmentName}
                                        className="border border-dark mb-3"
                                        onChange={(e) => setDepartmentName(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className=" d-flex justify-content-center align-items-center">
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Department;
