import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import "../styles/ConfirmedAppointments.css";
import axios from "axios";
import Loader from "../components/Loader";
import checkicon from "../assets/check-in-icon.png";

const apiUrl = import.meta.env.VITE_API_CONFIRMED_APPOINTMENTS;
const employee_name = import.meta.env.VITE_API_PENDING_APPOINTMENTS_EMPLOYEES;
const check_in_url = import.meta.env.VITE_API_CHECK_IN_APPOINTMENTS;
const check_in_info = import.meta.env.VITE_API_CHECK_IN_APPOINTMENTS_INFO;

const ConfirmedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [employeeName, setEmployeeName] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [appointmentId, setAppointmentId] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        console.log("Data from API:", data);

        const formattedAppointments = Object.entries(data)
          .filter(([key]) => key !== "success")
          .map(([key, appointment]) => {
            if (!appointment) {
              console.log(
                `Appointment data for key ${key} is undefined or null`
              );
              return null;
            }
            const formattedAppointment = {
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
              checkIn: "Check in",
              appointmentId: key, // Add appointmentId to the formatted data
            };
            console.log("Formatted appointment data:", formattedAppointment);
            return formattedAppointment;
          })
          .filter(
            (appointment) =>
              appointment !== null &&
              appointment.clientName &&
              appointment.contact &&
              appointment.dateTime.trim() !== "-" &&
              appointment.workerAssigned
          );

        console.log(
          "Filtered and formatted appointments:",
          formattedAppointments
        );
        // Reverse the array to display newest entries first
        setAppointments(formattedAppointments.reverse());
      } catch (error) {
        console.error("API fetching error", error);
      }
    };

    const fetchEmployeeNames = async () => {
      try {
        const response = await axios.get(employee_name);
        setEmployeeName(response.data);
      } catch (error) {
        console.error("Employee names fetching error", error);
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Service Name",
        accessor: "serviceName",
        Cell: ({ value }) => (
          <div className="confirm-appt-service-list">
            {value.map((service, index) => (
              <span key={index} className="confirm-appt-service-item">
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
        accessor: "workerAssigned",
        Cell: ({ value }) => <span>{employeeName[value]?.name}</span>,
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Check in",
        accessor: "checkIn",
        Cell: ({ row }) => (
          <button
            className="confirm-appt-checkin-btn"
            onClick={() => handleCheckIn(row.original)}
          >
            Check in
          </button>
        ),
      },
    ],
    [employeeName]
  );


  const handleCheckIn = async (row) => {
    try {
      await axios.post(check_in_url, { apptId: row.appointmentId });
      console.log("Check In confirmed with Appointment ID:", row.appointmentId);

      // Remove the checked-in appointment from the list
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.appointmentId !== row.appointmentId
        )
      );
    } catch (error) {
      console.error("Error confirming check-in:", error);
    }
  };

  const handleManualCheckIn = async (newAppointmentId) => {
    try {
      const response = await axios.post(check_in_info, { apptId: newAppointmentId });
      const data = response.data;
      console.log("data found -> " , data);
      if (data.sucess) {
        setCurrentData({
          clientName: data.name,
          // workerAssigned: employeeName[data.assignedEmployee] || data.assignedEmployee,
        });
      } else {
        console.error("No appointment found with the given ID");
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  const handleAppointmentIdChange = (e) => {
    const newAppointmentId = e.target.value;
    console.log("id types is -> " , newAppointmentId);
    setAppointmentId(newAppointmentId);
    alert(appointmentId);
    if (newAppointmentId.length === 21) {
      handleManualCheckIn(newAppointmentId);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(check_in_url, { apptId: appointmentId });
      console.log("Check In confirmed with Appointment ID:", appointmentId);

      const newAppointment = {
        serviceName: response.data.services || [],
        clientName: response.data.name || "",
        contact: response.data.phone || "",
        dateTime: `${response.data.date || ""} - ${convertTo12HourFormat(response.data.time) || ""}`,
        workerAssigned: response.data.assignedEmployee || "",
        duration: response.data.duration ? convertToHoursAndMinutes(response.data.duration) : "",
        checkIn: "Checked in",
        appointmentId: appointmentId,
      };

      // Add the new appointment to the list and remove the modal
      setAppointments((prevAppointments) => [newAppointment, ...prevAppointments]);
      setShowModal(false);
      setAppointmentId("");
      setCurrentData({});
      window.reload();
    } catch (error) {
      console.error("Error confirming check-in:", error);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: appointments,
    });

  if (loading) {
    return <Loader />; // Display the loader while fetching data
  }

  return (
    <div className="confirm-appointments-container">
      <div className="confirm-appointments-header">
        <h2>Confirmed Appointments</h2>
        <button
            className="confirm-appt-checkin-btn"
            onClick={() => setShowModal(true)}
          >
            Check in
          </button>
      </div>
      <table {...getTableProps()} className="confirm-appointments-table">
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

      {/* popup modal for check in */}
      {showModal && (
        <div className="confirm-appointments-modal-overlay">
          <div className="confirm-appointments-modal-content">
            <div className="confirm-appointments-heading">
              <img src={checkicon} alt="" />
            </div>
            <h2>Check In</h2>
            <form>
              <div>
                <label>User Check In Appointment I.D</label>
                <input
                  type="text"
                  value={appointmentId}
                  onChange={handleAppointmentIdChange}
                />
              </div>
              <div>
                <label>Client Name</label>
                <input type="text" value={currentData.clientName} readOnly />
              </div>
              {/* <div>
                <label>Employee Name</label>
                <input type="text" value={currentData.workerAssigned} readOnly />
              </div> */}
              <button
                type="button"
                onClick={handleConfirm}
                className="confirm-appointments-confirm-button"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="confirm-appointments-cancel-button"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedAppointments;
