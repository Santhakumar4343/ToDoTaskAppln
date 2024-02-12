import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Users from './Users';
import Admins from './Admins';
import { useNavigate } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import Department from '../Department';
function SuperUserDashboard() {
  const [selectedNavLink, setSelectedNavLink] = useState('departments');
  const handleNavLinkClick = (navLink, event) => {
    event.preventDefault();
    setSelectedNavLink(navLink);
  };
  const Navigate = useNavigate();
  const handleLogout = () => {
    window.history.replaceState(null, '', '/');
    Navigate('/');
  }
  const renderContent = () => {
    switch (selectedNavLink) {
      case 'users':
        return <Users />;
        case 'departments':
          return <Department />;
      case 'admins':
        return <Admins />;
      default:
        return null;
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Side Navigation */}
        <div className="col-md-3" style={{ backgroundColor: '', padding: '20px',width:"200px", height: '400px', overflowY: 'auto',borderColor:"1px" }}>
        
          <ul className="list-unstyled">
           
          <li className=" mb-4">
              <Link to="/superuserdashboard/admins" onClick={(e) => handleNavLinkClick('departments', e)} className="text-decoration-none btn btn-link text-decoration-none text-dark fs-5">
                Departments
              </Link>
            </li >
            <li className=" mb-4">
              <Link to="/superuserdashboard/admins" onClick={(e) => handleNavLinkClick('admins', e)} className="text-decoration-none btn btn-link text-decoration-none text-dark fs-5">
                Admins
              </Link>
            </li >
            <li className=" mb-4">
              <Link  to="/superuserdashboard/users" onClick={(e) => handleNavLinkClick('users', e)}className="text-decoration-none btn btn-link text-decoration-none text-dark fs-5">
                Users
              </Link>
            </li>
          </ul>
        </div>
        <div
          className="col-md-9"
          style={{ padding: "20px", position: "relative" }}
        >
          <div className="d-flex justify-content-end mb-4">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="userDropdown">
                <i className="bi bi-person-circle fs-7"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout} style={{ fontSize: '14px' ,color:"red"}}>Logout</Dropdown.Item>
              </Dropdown.Menu>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout} style={{ fontSize: '14px' ,color:"red"}}>Profile</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default SuperUserDashboard;
