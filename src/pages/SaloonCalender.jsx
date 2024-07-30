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

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
          .map((key) => ({
            id: key,
            name: employeeData[key]?.name,
            designation: employeeData[key]?.designation,
            imgUrl: employeeData[key]?.imgUrl,
          }));

        setEmployees(employeeArray);
      } catch (error) {
        console.error("Error fetching employee data", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.post(apiurl, {
          date: currentDate
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-"),
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

  const getMergedAppointments = () => {
    const merged = {};
    employees.forEach((employee) => {
      merged[employee.id] = [];
      let lastEnd = null;

      Object.entries(appointments).forEach(([timeSlot, employeeData]) => {
        const appointment = employeeData[employee.id];
        if (appointment) {
          const [hours, minutes] = appointment.time.split(":");
          const startTime = new Date(currentDate);
          startTime.setHours(hours, minutes, 0, 0);
          const durationMinutes = appointment.duration;
          const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

          if (!lastEnd || startTime > lastEnd) {
            // Add new appointment block
            merged[employee.id].push({
              start: appointment.time,
              end: `${endTime.getHours()}:${String(endTime.getMinutes()).padStart(2, "0")}`,
              details: appointment,
            });
            lastEnd = endTime;
          }
        }
      });
    });
    return merged;
  };

  const mergedAppointments = getMergedAppointments();

  return (
    <div className="employee-calendar">
      <div className="calendar-controls">
        <button onClick={handlePrevDay} className="nav-button">
          &lt;
        </button>
        <button onClick={handleToday} className="nav-button">
          Today
        </button>
        <button onClick={handleNextDay} className="nav-button">
          &gt;
        </button>
        <div className="date-display">
          <DatePicker
            selected={currentDate}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
            className="styled-date-picker"
          />
        </div>
      </div>
      <div className="employee-list">
        {employees.map((employee) => (
          <div key={employee.id} className="employee-item">
            <img
              src={employee.imgUrl}
              alt={employee.name}
              className="employee-image"
            />
            <span className="employee-name">{employee.name}</span>
          </div>
        ))}
      </div>
      <div className="calendar-body">
        <div className="employee-time-slots">
          {timeSlots.map((slot, index) => (
            <div key={index} className="employee-time-slot">
              {convertTo12HourFormat(slot)}
            </div>
          ))}
        </div>
        <div className="employee-columns">
          {employees.map((employee) => (
            <div key={employee.id} className="employee-column">
              {mergedAppointments[employee.id].map((block, index) => {
                const startIndex = timeSlots.indexOf(block.start);
                const duration = Math.ceil(block.details.duration / 30);
                return (
                  <div
                    key={index}
                    className="employee-appointment-slot"
                    style={{
                      gridRowStart: startIndex + 1,
                      gridRowEnd: `span ${duration}`,
                    }}
                  >
                    <div
                      className="employee-appointment"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      <span>
                        {convertTo12HourFormat(block.start)} -{" "}
                        {convertTo12HourFormat(block.end)}
                      </span>
                      <br />
                      <span>{block.details.services.join(", ")}</span>
                      <br />
                      <span>{employee.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaloonCalender;
