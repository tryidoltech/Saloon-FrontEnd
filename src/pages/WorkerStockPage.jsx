import React from "react";
import { useState } from "react";
import { useTable } from "react-table";
import data from "../../WorkerStocksData";
import "../styles/WorkerStockPage.css"

const WorkerStockPage = () => {
  const [products, setProducts] = useState(data);

  const handleIncrement = (index) => {
    const newProducts = [...products];
    newProducts[index].quantity += 1;
    setProducts(newProducts);
  };

  const handleDecrement = (index) => {
    const newProducts = [...products];
    if (newProducts[index].quantity > 0) {
      newProducts[index].quantity -= 1;
    }
    setProducts(newProducts);
  };

  const columns = [
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ cell: { value } }) => (
        <img
          src={value}
          alt="workerstcok-product"
          className="workerstcok-product-image"
        />
      ),
    },
    {
      Header: "Product Name",
      accessor: "productName",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      Cell: ({ row, value }) => (
        <div>
          <button className = "workerstock-button" onClick={() => handleDecrement(row.index)}>-</button>
          {value}
          <button className = "workerstock-button" onClick={() => handleIncrement(row.index)}>+</button>
        </div>
      ),
    },
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });
  return (
    <div className="workerstock-container">
      <h1>Stock Management</h1>
      <table {...getTableProps()}>
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
          {rows.map((row) => {
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
    </div>
  );
};

export default WorkerStockPage;
