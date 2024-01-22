import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProjects from "./UserProjects";
import UserModules from "./UserModules";
import UserTasks from "./UserTasks";
import { Dropdown } from "react-bootstrap";
function UserDashBoard() {
  const [selectedNavLink, setSelectedNavLink] = useState("projects");
  const Navigate = useNavigate();
  const handleLogout = () => {
    window.history.replaceState(null, '', '/');
    Navigate('/');
  }
  const handleNavLinkClick = (navLink, event) => {
    event.preventDefault();
    setSelectedNavLink(navLink);
  };
  const renderContent = () => {
    switch (selectedNavLink) {
      case "projects":
        return <UserProjects />;
      case "modules":
        return <UserModules />;
      case "tasks":
        return <UserTasks />;
      default:
        return null;
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Side Navigation */}
        <div
          className="col-md-3"
          style={{
            backgroundColor: "",
            padding: "20px",
            width: "200px",
            height: "400px",
            overflowY: "auto",
            borderColor: "1px",
          }}
        >
          <ul className="list-unstyled">
            <li className="mb-4">
              <button
                onClick={(e) => handleNavLinkClick("projects", e)}
                className="btn btn-link text-decoration-none text-dark fs-5"
              >
                Projects
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={(e) => handleNavLinkClick("modules", e)}
                className="btn btn-link text-decoration-none text-dark fs-5"
              >
                Modules
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={(e) => handleNavLinkClick("tasks", e)}
                className="btn btn-link text-decoration-none text-dark fs-5"
              >
                Tasks
              </button>
            </li>
          </ul>
        </div>
        <div
          className="col-md-9"
          style={{ padding: "20px", position: "relative" }}
        >
          <div className="d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="userDropdown">
                <i className="bi bi-person-circle fs-7"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout} style={{ fontSize: '14px' }}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
export default UserDashBoard;
