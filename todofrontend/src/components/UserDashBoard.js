import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import UserProjects from './UserProjects';
import UserModules from './UserModules';
import UserTasks from './UserTasks';

function UserDashBoard() {
  const [selectedNavLink, setSelectedNavLink] = useState('projects');

  const handleNavLinkClick = (navLink, event) => {
    event.preventDefault();
    setSelectedNavLink(navLink);
  };

  const renderContent = () => {
    switch (selectedNavLink) {
      case 'projects':
        return <UserProjects />;
      case 'modules':
        return <UserModules />;
      case 'tasks':
        return <UserTasks />;
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
              <Link  to="/admin-dashboard/projects" onClick={(e) => handleNavLinkClick('projects', e)}className="text-decoration-none">
                Projects
              </Link>
            </li>
            <li className=" mb-4">
              <Link to="/admin-dashboard/modules" onClick={(e) => handleNavLinkClick('modules', e)} className="text-decoration-none">
                Modules
              </Link>
            </li >
            <li className=" mb-4">
              <Link to="/admin-dashboard/tasks" onClick={(e) => handleNavLinkClick('tasks', e)} className="text-decoration-none">
                Tasks
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9" style={{ padding: '20px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default UserDashBoard;
