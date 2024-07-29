import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "axios";
import "../styles/AllAppointment.css";
import Loader from "../components/Loader";

const apiUrl = import.meta.env.VITE_API_ALL_APPOINTMENTS;
const employee_name = import.meta.env.VITE_API_PENDING_APPOINTMENTS_EMPLOYEES;

const AllAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [employeeName, setEmployeeName] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const formattedAppointments = Object.entries(data)
          .filter(([key]) => key !== "success")
          .map(([key, appointment]) => {
            if (!appointment) {
              console.log(`Appointment data for key ${key} is undefined or null`);
              return null;
            }
            return {
              ...appointment,
              serviceName: appointment.services || [],
              clientName: appointment.name || "",
              contact: appointment.phone || "",
              dateTime: `${appointment.date || ""} - ${convertTo12HourFormat(appointment.time) || ""}`,
              workerassigned: appointment.assignedEmployee ? employeeName[appointment.assignedEmployee]?.name || "" : "",
              duration: appointment.duration ? convertToHoursAndMinutes(appointment.duration) : "",
              status: appointment.status || "",
            };
          })
          .filter(appointment =>
            appointment !== null &&
            appointment.clientName &&
            appointment.contact &&
            appointment.dateTime.trim() !== '-' &&
            appointment.workerassigned
          ); 

        setAllAppointments(formattedAppointments);
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
  } , []);

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const adjustedHour = hourInt % 12 || 12;
    return `${adjustedHour}:${minuteInt < 10 ? `0${minuteInt}` : minuteInt} ${ampm}`;
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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FF6F6F";
      case "confirmed":
        return "#75ABFB";
      case "checkedIn":
        return "#D3DE51";
      case "paid":
        return "#16A458";
      default:
        return "#000"; // Default color if status is unknown
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Service Name",
        accessor: "serviceName",
        Cell: ({ value }) => (
          <div className="allappt-service-list">
            {value.map((service, index) => (
              <span key={index} className="allappt-service-item">
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
        Header: "Worker Assigned",
        accessor: "workerassigned",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <button
            className="allappt-status-button"
            style={{ backgroundColor: getStatusColor(value) }}
          >
            {value}
          </button>
        ),
      },
    ],
    [employeeName]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: allAppointments,
    });

  if (loading) {
    return <Loader />; // Display the loader while fetching data
  }

  return (
    <div className="allappt-container">
      <h1>All Appointments</h1>
      <table {...getTableProps()} className="allappt-table">
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

export default AllAppointments;
