import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/SaloonCalender.css";

const apiurl = import.meta.env.VITE_API_CALENDER_TIME_SLOTS_WISE_DATA;
const employee_url = import.meta.env.VITE_API_PENDING_APPOINTMENTS_EMPLOYEES;

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

const services = {
  "1721372236692ch786543": "hair-colouring",
  "1721372178803ch786543": "beard-grooming",
  "1721294571091Da786543": "blow-dry",
  "1721298452876Dh786543": "balinese-massage",
  "1721372872117hu786543": "hair-cut",
};

const SaloonCalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [appointments, setAppointments] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(employee_url);
        const employeeData = response.data;
        const employeeArray = Object.keys(employeeData)
          .filter((key) => key !== "success")
          .map((key) => ({ id: key, name: employeeData[key]?.name, role: "" }));

        setEmployees(employeeArray);
      } catch (error) {
        console.error("Error fetching employee data", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.post(apiurl, {
          date: currentDate.toISOString().split("T")[0].split("-").reverse().join("-"),
        });
        setAppointments(response.data || {});
      } catch (error) {
        console.error("Error fetching appointments data", error);
        setAppointments({});
      }
    };

    fetchEmployees();
    fetchAppointments();
  }, [currentDate]);

  const handlePrevDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const adjustedHour = hourInt % 12 || 12;
    return `${adjustedHour}:${minuteInt < 10 ? `0${minuteInt}` : minuteInt} ${ampm}`;
  };

  const getAppointmentStyle = (serviceId) => {
    return services[serviceId] || "default-service";
  };

  return (
    <div className="employee-calendar">
      <div className="calendar-controls">
        <button onClick={handlePrevDay} className="nav-button">&lt;</button>
        <button onClick={handleToday} className="nav-button">Today</button>
        <button onClick={handleNextDay} className="nav-button">&gt;</button>
        <div className="date-display">
          <DatePicker
            selected={currentDate}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
            className="styled-date-picker"
          />
        </div>
        <button className="add-button">Add New</button>
      </div>
      <div className="employee-body">
        <div className="employee-time-slots">
          <h3 className="calendar-separation">Time-Slots</h3>
          {timeSlots.map((slot, index) => (
            <div key={index} className="employee-time-slot">
              {convertTo12HourFormat(slot)}
            </div>
          ))}
        </div>
        <div className="employee-columns">
          {employees.map((employee) => (
            <div key={employee.id} className="employee-column">
              <div className="employee-column-header">
                <strong>{employee.name}</strong>
              </div>
              <div className="employee-appointments">
                {timeSlots.map((slot) => (
                  <div key={slot} className="employee-appointment-slot">
                    {appointments[slot] && appointments[slot][employee.id] ? (
                      <div
                        className={`employee-appointment ${getAppointmentStyle(
                          appointments[slot][employee.id]
                        )}`}
                      >
                        <span>{convertTo12HourFormat(slot)}</span>
                        <br />
                        <span>{services[appointments[slot][employee.id]]}</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaloonCalender;
