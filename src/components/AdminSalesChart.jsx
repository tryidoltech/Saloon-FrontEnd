import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import "../styles/AdminDashboard.css";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminSalesChart = ({ totalSales, weeklyRecord }) => {
  // Convert weeklyRecord to the format required by Chart.js
  const labels = Object.keys(weeklyRecord);
  const dataValues = Object.values(weeklyRecord);
  // Calculate the maximum sales value and the y-axis max range
  const maxSales = Math.max(...dataValues);
  const yAxisMax = maxSales + (0.1 * maxSales); // Adding 10% of max sales

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sales',
        data: dataValues,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Sales Amount',
        },
        suggestedMax: yAxisMax, // Set the y-axis maximum value
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw} sales - ₹${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="admin-sales-chart-container">
      <h4>Sales ₹{totalSales}k</h4>
      <Line data={data} options={options} />
    </div>
  );
};

export default AdminSalesChart;
