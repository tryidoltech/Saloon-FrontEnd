import React from 'react';
import { useTable } from 'react-table';
import '../styles/Invoice.css';

const Invoice = () => {

  const handlePrint = () => {
    window.print();
  };

  const handleSendInvoice = () => {
    // yha per toast lagana hain
    alert('Invoice sent!');
  };

  const data = React.useMemo(
    () => [
      {
        no: 1,
        service: 'Hair Cut',
        amount: '₹499',
        finalAmount: '₹499',
      },
      {
        no: 2,
        service: 'Nails',
        amount: '₹399',
        finalAmount: '₹399',
      },
      {
        no: 3,
        service: 'Facial',
        amount: '₹999',
        finalAmount: '₹999',
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'No.',
        accessor: 'no',
      },
      {
        Header: 'Services',
        accessor: 'service',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Final Amount',
        accessor: 'finalAmount',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="invoice-container">
      <header className="invoice-header">
        <h1>Invoice</h1>
      </header>
      <section className="invoice-info">
        <div className="invoice-shop-info">
          <h2>Salon Shop</h2>
          <p>John Brandon</p>
          <p>798/1 Sector-2c, 38200 Gandhinagar, Bhopal</p>
          <p>848172194 | contact@betao.se</p>
        </div>
        <div className="invoice-details">
          <p>#2020-05-0001</p>
          <h2>₹3,030.00</h2>
        </div>
      </section>
      <section className="invoice-customer-info">
        <div className="invoice-bill-date">
          <p>Bill Date</p>
          <p>03/05/2020</p>
        </div>
        <div className="invoice-customer-details">
          <p>Willy Wonka</p>
          <p>97223041054 | willy@willy.com</p>
          <p className="invoice-note">Note</p>
          <p>
            Thank you so much for choosing our salon for your beauty needs! It was a pleasure to have you with us, and we hope you enjoyed your experience.
            We look forward to welcoming you back soon. If there's anything we can do to enhance your next visit, please let us know.
          </p>
        </div>
      </section>
      <table {...getTableProps()} className="invoice-table">
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
        <tfoot>
          <tr>
            <td colSpan="3">Amount</td>
            <td>₹1897</td>
          </tr>
          <tr>
            <td colSpan="3">Total Amount</td>
            <td>₹1897</td>
          </tr>
        </tfoot>
      </table>
      <footer className="invoice-footer">
        <button onClick={handlePrint} className="invoice-print-button">Print</button>
        <button onClick={handleSendInvoice} className="invoice-send-button">Send Invoice</button>
      </footer>
    </div>
  );
};

export default Invoice;
