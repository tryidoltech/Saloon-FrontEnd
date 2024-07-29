import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "axios";
import Loader from "../components/Loader";
import "../styles/ClientInfo.css";

const apiUrl = import.meta.env.VITE_API_ALL_CLIENT_INFO;
const client_info_url = import.meta.env.VITE_API_CLIENT_INFO_DETAILS;

const ClientInfo = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const formattedClients = Object.entries(data)
          .filter(([key]) => key !== "success")
          .map(([key, client]) => {
            if (!client) {
              console.warn(`Client data for key ${key} is undefined or null`);
              return null;
            }
            return {
              name: client.name || "",
              email: client.email || "",
              phone: client.phone || "",
              gender: client.gender === "M" ? "Male" : "Female" || "",
              pincode: client.pincode || "",
            };
          })
          .filter(
            (client) =>
              client !== null &&
              client.name &&
              client.email &&
              client.phone &&
              client.gender &&
              client.pincode
          );

        setClients(formattedClients);
        setLoading(false);
      } catch (error) {
        console.error("API fetching error", error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleViewInfo = async (phone) => {
    console.log("Fetching info for phone:", phone);
    try {
      const response = await axios.post(client_info_url, { phone });
      const data = response.data;
  
      console.log("Response data:", data);
  
      if (data.sucess) {
        const allServices = [];
        Object.values(data).forEach((appointment) => {
          if (appointment.services) {
            allServices.push(...appointment.services);
          }
        });
  
        setServices(allServices);
        console.log("Services fetched:", allServices);
        setShowPopup(true);
      } else {
        console.error("Failed to fetch client details.");
      }
    } catch (error) {
      console.error("Error fetching client details: ", error);
    }
  };
  

  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone.no", accessor: "phone" },
      { Header: "Gender", accessor: "gender" },
      { Header: "Pincode", accessor: "pincode" },
      {
        Header: "View Information",
        accessor: "viewInfo",
        Cell: ({ row }) => (
          <button
            className="client-info-button"
            onClick={() => handleViewInfo(row.original.phone)}
          >
            View Info
          </button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: clients,
    });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="client-info-container">
      <h1>Client Information</h1>
      <table {...getTableProps()} className="client-info-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {showPopup && (
        <div className="client-popup">
          <div className="client-popup-content">
            <h2>Services</h2>
            <ul className="service-list">
              {services.map((service, index) => (
                <li key={index} className="service-item">{service}</li>
              ))}
            </ul>
            <button className="client-info-button" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInfo;
