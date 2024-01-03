import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Projects from './Projects';
import Modules from './Modules';
import Task from './Task';

function AdminDashBoard() {
  const [selectedNavLink, setSelectedNavLink] = useState('projects');
  const Navigate = useNavigate();
  const handleNavLinkClick = (navLink, event) => {
    event.preventDefault();
    setSelectedNavLink(navLink);
  };

  const handleLogout = () => {
    window.history.replaceState(null, '', '/');
    Navigate('/');
  }

  const renderContent = () => {
    switch (selectedNavLink) {
      case 'projects':
        return <Projects />;
      case 'modules':
        return <Modules />;
      case 'tasks':
        return <Task />;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Side Navigation */}
        <div className="col-md-3" style={{ backgroundColor: '', padding: '20px', width: "200px", height: '400px', overflowY: 'auto', borderColor: "1px" }}>

          <ul className="list-unstyled">
            <li className=" mb-4">
              <Link to="/admin-dashboard/projects" onClick={(e) => handleNavLinkClick('projects', e)} className="btn btn-link text-decoration-none text-dark fs-5">
                Projects
              </Link>
            </li>
            <li className=" mb-4">
              <Link to="/admin-dashboard/modules" onClick={(e) => handleNavLinkClick('modules', e)} className="btn btn-link text-decoration-none text-dark fs-5">Modules
              </Link>
            </li >
            <li className=" mb-4">
              <Link to="/admin-dashboard/tasks" onClick={(e) => handleNavLinkClick('tasks', e)} className="btn btn-link text-decoration-none text-dark fs-5">
                Tasks
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9" style={{ padding: '20px' }}>
          <div className="d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="userDropdown">
                <i className="bi bi-person-circle fs-7"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>

                <Dropdown.Item onClick={handleLogout} style={{ fontSize: '14px' }}>Logout</Dropdown.Item>

                {/* Add other options if needed, like Profile */}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashBoard;
