import React, { useEffect, useState } from "react";
import "../styles/WorkerAppointment.css";
import EmployeeCard from "../components/EmployeeCard";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const available_employees_url = import.meta.env.VITE_API_WORKER_APPOINTMENT_AVAILBLE_EMPLOYEES;
const employees_url = import.meta.env.VITE_API_PENDING_APPOINTMENTS_EMPLOYEES;
const create_appointment_url = import.meta.env.VITE_API_CREATE_APPOINTMENT;

const WorkerAppointment = () => {
  const { state } = useLocation();
  const { formData } = state || {};
  const [availableEmployeeIds, setAvailableEmployeeIds] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertToMilitaryTime = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  // console.log(formData);
  useEffect(() => {
    if (formData) {
      const fetchAvailableEmployees = async () => {
        try {
          const formattedDate = formatDate(formData.date);
          // console.log(formattedDate);
          const militaryTimeSlot = convertToMilitaryTime(formData.time);

          const response = await axios.post(
            available_employees_url,
            { ...formData, date: formattedDate, time: militaryTimeSlot }
          );

          const matchingEmployeeIds = response.data;
          // console.log("Matching Employee IDs:", matchingEmployeeIds);
          setAvailableEmployeeIds(matchingEmployeeIds);

          // Fetch employee details based on IDs
          const employeeIdsQuery = matchingEmployeeIds.join(",");
          console.log("employeeIdsQuery ", employeeIdsQuery);
          const employeeResponse = await axios.get(`${employees_url}?ids=${employeeIdsQuery}`);
          const employeeData = employeeResponse.data;
          console.log("employeeData ", employeeData);

          const employeeDetails = matchingEmployeeIds.map((id) => ({
            id,
            name: employeeData[id]?.name,
            designation: employeeData[id]?.designation,
            imgUrl: employeeData[id]?.imgUrl,
            phone: employeeData[id]?.phone,
          }))
          .filter((employee) => employee.name && employee.designation && employee.phone);
          console.log("employeeDetails ", employeeDetails);
          setEmployees(employeeDetails);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching available employees:", error);
          setError(error);
          setLoading(false);
        }
      };

      fetchAvailableEmployees();
    }
  }, [formData]);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleCreateAppointment = async () => {
    if (selectedEmployeeId && formData) {
      try {
        // Reverse the date format
        setLoading(true);
        const formattedDate = reverseDateFormat(formData.date);
        console.log(formattedDate);
        
        // Prepare appointment data including the reversed date
        const appointmentData = { ...formData, prefEmployee: selectedEmployeeId, date: formattedDate };
        
        // Send POST request to create appointment
        await axios.post(create_appointment_url, appointmentData);
        
        // Navigate to the confirmed appointments page
        navigate("/ConfirmedAppointments");
        setLoading(false);
      } catch (error) {
        console.error("Error creating appointment:", error);
        setError(error);
      }
    }
  };
  
  // Function to reverse the date format (assuming input is in "dd-mm-yyyy" format)
  const reverseDateFormat = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };
  

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="worker-appt-container">
        <h1>Workers Available</h1>
        <div className="worker-appt-list">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onSelect={handleEmployeeSelect}
            />
          ))}
        </div>
      </div>
      <div className="worker-appt-button-div">
        <button
          className="worker-create-appointment"
          onClick={handleCreateAppointment}
          disabled={!selectedEmployeeId}
        >
          Create Appointment
        </button>
      </div>
    </div>
  );
};

export default WorkerAppointment;
