import React from 'react';
import "../styles/TopService.css";

const TopService = ({ services }) => {
  return (
    <div className="top-service-container">
      <h3>Top Service</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}>
              <td>{service.name}</td>
              <td>
                <span className={`badge ${service.color}`}>{service.sales}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopService;
