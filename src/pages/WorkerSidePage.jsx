import React from 'react'
import { useTable } from 'react-table';
import "../styles/WorkerSidePage.css";
import data from "../../WorkerPageData";

const columns = [
    {
      Header: 'Service Name',
      accessor: 'serviceName',
      Cell: ({ value }) => (
        <div className="workerpage-service-list">
          {value.map((service, index) => (
            <span key={index} className="workerpage-service-item">{service}</span>
          ))}
        </div>
      ),
    },
    {
      Header: 'Client Name',
      accessor: 'clientName'
    },
    {
      Header: 'Contact',
      accessor: 'contact'
    },
    {
      Header: 'Date - Time',
      accessor: 'dateTime'
    },
    {
      Header: 'Duration',
      accessor: 'duration'
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <button className="workerpage-status-button">{value}</button>
      )
    }
  ];
const WorkerSidePage = () => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
      } = useTable({
        columns,
        data,
      });

   return (
    <div className="workerpage-container">
      <h1>Your Appointment</h1>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WorkerSidePage
