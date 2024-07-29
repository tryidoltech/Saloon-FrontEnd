import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import "../styles/AdminDashboard.css";
import Cards from "../components/Cards";
import ApptDashCards from "../components/ApptDashCards";
import Loader from "../components/Loader";
import booking from "../assets/booking.png";
import week_booking from "../assets/week_booking.png";
import sales from "../assets/sales.png";
import AdminSalesChart from "../components/AdminSalesChart";

const apiUrl = import.meta.env.VITE_API_ADMIN_DASHBOARD;

// Function to generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const AdminDashboard = () => {
  const [panelData, setPanelData] = useState([]);
  const [apptDashCardsData, setApptDashCardsData] = useState([]);
  const [services, setServices] = useState([]);
  const [weeklyRecord, setWeeklyRecord] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.sucess) {
          setPanelData([
            { id: "1", heading: "Today Booking", img: booking, panelinfo: data.todays_booking },
            { id: "2", heading: "Week Booking", img: week_booking, panelinfo: data.weekly_booking },
            { id: "3", heading: "Total Sales", img: sales, panelinfo: data.all_sales },
            { id: "4", heading: "Weekly Sales", img: sales, panelinfo: data.weekly_sales },
          ]);

          setApptDashCardsData([
            { status: "Pending Appointment", count: data.pending_amount || 0, color: "#8280FF" },
            { status: "Confirmed Appointment", count: data.confirmed_sales || 0, color: "#FEC53D" },
            { status: "Checkin Appointment", count: data.checkedIn_sales || 0, color: "#4AD991" },
            { status: "Paid Appointment", count: data.all_sales || 0, color: "#A6B5FF" },
          ]);

          // Extract service names and sales values with random colors
          const serviceList = Object.entries(data.items_overview).map(([name, sales]) => ({
            name,
            sales,
            color: getRandomColor(), // Assign a random color
          }));
          setServices(serviceList);

          // Set weekly record data
          setWeeklyRecord(data.weeklyRecord);
        } else {
          console.error("API fetch unsuccessful");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-heading">
        <h3>Sales Dashboard</h3>
      </div>
      <div className="dashboard-panel">
        {panelData.map((data) => (
          <Cards
            key={data.id}
            heading={data.heading}
            img={data.img}
            values={[data.panelinfo]}
          />
        ))}
      </div>
      <div className="dashboard-cards-panel2">
        {apptDashCardsData.map((data, index) => (
          <ApptDashCards
            key={index}
            status={data.status}
            count={data.count}
            color={data.color}
          />
        ))}
      </div>
      {/* Charts */}
      <div className="admin-sales-chart-section">
        <div className="admin-sales-chart-box">
          <AdminSalesChart
            totalSales={panelData.find((item) => item.heading === "Total Sales")?.panelinfo || 0}
            weeklyRecord={weeklyRecord} // Pass weekly record data here
          />
        </div>
        <div className="admin-service-list-box">
          <div className="admin-services-list">
            <h4>Services</h4>
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
                      <span
                        className="admin-sales-percentage"
                        style={{ backgroundColor: service.color }} // Apply the color here
                      >
                        {service.sales}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
