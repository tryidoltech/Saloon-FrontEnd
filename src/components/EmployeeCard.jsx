import React from "react";
import "../styles/EmployeeCard.css";

const EmployeeCard = ({ employee, onSelect }) => {
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
    </div>
  );
};

export default EmployeeCard;
