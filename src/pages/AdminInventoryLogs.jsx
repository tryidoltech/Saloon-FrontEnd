import React, { useEffect, useState, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import axios from "axios";
import "../styles/AdminInventoryLogs.css";
import Loader from "../components/Loader";

const inventory_logs_url = import.meta.env.VITE_API_INVENTOR_LOGS;
const employee_names_url = import.meta.env.VITE_API_PENDING_APPOINTMENTS_EMPLOYEES;

const AdminInventoryLogs = () => {
  const [logsData, setLogsData] = useState([]);
  const [employeeNames, setEmployeeNames] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch inventory logs
        const logsResponse = await axios.get(inventory_logs_url);
        const logs = logsResponse.data.log || []; // Ensure logs is an array

        // Fetch employee names
        const employeeResponse = await axios.get(employee_names_url);
        const employeeNamesData = employeeResponse.data || {}; // Ensure employeeNamesData is an object

        // Map employee IDs to names in the logs data
        const updatedLogs = logs.map((log) => ({
          employeeName: employeeNamesData[log.empId]?.name || "Unknown",
          productUsed: log.inventory_used,
          quantity: log.quantity,
          type: log.operation,
          dateTime: log.time,
        }));

        setLogsData(updatedLogs);
        setEmployeeNames(employeeNamesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Employee Name",
        accessor: "employeeName",
      },
      {
        Header: "Product Used",
        accessor: "productUsed",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Date - Time",
        accessor: "dateTime",
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: logsData,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of rows, we use page
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    state: { pageIndex },
  } = tableInstance;

  return (
    <>
      <div className="admin-inventory-logs-heading">
        <h2>Inventory Logs</h2>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <table {...getTableProps()} className="admin-inventory-logs">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="admin-inventory-pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default AdminInventoryLogs;
