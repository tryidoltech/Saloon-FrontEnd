import React, { useState } from "react";
import "../styles/Sidebar.css";
import {
  FaHome,
  FaCalendar,
  FaEnvelope,
  FaClipboardList,
  FaBoxOpen,
  FaTags,
  FaCheckSquare,
  FaPhone,
  FaFileInvoice,
  FaThLarge,
  FaUsers,
  FaTable,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">SALOON</div>
        <div className="sidebar-menu-section">
          <NavLink
            to="/AdminPage/AppointmentDashboard"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaHome />} label="Appointment Dashboard" />
          </NavLink>

          <NavLink
            to="/AdminPage/AdminDashboard"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaHome />} label="Sales Dashboard" />
          </NavLink>

          <NavLink
            to="/AdminPage/calendar"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCalendar />} label="Calendar" />
          </NavLink>

          <NavLink
            to="/AdminPage/allappointments"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCalendar />} label="All Appointments" />
          </NavLink>

          {/* <NavLink
              to="/appointment"
              className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
            >
              <MenuItem icon={<FaCalendar />} label="Appointment" />
            </NavLink> */}

          <div className="sidebar-menu-section">
            <div className="sidebar-section-title">APPOINTMENTS</div>
            <NavLink
              to="/AdminPage/pendingappointment"
              className={({ isActive }) =>
                isActive ? "navlink active" : "navlink"
              }
            >
              <MenuItem icon={<FaTags />} label="Pending Appointments" />
            </NavLink>
            <NavLink
              to="/AdminPage/ConfirmedAppointments"
              className={({ isActive }) =>
                isActive ? "navlink active" : "navlink"
              }
            >
              <MenuItem icon={<FaCalendar />} label="Confirmed Appointments" />
            </NavLink>
            <NavLink
              to="/AdminPage/CheckInAppointments"
              className={({ isActive }) =>
                isActive ? "navlink active" : "navlink"
              }
            >
              <MenuItem
                icon={<FaCheckSquare />}
                label="Checked-In Appointmnets"
              />
            </NavLink>
            <NavLink
              to="/AdminPage/PaidAppointments"
              className={({ isActive }) =>
                isActive ? "navlink active" : "navlink"
              }
            >
              <MenuItem icon={<FaPhone />} label="Paid Appointments" />
            </NavLink>
          </div>
              
          <NavLink
            to="/AdminPage/AdminServicesList"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCalendar />} label="Services" />
          </NavLink>


          <NavLink
            to="/AdminPage/clientinfo"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCalendar />} label="Client Info" />
          </NavLink>

          <NavLink
            to="/AdminPage/AdminEmployeesPage" 
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCalendar />} label="Employees" />
          </NavLink>
          <div className="sidebar-section-title">STOCKS</div>
          <NavLink
            to="/AdminPage/stockmanagement"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaBoxOpen />} label="View Inventory" />
          </NavLink>

          <NavLink
            to="/AdminPage/AdminInventoryLogs"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaBoxOpen />} label="Inventory Logs" />
          </NavLink>
        </div>
        {/* <div className="sidebar-menu-section">
            <div className="sidebar-section-title">PAGES</div>
            <MenuItem icon={<FaTags />} label="Pricing" />
            <MenuItem icon={<FaCalendar />} label="Calendar" />
            <MenuItem icon={<FaCheckSquare />} label="To-Do" />
            <MenuItem icon={<FaPhone />} label="Contact" />
            <MenuItem icon={<FaFileInvoice />} label="Invoice" />
            <MenuItem icon={<FaThLarge />} label="UI Elements" />
            <MenuItem icon={<FaUsers />} label="Team" />
            <MenuItem icon={<FaTable />} label="Table" />
          </div> */}
        <div className="sidebar-menu-section">
          <NavLink
            to="/AdminPage/AdminSettings"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCog />} label="Settings" />
          </NavLink>
          <MenuItem icon={<FaSignOutAlt />} label="Logout" />
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label }) => (
  <div className="sidebar-menu-item">
    {icon}
    <span>{label}</span>
  </div>
);

export default AdminSidebar;
