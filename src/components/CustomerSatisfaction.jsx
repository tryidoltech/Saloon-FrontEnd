import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "../styles/CustomerSatisfaction.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CustomerSatisfaction = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Last Month',
        data: data.lastMonth,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#36A2EB',
      },
      {
        label: 'This Month',
        data: data.thisMonth,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4BC0C0',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: $${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="satisfaction-container">
      <h3>Customer Satisfaction</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CustomerSatisfaction;
