import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import {  useNavigate } from 'react-router-dom';
const Login = () => {
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8082/api/users/login', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setShowModal(true);
            } else {
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {

        navigate('/');
    };
    const handleOtpVerification = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('otp', otp);

            const response = await fetch('http://localhost:8082/api/users/verify-otp', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const userData = await response.json();
                const userTypeLowerCase = userData.userType.toLowerCase();
                if (userTypeLowerCase === 'user') {
                    navigate('/user-dashboard');
                } else if (userTypeLowerCase === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    console.error('Unknown userType:', userData.userType);
                }
            } else {
                console.error('OTP verification failed:', response.statusText);
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };
    return (
        <div className="container mt-2">
            
            <Form className="mx-auto" style={{ maxWidth: '300px', border: '1px solid #ccc', padding: '20px', marginTop: '100px', textAlign: 'center' }}>
               <h4>Login </h4>
                <Form.Group controlId="formUsername">
                    <Form.Control type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-4">
                    <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <div className=" mt-2  ">
                    <Button type="submit" variant="primary" className="mt-2  w-50 mr-2" disabled={loading} onClick={handleLogin}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Loading...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>

                </div>
            </Form>
            <div className="d-flex justify-content-center align-items-center mt-4">
    <Button className="w-20 " onClick={handleCancel}>
    Cancel
    </Button>
</div>



            <Modal centered show={showModal} onHide={() => setShowModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>Enter OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ border: 'none' }}>
                    <Form.Group controlId="formOtp">
                        <Form.Control
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ marginRight: "150px" }}>
                    <Button variant="secondary" onClick={() => setShowModal(false)} >
                        Close
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading} onClick={handleOtpVerification}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Loading...
                            </>
                        ) : (
                            'Verify OTP'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default Login;
