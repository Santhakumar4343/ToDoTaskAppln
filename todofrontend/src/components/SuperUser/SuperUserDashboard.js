import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Users from './Users';
import Admins from './Admins';

function SuperUserDashboard() {
  const [selectedNavLink, setSelectedNavLink] = useState('projects');

  const handleNavLinkClick = (navLink, event) => {
    event.preventDefault();
    setSelectedNavLink(navLink);
  };

  const renderContent = () => {
    switch (selectedNavLink) {
      case 'users':
        return <Users />;
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
              <Link to="/superuserdashboard/admins" onClick={(e) => handleNavLinkClick('admins', e)} className="text-decoration-none">
                Admins
              </Link>
            </li >
            <li className=" mb-4">
              <Link  to="/superuserdashboard/users" onClick={(e) => handleNavLinkClick('users', e)}className="text-decoration-none">
                Users
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

export default SuperUserDashboard;
