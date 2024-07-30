import React from "react";
import "../styles/EmployeeCard.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const EmployeeCard = ({ employee, onSelect, showActions, onEdit, onDelete }) => {
  return (
    <div className="employee-card" onClick={() => onSelect(employee.id)}>
      <img
        src={employee.imgUrl}
        alt={employee.name}
        className="employee-image"
      />
      <p>
        <span>Name: </span>
        {employee.name}
      </p>
      <p>
        <span>Designation: </span>
        {employee.designation}
      </p>
      <p>
        <span>Contact: </span> {employee.phone}
      </p>
      <p>
        <span>Worker I.D: </span> {employee.id}
      </p>
      {showActions && (
        <div className="employee-actions">
          <FaEdit
            className="button"
            style={{ color: "blue" }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent onSelect from being triggered
              onEdit(); // Call the function passed from parent
            }}
          />
          <FaTrash
            className="button"
            style={{ color: "red" }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent onSelect from being triggered
              onDelete(); // Call the function passed from parent
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
