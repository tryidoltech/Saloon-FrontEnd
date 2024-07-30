import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import axios from "axios";
import "../styles/StockManagement.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import add_product from "../assets/add_product.png";
import Loader from "../components/Loader";

const stock_data_url = import.meta.env.VITE_API_INVENTORY_STOCK_MANAGEMENT;
const add_stock_url = import.meta.env.VITE_API_ADD_STOCKS;
const edit_stocks_url = import.meta.env.VITE_API_EDIT_STOCKS;
const delete_stocks_url = import.meta.env.VITE_API_DELETE_STOCKS;

const StocksManagement = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null); // For delete index
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete modal state
  const [newProduct, setNewProduct] = useState({
    image: "",
    productName: "",
    price: "",
    piece: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  // Inventory data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(stock_data_url);
        const fetchedData = response.data;

        const formattedData = Object.keys(fetchedData).map((key) => ({
          image: fetchedData[key].imgUrl,
          productName: fetchedData[key].name,
          price: parseInt(fetchedData[key].price, 10),
          piece: parseInt(fetchedData[key].quantity, 10),
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ cell: { value } }) => (
          <img src={value} alt="Product" className="stock-product-image" />
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
        Header: "Piece",
        accessor: "piece",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="stock-action-icons">
            <FaEdit
              className="stock-edit-icon"
              onClick={() => openModal(true, row.index)}
            />
            <FaTrash className="stock-delete-icon" onClick={() => openDeleteModal(row.index)} />
          </div>
        ),
      },
    ],
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const openModal = (isEdit = false, index = null) => {
    setIsOpen(true);
    setIsEditMode(isEdit);
    setEditIndex(index);

    if (isEdit && index !== null) {
      const product = data[index];
      setNewProduct({
        image: "",
        productName: product.productName,
        price: product.price,
        piece: product.piece,
      });
      setImagePreview(product.image);
    } else {
      setNewProduct({
        image: "",
        productName: "",
        price: "",
        piece: "",
      });
      setImagePreview("");
    }
  };

  const closeModal = () => setIsOpen(false);

  const openDeleteModal = (index) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "productName" && value.length > 15) {
      return;
    }
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (isEditMode) {
      handleEditSubmit();
    } else {
      handleAddSubmit();
    }
  };

  const handleAddSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.productName);
      formData.append("quantity", newProduct.piece);
      formData.append("price", newProduct.price);

      if (newProduct.image) {
        formData.append("img", newProduct.image);
      }

      const response = await axios.post(add_stock_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newProductWithImageUrl = {
        ...newProduct,
        image: response.data.imageUrl || imagePreview,
      };

      setData((prevData) => [...prevData, newProductWithImageUrl]);

      setNewProduct({
        image: "",
        productName: "",
        price: "",
        piece: "",
      });
      setImagePreview("");
      closeModal();
    } catch (error) {
      console.error("Error uploading data: ", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      alert("handle edit ke andar");
      const formData = new FormData();
      formData.append("name", newProduct.productName);
      formData.append("quantity", newProduct.piece);
      formData.append("price", newProduct.price);

      if (newProduct.image) {
        formData.append("img", newProduct.image);
      }

      console.log("formdata ke baad");
      const response = await axios.post(edit_stocks_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("response done");

      const updatedProductWithImageUrl = {
        ...newProduct,
        image: response.data.imageUrl || imagePreview,
      };

      const updatedData = [...data];
      updatedData[editIndex] = updatedProductWithImageUrl;
      setData(updatedData);

      setNewProduct({
        image: "",
        productName: "",
        price: "",
        piece: "",
      });
      setImagePreview("");
      closeModal();
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };

  const handleDelete = async () => {
    const product = data[deleteIndex];
    try {
      await axios.post(delete_stocks_url, { name: product.productName });

      const updatedData = data.filter((_, index) => index !== deleteIndex);
      setData(updatedData);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="stock-header">
        <h2>Stock Management</h2>
        <button className="stock-add-btn" onClick={() => openModal(false)}>Add Product</button>
      </div>
      <table {...getTableProps()} className="stock-product-table">
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

      {isOpen && (
        <div className="stock-modal-overlay">
          <div className="stock-modal-content">
            <div className="stock-header-content">
              <img src={add_product} alt="" className="stock-header-img" />
              <h3 className="stock-modal-title">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h3>
            </div>
            <form className="stock-modal-form">
              <div className="stock-form-group">
                <label>
                  Product Image
                  <div className="stock-image-upload" onClick={handleClick}>
                    <input
                      type="file"
                      // id="fileInput"
                      name="image"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <div className="stock-image-preview-container">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="stock-image-preview"
                        />
                      ) : (
                        <span className="stock-placeholder-text">Click to upload or drag and drop</span>
                      )}
                    </div>
                    {newProduct.image && (
                      <div className="stock-image-name">{newProduct.image.name}</div>
                    )}
                  </div>
                </label>
              </div>
              <div className="stock-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={newProduct.productName}
                  onChange={handleInputChange}
                  placeholder="example"
                  maxLength="15"
                  disabled={isEditMode}
                  className="edit-modal-product-name"
                />
                {newProduct.productName.length > 15 && (
                  <div className="error-message">Name must be 15 characters or less</div>
                )}
              </div>
              <div className="stock-form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="100"
                />
              </div>
              <div className="stock-form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="piece"
                  value={newProduct.piece}
                  onChange={handleInputChange}
                  placeholder="20"
                />
              </div>
              <div className="stock-modal-buttons">
                <button type="button" onClick={closeModal}>Cancel</button>
                <button type="button" onClick={handleSubmit}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="stock-modal-overlay">
          <div className="stock-modal-content">
            <div className="stock-header-content">
              <h3 className="stock-modal-title">Delete Product</h3>
            </div>
            <p>Are you sure you want to delete this product?</p>
            <div className="stock-modal-buttons">
              <button type="button" onClick={closeDeleteModal}>Cancel</button>
              <button type="button" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StocksManagement;

