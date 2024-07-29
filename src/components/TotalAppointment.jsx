import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "../styles/TotalAppointment.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const apiUrl = import.meta.env.VITE_API_DASHBOARD;

const TotalAppointment = () => {
  const [appointmentData, setAppointmentData] = useState({
    online: [],
    offline: [],
    labels: [],
  });

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const weeklyRecord = response.data.weeklyRecord;

        const dates = Object.keys(weeklyRecord);
        const onlineData = dates.map((date) => (weeklyRecord[date].online ? weeklyRecord[date].online.length : 0));
        const offlineData = dates.map((date) => (weeklyRecord[date].offline ? weeklyRecord[date].offline.length : 0));

        setAppointmentData({ online: onlineData, offline: offlineData, labels: dates });
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    fetchAppointmentData();
  }, []);
  const maxDataValue = Math.max(...[...appointmentData.online, ...appointmentData.offline]) + 5;
  const chartData = {
    labels: appointmentData.labels,
    datasets: [
      {
        label: "Online",
        data: appointmentData.online,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Offline",
        data: appointmentData.offline,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Appointment",
        font: {
          size: 18,
          margin: 20,
          weight: "bold",
        },
        color: "#333",
        align: "start",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxDataValue,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TotalAppointment;
