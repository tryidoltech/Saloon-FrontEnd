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

const Sidebar = () => {
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
            to="/"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaHome />} label="Dashboard" />
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCalendar />} label="Calendar" />
          </NavLink>

          <NavLink
            to="/allappointments"
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
              to="/pendingappointment"
              className={({ isActive }) =>
                isActive ? "navlink active" : "navlink"
              }
            >
              <MenuItem icon={<FaTags />} label="Pending Appointments" />
            </NavLink>
            <NavLink
              to="/ConfirmedAppointments"
              className={({ isActive }) =>
                isActive ? "navlink active" : "navlink"
              }
            >
              <MenuItem icon={<FaCalendar />} label="Confirmed Appointments" />
            </NavLink>
            <NavLink
              to="/CheckInAppointments"
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
              to="/PaidAppointments"
              className={({ isActive }) =>
                isActive ? "navlink active" : "navlink"
              }
            >
              <MenuItem icon={<FaPhone />} label="Paid Appointments" />
            </NavLink>
          </div>

          {/* <MenuItem icon={<FaEnvelope />} label="Inbox" />
          <MenuItem icon={<FaClipboardList />} label="Order Lists" />
          <NavLink
            to="/stockmanagement"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaBoxOpen />} label="Product Stock" />
          </NavLink> */}

          <NavLink
            to="/clientinfo"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            <MenuItem icon={<FaCalendar />} label="Client Info" />
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
          <MenuItem icon={<FaCog />} label="Settings" />
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

export default Sidebar;
