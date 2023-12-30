import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import UserProjects from "./UserProjects";
import UserModules from "./UserModules";
import UserTasks from "./UserTasks";

function UserDashBoard() {
  const [selectedNavLink, setSelectedNavLink] = useState("projects");
  const [showLogoutPopover, setShowLogoutPopover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      setShowLogoutPopover(false);
      navigate("/");
    };

    // Add your logic to check if the user is logged in
    // If not logged in, you can perform a redirect here as well

    window.addEventListener("popstate", handleLogout);

    return () => {
      window.removeEventListener("popstate", handleLogout);
    };
  }, [navigate]);

  const handleNavLinkClick = (navLink, event) => {
    event.preventDefault();
    setSelectedNavLink(navLink);
  };

  const handleLogout = () => {
    setShowLogoutPopover(false);
    navigate("/");
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

        {/* Main Content */}
        <div
          className="col-md-9"
          style={{ padding: "20px", position: "relative" }}
        >
          <div
            className="position-absolute top-2 end-0 mt-3 me-2 mt-2"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setShowLogoutPopover(true)}
            onMouseLeave={() => setShowLogoutPopover(false)}
          >
            <i className="bi bi-person-circle fs-3"></i>
            {showLogoutPopover && (
              <div
                className="popover fade show bs-popover-end"
                role="tooltip"
                style={{ zIndex: "1060" }}
              >
                <div className="arrow"></div>
                <div className="popover-body">
                  <p className="text-danger" onClick={handleLogout}>
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default UserDashBoard;
