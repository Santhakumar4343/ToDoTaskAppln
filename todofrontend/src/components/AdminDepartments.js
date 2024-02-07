import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
function Department() {
    const location = useLocation();
    const { state: { username } = {} } = location;
   
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const [assignedTo, setAssignedTo] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState({ assignedTo: [] });
    const [admins, setAdmins] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [userToRemove, setUserToRemove] = useState("");
    const titleColors = ["#42ff75", "#3ba3ed", "#fc47ed", "#e82e44", "#f2fa5f","#f2a04e"];
   
 useEffect(() => {
        if (username) {
            fetchUserDepartments(username);
        }
    }, [username]);

    const fetchUserDepartments = (username) => {
        console.log("Fetching departments for user:", username);

        axios.get(`http://localhost:8082/api/departments/getAdminDepartments?username=${username}`)
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    };

    useEffect(() => {
        fetch("http://localhost:8082/api/admins/userType/admin")
            .then((response) => response.json())
            .then((data) => {
                setAdmins(data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);
    const handleSave = () => {
        const departmentData = new FormData();
        departmentData.append("departmentName", departmentName);
        departmentData.append("assignedTo", assignedTo);

        if (selectedDepartment && selectedDepartment.id) {
            axios.put(`http://localhost:8082/api/departments/updateDepartment/${selectedDepartment.id}`, departmentData)
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
            axios.post("http://localhost:8082/api/departments/saveDepartment", departmentData)
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
                axios.delete(`http://localhost:8082/api/departments/deleteDepartment/${id}`)
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
        setDepartmentName(department.departmentName || "");
        setAssignedTo(department.assignedTo || []); 
        handleShowModal("Update Department");
    };

    const handleCreateDepartment = () => {
       
        setDepartmentName("");
        setAssignedTo([]);
        handleShowModal("Create Department");
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setDepartmentName("");
        setAssignedTo([]);
       
        setModalTitle("");
    };
    const handleShowModal = (title) => {
        setModalTitle(title);
        setShowModal(true);
    };

    const [showAssignUserModal, setShowAssignUserModal] = useState(false);

    // Function to handle showing the assign user modal
    const handleShowAssignUserModal = () => setShowAssignUserModal(true);
  
    // Function to handle closing the assign user modal
    const handleCloseAssignUserModal = () => setShowAssignUserModal(false);
  
    // Function to handle assigning a user to the project
    const handleAssignUser = (departmentId) => {
      // Set the selected project for assigning users
      const selectedDepartment = departments.find((department) => department.id === departmentId);
      setSelectedDepartment(selectedDepartment);
      // Show the assign user modal
      handleShowAssignUserModal();
    };
    const handleSaveAssignUser = () => {
      // Make sure there are assigned users to save
      if (selectedDepartment.assignedTo.length === 0) {
        // Handle the case where no users are selected
        console.error('No users selected for assignment.');
        return;
      }
      // Check if there's a user to remove
      if (userToRemove) {
        // Remove the selected user from the assignedTo array
        const updatedAssignedTo = selectedDepartment.assignedTo.filter(
          (user) => user !== userToRemove
        );
  
        // Update the assignedTo array in the selected project
        setSelectedDepartment({
          ...selectedDepartment,
          assignedTo: updatedAssignedTo,
        });
      }
      // Prepare the form data
      const formData = new FormData();
      formData.append('assignedTo', selectedDepartment.assignedTo.join(',')); // Convert the array to a comma-separated string
  
      // Make a PUT request to your backend API to assign users to the project
      fetch(`http://localhost:8082/api/departments/assign-user/${selectedDepartment.id}`, {
        method: 'PUT',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            // Show success message if the request is successful
            Swal.fire({
              icon: "success",
              title: "Users Assigned",
              text: `"${selectedDepartment.assignedTo}" have been assigned to the "${selectedDepartment.departmentName}" successfully!`,
              customClass: {
                popup: "max-width-100",
              },
            });
            
           
          } else {
            // Show error message if the request is not successful
            Swal.fire({
              icon: "error",
              title: "Assignment Failed",
              text: `Selected "${selectedDepartment.assignedTo}" already assigned to the "${selectedDepartment.projectName}".`,
              customClass: {
                popup: "max-width-100",
              },
            });
          }
        })
        .catch(error => {
          console.error('Error assigning users:', error);
          // Handle the error
          Swal.fire({
            icon: "error",
            title: "Assignment Failed",
            text: `An error occurred during the assignmentto the "${selectedDepartment.departmentName}"Please try again.`,
            customClass: {
              popup: "max-width-100",
            },
          });
        })
        .finally(() => {
          // Close the modal after handling the assignment
          handleCloseAssignUserModal();
        });
    };
  
   // Function to handle removing a user from the project
const handleRemoveUser = () => {
    // Check if there's a selected department
    if (selectedDepartment) {
        // Check if there's a user to remove
        if (userToRemove) {
            // Show a confirmation dialog before proceeding with the removal
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you really want to remove user "${userToRemove}" from the project "${selectedDepartment.departmentName}"?`,
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
                    fetch(`http://localhost:8082/api/departments/remove-user/${selectedDepartment.id}?userToRemove=${userToRemove}`, {
                        method: 'DELETE',
                    })
                        .then((response) => {
                            if (response.ok) {
                                // Show success message if the request is successful
                                Swal.fire({
                                    icon: 'success',
                                    title: 'User Removed',
                                    text: `User "${userToRemove}" has been removed from the "${selectedDepartment.departmentName}" successfully!`,
                                    customClass: {
                                        popup: 'max-width-100',
                                    },
                                });
                            } else {
                                // Show error message if the request is not successful
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Removal Failed',
                                    text: `Error removing "${userToRemove}" from the project.`,
                                    customClass: {
                                        popup: 'max-width-100',
                                    },
                                });
                            }
                        })
                        .catch((error) => {
                            console.error('Error removing user:', error);
                            // Handle the error
                            Swal.fire({
                                icon: 'error',
                                title: 'Removal Failed',
                                text: `An error occurred while removing  "${userToRemove}". Please try again.`,
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
    } else {
        // Handle the case where no department is selected
        console.error('No department selected.');
    }
};

    return (
        <div>
            <Button variant="success" className="mb-3" onClick={handleCreateDepartment}>
                Create Department
            </Button>
            <div className="row">
                {departments.map((department, index) => (
                    <div className="col-md-4 mb-3" key={department.id}>
                        <div className="card h-100 d-flex flex-column border border-dark" style={{ backgroundColor: index < titleColors.length ? titleColors[index] : titleColors[index % titleColors.length] }}>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title text-center" style={{ color: "white" }}>{department.departmentName}</h5>
                                <ul className="list-unstyled">
                                    <li><strong style={{ color: "white" }}>Assigned To:</strong></li>
                                    {department.assignedTo.map((user, userIndex) => (
                                        <li key={userIndex} style={{ color: "white" }}>{user}</li>
                                    ))}
                                </ul>
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
                                <i
                                    className="bi bi-person-plus fs-4 table-icon"
                                    style={{ color: "white" }}
                                    onClick={() => handleAssignUser(department.id)}
                                ></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title >  {modalTitle}</Modal.Title>
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
                        <Row>
                            <Col md={4}>
                                <Form.Label>Assigned Person</Form.Label>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="formAssignedTo">
                                    <Form.Control
                                        as="select"
                                        value={assignedTo}
                                        className="border border-dark mb-3"
                                        onChange={(e) =>
                                            setAssignedTo(e.target.value)
                                        }
                                    >
                                        <option value="">Select Assigned To</option>
                                        {admins.map((admin) => (
                                            <option key={admin.id} value={admin.username}>
                                                {admin.username}
                                            </option>
                                        ))}
                                    </Form.Control>
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

            <Modal show={showAssignUserModal} onHide={handleCloseAssignUserModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Assign Users to Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className>
          <Form>
            <Form.Group controlId="formAssignUser">
              <Form.Control
                as="select"
                className="border border-dark"
                onChange={(e) =>
                  setSelectedDepartment({
                    ...selectedDepartment,
                    assignedTo: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                    selectedUser: e.target.value, 
                  })
                }
              >
                {/* Include a default option for selecting users */}
                <option value="">Select User to Assign</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.username}>
                    {admin.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" className="mt-4 "  style={{marginLeft:"160px"}}onClick={handleSaveAssignUser}>
            Assign User
          </Button>
            <Form.Group controlId="formRemoveUser">
            <Modal.Title className="mt-4">Remove Users From Project</Modal.Title>
              <Form.Control
                as="select"
                className="border border-dark mt-3"
                value={userToRemove}
                onChange={(e) => setUserToRemove(e.target.value)}
              >
                <option value="">Select User to Remove</option>
                {selectedDepartment.assignedTo.map((assignedUser) => (
                  <option key={assignedUser} value={assignedUser}>
                    {assignedUser}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex align-item-center justify-content-center">
          <Button variant="secondary" onClick={handleCloseAssignUserModal}>
            Close
          </Button>
         
          <Button
            variant="danger"
            onClick={() => handleRemoveUser(selectedDepartment.id, selectedDepartment.selectedUser)}
          >
            Remove User
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    );
}

export default Department;
