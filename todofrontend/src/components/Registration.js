import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleCancel = () => {
        navigate('/');
    };

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        employeeId: '',
        email: '',
        mobileNumber: '',
        userType: 'user',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate input fields
        const newErrors = { ...errors };

        switch (name) {
            case 'username':
                newErrors.username = value.length < 3 ? 'Username must be 3 characters' : '';
                break;
            case 'employeeId':
                // Implement uniqueness check here (e.g., make an API call to check if the employee ID is unique)
                // If not unique, set newErrors.employeeId = 'Employee ID must be unique';
                break;
            case 'password':
                newErrors.password = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                    value
                )
                    ? 'Password must be 8 characters '
                    : '';
                newErrors.confirmPassword =
                    formData.confirmPassword && value !== formData.confirmPassword
                        ? 'Passwords do not match'
                        : '';
                break;

            case 'confirmPassword':
                newErrors.confirmPassword =
                    formData.password && value !== formData.password ? 'Passwords do not match' : '';
                break;
            case 'email':
                newErrors.email = !/^[a-z0-9.]+@[a-z]+\.[a-z]+$/
                .test(value) ? 'Invalid email format' : '';
                break;
            case 'mobileNumber':
                newErrors.mobileNumber = !/^[6-9]\d{9}$/.test(value)
                    ? 'please enter a valid number'
                    : '';
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleUserTypeChange = (e) => {
        setFormData({ ...formData, userType: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if there are any validation errors
        const hasErrors = Object.values(errors).some((error) => error !== '');

        if (hasErrors) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fix the validation errors before submitting the form.',
                customClass: {
                    popup: 'max-width-100',
                },
            });
            return;
        }

        // Continue with form submission
        const formDataObject = new FormData();
        for (const key in formData) {
            formDataObject.append(key, formData[key]);
        }

        try {
            const response = await axios.post('http://localhost:8082/api/users/save', formDataObject);

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'User registration was successful!',
                customClass: {
                    popup: 'max-width-100',
                },
            });
            navigate('/login');
            console.log('User registration successful:', response.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'An error occurred during registration. Please try again.',
                customClass: {
                    popup: 'max-width-100',
                },
            });

            console.error('Error during registration:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-85  " >
            <form
                onSubmit={handleSubmit}
                className="p-4 border  "
                style={{ minWidth: '300px', maxWidth: '750px', width: '100%', marginBottom: '80px',}}
            >
                <h2 className="mb-4 text-center">Registration</h2>

                <div className="row g-3 d-flex justify-content-center align-items-center  ">
                    <div className="col-md-4 mb-2">
                        <input
                            placeholder="username"
                            type="text"
                            className="form-control border border-dark"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            
                        />
                        {errors.username && <div className="text-danger">{errors.username}</div>}
                    </div>
                    <div className="col-md-4 mb-2">
                        <input
                            placeholder="Employee ID"
                            type="text"
                            className="form-control border border-dark"
                            id="employeeId"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            required
                            
                        />
                        {errors.employeeId && <div className="text-danger">{errors.employeeId}</div>}
                    </div>
                </div>
                <div className="row g-3 d-flex justify-content-center align-items-center">
                    <div className="col-md-4 mb-2">
                        <input
                            placeholder="Password"
                            type="password"
                            className="form-control border border-dark"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    <div className="col-md-4 mb-2">
                        <input
                            placeholder="Confirm Password"
                            type="password"
                            className="form-control border border-dark"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            
                        />
                        {errors.confirmPassword && (
                            <div className="text-danger">{errors.confirmPassword}</div>
                        )}
                    </div>
                </div>
                <div className="row g-3 d-flex justify-content-center align-items-center">
                    <div className="col-md-4 mb-2">
                        <input
                            placeholder="Email"
                            type="email"
                            className="form-control border border-dark"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    <div className="col-md-4 mb-2">
                        <input
                            placeholder="Mobile Number"
                            type="tel"
                            className="form-control border border-dark"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            required
                            
                        />
                        {errors.mobileNumber && (
                            <div className="text-danger">{errors.mobileNumber}</div>
                        )}
                    </div>
                </div>
                <div className="mb-2   d-flex justify-content-center align-items-center">
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input border border-dark"
                            id="user"
                            name="userType"
                            value="user"
                            checked={formData.userType === 'user'}
                            onChange={handleUserTypeChange}
                           
                        />
                        <label className="form-check-label" htmlFor="user">
                            User
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input m-1 border border-dark"
                            id="admin"
                            name="userType"
                            value="admin"
                            checked={formData.userType === 'admin'}
                            onChange={handleUserTypeChange}
                            
                        />
                        <label className="form-check-label" htmlFor="admin">
                            Admin
                        </label>
                    </div>
                </div>
                <div className="row g-3  d-flex justify-content-center align-items-center">
                    <div className="col-md-4 ">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Loading...
                                </>
                            ) : (
                                'Register'
                            )}
                        </Button>
                    </div>
                    <div className="col-md-4">
                        <button
                            type="button"
                            className="btn btn-secondary w-100 "
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
