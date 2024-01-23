import React, { useState, useEffect } from 'react';
import { Table, Alert, Button, Form, Modal, Row, Col, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // State for update modal
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState({});
    const [updatedAdmin, setUpdatedAdmin] = useState({
        username: '',
        email: '',
        password: '',
        mobileNumber: '',
    });

    const handleUpdateClick = (admin) => {
        setSelectedAdmin(admin);
        setUpdatedAdmin({
            username: admin.username,
            email: admin.email,
            password: admin.password,
            mobileNumber: admin.mobileNumber,
        });
        setShowUpdateModal(true);
    };

    const handleUpdateClose = () => {
        setShowUpdateModal(false);
    };

    const handleUpdateSave = async () => {
        // Create form data
        const formData = new FormData();
        formData.append('username', updatedAdmin.username);
        formData.append('email', updatedAdmin.email);
        formData.append('password', updatedAdmin.password);
        formData.append('mobileNumber', updatedAdmin.mobileNumber);

        // Make a backend request to update the admin
        const response = await fetch(`http://localhost:8082/api/users/update-user/${selectedAdmin.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            // Update the admins state with the updated admin
            const updatedAdmins = admins.map((admin) =>
                admin.id === selectedAdmin.id ? { ...admin, ...updatedAdmin } : admin
            );
            setAdmins(updatedAdmins);
            setShowUpdateModal(false);
        } else {
            // Handle the case where the update request fails
            console.error('Failed to update admin:', response.statusText);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/users/getAll');
                if (!response.ok) {
                    throw new Error('Failed to fetch admins');
                }
                const adminData = await response.json();
                setAdmins(adminData);
                setLoading(false);
            } catch (error) {
                setError('Error fetching admins: ' + error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    const handleDeleteUser = (adminId) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this Admin!',
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
          // Make a DELETE request to delete the user
          fetch(`http://localhost:8082/api/users/delete/${adminId}`, {
            method: 'DELETE',
          })
            .then((response) => {
              if (response.ok) {
                console.log('Admin deleted successfully');
                // Close the initial confirmation dialog
                Swal.close();
                // Inform the user about the successful deletion
                Swal.fire({
                  icon: 'success',
                  title: 'User Deleted',
                  text: 'The user has been deleted successfully!',
                  customClass: {
                    popup: 'max-width-100',
                  },
                });
             
              
              } else {
                console.error('Error deleting user:', response.status);
                Swal.fire({
                  icon: 'error',
                  title: 'Error Deleting User',
                  text: 'An error occurred during deletion. Please try again.',
                  customClass: {
                    popup: 'max-width-100',
                  },
                });
              }
            })
            .catch((error) => {
              console.error('Error deleting user:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error Deleting User',
                text: 'An error occurred during deletion. Please try again.',
                customClass: {
                  popup: 'max-width-100',
                },
              });
            });
        }
      });
    };
    
    const filteredUsers= admins.filter((user) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
  
      return (
        (user.username && user.username.toLowerCase().includes(lowerSearchTerm)) ||
        (user.email && user.email.toLowerCase().includes(lowerSearchTerm)) ||
        (user.employeeId && user.employeeId.toLowerCase().includes(lowerSearchTerm))
      );
    });
    return (
        <div>
          <FormControl
                type="text"
                placeholder="Search by User Name, Email, or UserId"
                className="mb-4 "
                style={{ border: '1px solid black' }}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredUsers.length > 0 ? (
                <Table striped bordered hover className="text-center border border-dark" style={{ borderRadius: '10px !important' }}>
                    <thead>
                        <tr>
                            <th className='h6'>User ID</th>
                            <th className='h6'>User Name</th>
                            <th className='h6'>Email</th>
                            <th className='h6'>Password</th>
                            <th className='h6'>Mobile Number</th>
                            <th className='h6'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((admin) => (
                            <tr key={admin.id}>
                                <td>{admin.employeeId}</td>
                                <td>{admin.username}</td>
                                <td>{admin.email}</td>
                                <td>{admin.password}</td>
                                <td>{admin.mobileNumber}</td>
                                <td>
                                    <i className="bi bi-pencil fs-4" onClick={() => handleUpdateClick(admin)}></i>
                                    <i className="bi bi-trash3 fs-4 m-2 text-danger" onClick={() => handleDeleteUser(admin.id)}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="danger text-center" className="mb-3">
                    No admins found.
                </Alert>
            )}
            <Modal show={showUpdateModal} onHide={handleUpdateClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Label>User Name</Form.Label>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="formUsername">
                                    <Form.Control
                                        type="text"
                                        className='border border-dark'
                                        placeholder="Enter username"
                                        value={updatedAdmin.username}
                                        onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, username: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Label>Email</Form.Label>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        className='border border-dark'
                                        placeholder="Enter email"
                                        value={updatedAdmin.email}
                                        onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, email: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Label>Password</Form.Label>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="formPassword">
                                    <div className="input-group">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}

                                            className='border border-dark'
                                            placeholder="Enter password"
                                            value={updatedAdmin.password}
                                            onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, password: e.target.value })}
                                            disabled
                                        />
                                        <div className="input-group-append">
                                            <div
                                                className="input-group-text cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ border: "1px solid black", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                                            >
                                                {showPassword ? (
                                                    <i className="bi bi-eye-fill"></i>
                                                ) : (
                                                    <i className="bi bi-eye-slash-fill"></i>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Label>Mobile Number</Form.Label>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="formMobileNumber">
                                    <Form.Control
                                        type="text"
                                        className='border border-dark'
                                        placeholder="Enter mobile number"
                                        value={updatedAdmin.mobileNumber}
                                        onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, mobileNumber: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-center'>
                    <Button variant="secondary" onClick={handleUpdateClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Admins;
