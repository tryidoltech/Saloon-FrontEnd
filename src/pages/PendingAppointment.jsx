import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import "../styles/PendingAppointment.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const apiUrl = import.meta.env.VITE_API_PENDING_APPOINTMENTS;
const employee_name = import.meta.env.VITE_API_PENDING_APPOINTMENTS_EMPLOYEES;
const delete_appt_url = import.meta.env.VITE_API_DELETE_APPOINTMENT;
const assign_employee_url = import.meta.env.VITE_API_ASSIGN_CONFIRM_APPOINTMENT;

const PendingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [employeeName, setEmployeeName] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const formattedAppointments = Object.entries(data)
          .filter(([key]) => key !== "success")
          .map(([key, appointment]) => {
            if (!appointment) {
              console.warn(
                `Appointment data for key ${key} is undefined or null`
              );
              return null;
            }
            return {
              apptId: key, // Unique ID for the appointment
              serviceName: appointment.services || [],
              clientName: appointment.name || "",
              contact: appointment.phone || "",
              dateTime: `${appointment.date || ""} - ${
                convertTo12HourFormat(appointment.time) || ""
              }`,
              workerName: appointment.prefEmployee || "",
              duration: appointment.duration
                ? convertToHoursAndMinutes(appointment.duration)
                : "",
              assignEmployee: appointment.available_employees || "",
              cancel: "Cancel",
            };
          })
          .filter(appointment => 
            appointment !== null &&
            appointment.clientName &&
            appointment.contact &&
            appointment.dateTime.trim() !== '-' &&
            appointment.workerName
          ); // Filter out any null entries and empty/default fields

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("API fetching error", error);
      }
    };

    const fetchEmployeeNames = async () => {
      try {
        const response = await axios.get(employee_name);
        setEmployeeName(response.data);
      } catch (error) {
        console.error("employee_name fetching error", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchAppointments(), fetchEmployeeNames()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const adjustedHour = hourInt % 12 || 12;
    return `${adjustedHour}:${
      minuteInt < 10 ? `0${minuteInt}` : minuteInt
    } ${ampm}`;
  };
  
  const convertToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let result = "";
    if (hours > 0) {
      result += `${hours}h `;
    }
    if (remainingMinutes > 0) {
      result += `${remainingMinutes}m`;
    }
    return result.trim(); // Remove any trailing whitespace
  };

  const handleCancelClick = async (apptId) => {
    try {
      await axios.post(delete_appt_url, { apptId });
      // Filter out the cancelled appointment from state
      setAppointments(prevAppointments =>
        prevAppointments.filter(appointment => appointment.apptId !== apptId)
      );
      console.log(`Appointment with ID ${apptId} cancelled successfully`);
    } catch (error) {
      console.error(`Error cancelling appointment with ID ${apptId}`, error);
    }
  };

  const handleAssignClick = async (apptId, prefEmployee) => {
    try {
      await axios.post(assign_employee_url, { apptId, prefEmployee });
      // Filter out the assigned appointment from state
      setAppointments(prevAppointments =>
        prevAppointments.filter(appointment => appointment.apptId !== apptId)
      );
      console.log(`Appointment with ID ${apptId} assigned to employee ${prefEmployee} successfully`);
    } catch (error) {
      console.error(`Error assigning appointment with ID ${apptId}`, error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Service Name",
        accessor: "serviceName",
        Cell: ({ value }) => (
          <div className="pending-appt-service-list">
            {value.map((service, index) => (
              <span key={index} className="pending-appt-service-item">
                {service}
              </span>
            ))}
          </div>
        ),
      },
      {
        Header: "Client Name",
        accessor: "clientName",
      },
      {
        Header: "Contact",
        accessor: "contact",
      },
      {
        Header: "Date - Time",
        accessor: "dateTime",
      },
      {
        Header: "Preferred Worker",
        accessor: "workerName",
        Cell: ({ value }) => <span>{employeeName[value]?.name}</span>,
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Assign Employee",
        accessor: "assignEmployee",
        Cell: ({ value, row }) => (
          <select
            className="pending-appt-assign-select"
            onChange={(e) => handleAssignClick(row.original.apptId, e.target.value)}
          >
            <option value="">Assign</option>
            {Array.isArray(value)
              ? value.map((employee, index) => (
                  <option key={index} value={employee}>
                    {employeeName[employee]?.name}
                  </option>
                ))
              : null}
          </select>
        ),
      },
      {
        Header: "Cancel",
        accessor: "cancel",
        Cell: ({ row }) => (
          <button
            className="pending-appt-cancel-btn"
            onClick={() => handleCancelClick(row.original.apptId)}
          >
            Cancel
          </button>
        ),
      },
    ],
    [employeeName]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: appointments,
    });

  if (loading) {
    return <Loader />; // Display the loader while fetching data
  }

  return (
    <div className="pending-appointments-container">
      <div className="pending-appointments-header">
        <h2>Pending Appointments</h2>
        <NavLink to="/AppointmentForm" className="navlink">
          <button className="pending-add-appointment-btn">
            Add a new Appointment
          </button>
        </NavLink>
      </div>
      <table {...getTableProps()} className="pending-appointments-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PendingAppointment;
