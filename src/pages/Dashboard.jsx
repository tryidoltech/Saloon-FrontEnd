import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import Cards from "../components/Cards";
import TopService from "../components/TopService";
import TotalAppointment from "../components/TotalAppointment";
import CustomerInsight from "../components/CutomerInsight";
import CustomerSatisfaction from "../components/CustomerSatisfaction";
import RevenueChart from "../components/RevenueChart";
import axios from "axios";
import ApptDashCards from "../components/ApptDashCards";
import Loader from "../components/Loader";
import booking from "../assets/booking.png";
import week_booking from "../assets/week_booking.png";
import tot_cust from "../assets/tot_cust.png";
import new_cust from "../assets/new_cust.png";
const apiUrl = import.meta.env.VITE_API_DASHBOARD;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [panelData, setPanelData] = useState([]);
  const [insightData, setInsightData] = useState({
    total_clients: [],
    new_clients: []
  });
  const [apptDashCardsData, setApptDashCardsData] = useState([]);

  const initialPanelData = [
    { id: "1", heading: "Today Booking", img: booking, panelinfo: 0 },
    { id: "2", heading: "Week Booking", img: week_booking, panelinfo: 0 },
    { id: "3", heading: "Total Customer", img: tot_cust, panelinfo: 0 },
    { id: "4", heading: "New Customer", img: new_cust, panelinfo: 0 },
  ];

  const initialApptDashCardsData = [
    { status: "Pending Appointment", count: 0, color: "#0BF4C8" },
    { status: "Confirmed Appointment", count: 0, color: "#FAD85D" },
    { status: "Checkin Appointment", count: 0, color: "#F08E71" },
    { status: "Paid Appointment", count: 0, color: "#F2A0FF" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        console.log(data);

        // Update panel data
        const todayBooking = data.todays_services.length;
        const weekBooking = data.weekly_services.length;
        const totalCustomer = data.total_clients.length;
        const newCustomer = data.new_clients.length;

        const updatedPanelData = initialPanelData.map((item) => {
          if (item.heading === "Today Booking") return { ...item, panelinfo: todayBooking };
          if (item.heading === "Week Booking") return { ...item, panelinfo: weekBooking };
          if (item.heading === "Total Customer") return { ...item, panelinfo: totalCustomer };
          if (item.heading === "New Customer") return { ...item, panelinfo: newCustomer };
          return item;
        });

        setPanelData(updatedPanelData);

        // Update appointment dashboard cards data
        const pendingCount = data.pending_appointment.length;
        const confirmedCount = data.confirmed_services.length;
        const checkinCount = data.checkedIn_services.length;
        const paidCount = data.paid_services.length;

        const updatedApptDashCardsData = initialApptDashCardsData.map((item) => {
          if (item.status === "Pending Appointment") return { ...item, count: pendingCount };
          if (item.status === "Confirmed Appointment") return { ...item, count: confirmedCount };
          if (item.status === "Checkin Appointment") return { ...item, count: checkinCount };
          if (item.status === "Paid Appointment") return { ...item, count: paidCount };
          return item;
        });

        setApptDashCardsData(updatedApptDashCardsData);

        // Update customer insight data
        setInsightData({
          total_clients: data.total_clients,
          new_clients: data.new_clients
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />; // Show loading indicator while fetching data
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-heading">
        <h3>Appointment Dashboard</h3>
      </div>
      <div className="dashboard-panel">
        {panelData.map((data) => (
          <Cards key={data.id} heading={data.heading} img={data.img} values={[data.panelinfo]} />
        ))}
      </div>
      <div className="dashboard-cards-panel2">
        {apptDashCardsData.map((data, index) => (
          <ApptDashCards key={index} status={data.status} count={data.count} color={data.color} />
        ))}
      </div>
      {/* Charts */}
      <div className="dashboard-chart-container">
        {/* <TopService services={services} /> */}
        <CustomerInsight data={insightData} />
        <TotalAppointment />
      </div>
      <div className="dashboard-chart-customer-container">
        {/* <CustomerSatisfaction data={satisfactionData} /> */}
      </div>
      {/* <div className="dashboard-chart-revenue-container">
        {/* <RevenueChart /> 
      </div> */}
    </div>
  );
};

export default Dashboard;
