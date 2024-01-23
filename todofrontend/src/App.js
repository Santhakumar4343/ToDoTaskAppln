import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Login from './components/Login';
import Registration from './components/Registration';
import UserDashBoard from './components/UserDashBoard';
import AdminDashBoard from './components/AdminDashBoard';
import { useSpring, animated } from 'react-spring';
import backgroundImage from "./components/bgfortodo.jpg";
import Logo from "./components/logoOine.jpg";
import Projects from './components/Projects';
import Modules from './components/Modules';
import Task from './components/Task';
import SuperUserLogin from './components/SuperUser/SuperUserLogin';
import SuperUserDashboard from './components/SuperUser/SuperUserDashboard';

function Home() {
 
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 3000 }, // Adjust duration as needed
  });
  const animatedDivStyle = {
    position: 'absolute', // Set position to absolute
    top: '50%', // Adjust as needed
    left: '50%', // Adjust as needed
    transform: 'translate(-50%, -50%)', // Center the div
  };

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };
 
  return (
    
    <div style={backgroundStyle}>
      <animated.div style={{ ...fadeIn,...animatedDivStyle }} className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h2 className="mb-4">Welcome to the To-Do List</h2>
        <div className="row">
          <div className="col-md-6 mb-2">
            <Link to="/login" className="btn btn-primary btn-block">
              Login
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="/registration" className="btn btn-dark btn-block">
              Register
            </Link>
          </div>
        </div>
      </animated.div>
    </div>
  );
}


function App() {
 
  return (
    <Router>
      <div className="container-fluid " style={{ backgroundColor: '', minHeight: '100vh' }}>
        <header className="text-center mt-4">
          
          <div className="col-md-2">
           <Link to="/" className="logo-link">
             
               
            <img
              src={Logo}
              className="img-fluid mt-3 ml-3"
              alt="logo"
             
              style={{ width: "200px", height: "80px", borderRadius: "10px" }}
            />
            </Link></div>
        </header>

        <div className="row justify-content-center mt-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/user-dashboard/*" element={<UserDashBoard />} />
            <Route path="/admin-dashboard" element={<AdminDashBoard />} />
            <Route path="/admin-dashboard/projects" element={<Projects />} />
            <Route path="/admin-dashboard/modules" element={<Modules />} />
            <Route path="/admin-dashboard/tasks" element={<Task />} />
            <Route path="/superuser" element={<SuperUserLogin />} />
            <Route path="/superuserdashboard/*" element={<SuperUserDashboard />} />
           
           
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
