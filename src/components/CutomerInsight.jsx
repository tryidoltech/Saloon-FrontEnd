import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "../styles/CustomerInsight.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerInsight = ({ data }) => {
  console.log("data -> ", data);
  const new_User = data.new_clients.length;
  const old_User = data.total_clients.length - new_User;

  const chartData = {
    labels: ['New User', 'Old User'],
    datasets: [
      {
        data: [new_User, old_User],
        backgroundColor: ['#A259FF', '#ECECEC'],
        hoverBackgroundColor: ['#A259FF', '#ECECEC'],
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '75%',
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
  };

  return (
    <div className="insight-container">
      <h3>Customer Insight</h3>
      <Doughnut data={chartData} options={options} />
      <div className="insight-total">
        <p>Total Count</p>
        <h2>{data.total_clients.length}</h2>
      </div>
      <div className="insight-legend">
        <span className="legend-item">
          <span className="dot new-user"></span> New user {new_User}
        </span>
        <span className="legend-item">
          <span className="dot old-user"></span> Old User {old_User}
        </span>
      </div>
    </div>
  );
};

export default CustomerInsight;
