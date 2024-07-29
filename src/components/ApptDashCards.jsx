import React from 'react';
import '../styles/ApptDashCards.css';

const ApptDashCards = ({status , count , color}) => {
  return (
    <div className="apptdash-cards-container">
        <div className="apptdash-card" style={{ backgroundColor: color }}>
          <div className="apptdash-card-title">{status} <span>Amount</span></div>
          <div className="apptdash-card-count">{count}</div>
        </div>
    </div>
  );
};

export default ApptDashCards;
