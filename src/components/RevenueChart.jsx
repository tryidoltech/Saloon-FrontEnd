import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import "../styles/RevenueChart.css";

const RevenueChart = () => {
  const data = {
    labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
    datasets: [
      {
        label: 'Sales',
        data: [20, 60, 40, 50, 30, 70, 40, 60, 30, 80, 50, 70],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Profit',
        data: [30, 50, 20, 40, 60, 50, 30, 40, 70, 30, 60, 80],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: true,
        tension: 0.4,
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
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Revenue (in thousands)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
    },
  };

  return (
    <div className='revenue-chart-container'>
      <h2>Revenue</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
