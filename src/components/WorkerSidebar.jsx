import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaCalendar,
    FaBars,
  } from "react-icons/fa";
const WorkerSidebar = () => {
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
            to="/Workerpage"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
          <MenuItem icon={<FaHome />} label="Appointments" />
          </NavLink>
          <NavLink
            to="/Workerpage/Workerstockpage"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
          
          <MenuItem icon={<FaCalendar />} label="Stock Management" />
          </NavLink>
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
        </div>
        <div className="sidebar-menu-section">
          <MenuItem icon={<FaCog />} label="Settings" />
          <MenuItem icon={<FaSignOutAlt />} label="Logout" />
        </div> */}
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

export default WorkerSidebar;
