import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "axios";
import Loader from "../components/Loader";
import "../styles/PaidAppointments.css";

const apiUrl = import.meta.env.VITE_API_PAID_APPOINTMENTS;

const PaidAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(apiUrl);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        console.log(data);

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
              serviceName: appointment.services || [],
              clientName: appointment.name || "",
              contact: appointment.phone || "",
              dateTime: `${appointment.date || ""} - ${
                convertTo12HourFormat(appointment.time) || ""
              }`,
              workerAssigned: appointment.assignedEmployee || "",
              duration: appointment.duration
                ? convertToHoursAndMinutes(appointment.duration)
                : "",
              payment: appointment.pymntMethod || "",
            };
          })
          .filter(appointment => 
            appointment !== null &&
            appointment.clientName &&
            appointment.contact &&
            appointment.dateTime.trim() !== '-' &&
            appointment.workerAssigned
          ); // Filter out any null entries and empty/default fields

        setAppointments(formattedAppointments);
        setLoading(false);
      } catch (error) {
        console.error("API fetching error", error);
        setLoading(false);
      }
    };

    fetchAppointments();
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Service Name",
        accessor: "serviceName",
        Cell: ({ value }) => (
          <div className="paid-appt-service-list">
            {value.map((service, index) => (
              <span key={index} className="paid-appt-service-item">
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
        accessor: "workerAssigned",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Payment",
        accessor: "payment",
        Cell: ({ value }) => (
          <button className="paid-appt-payment-btn">View Info</button>
        ),
      },
    ],
    []
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
    <div className="paid-appointments-container">
      <div className="paid-appointments-header">
        <h2>Paid Appointments</h2>
      </div>
      <table {...getTableProps()} className="paid-appointments-table">
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

export default PaidAppointments;
