import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import Modal from "react-modal";
import axios from "axios";
import img from "../assets/add_product.png";
import uploadIcon from "../assets/Avatar.png";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/AdminServicesList.css";
import Loader from "../components/Loader";

// Set the app element for accessibility
Modal.setAppElement("#root"); // Adjust the ID if needed

const all_services_url = import.meta.env.VITE_API_GET_ALL_SERVICES;
const add_Services_url = import.meta.env.VITE_API_ADD_SERVICES;
const edit_services_url = import.meta.env.VITE_API_EDIT_SERVICES;
const delete_services_url = import.meta.env.VITE_API_DELETE_SERVICES;

const AdminServicesList = () => {
  const [data, setData] = useState([]);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [newService, setNewService] = useState({
    image: "",
    serviceName: "",
    price: "",
    duration: "",
    description: "",
  });
  const [editService, setEditService] = useState({
    id: "",
    image: "",
    serviceName: "",
    price: "",
    duration: "",
    description: "",
  });
  const [deleteService, setDeleteService] = useState({
    serviceName: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEditFile, setSelectedEditFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(all_services_url);
        const fetchedData = response.data.services.map((service) => ({
          id: service.id,
          image: service.imgUrl,
          serviceName: service.name,
          price: `$${service.price}.00`,
          duration: `${service.duration}min`,
          description: service.serviceDesc,
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching services data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ cell: { value } }) => (
          <img src={value} alt="Service" className="admin-service-image" />
        ),
      },
      {
        Header: "Service Name",
        accessor: "serviceName",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Action",
        Cell: ({ row: { original } }) => (
          <div className="admin-services-action-buttons">
            <FaEdit
              className="admin-services-edit-button"
              onClick={() => openEditModal(original)}
            />
            <FaTrash
              className="admin-services-delete-button"
              onClick={() => openDeleteModal(original)}
            />
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setSelectedFile(files[0]);
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setSelectedEditFile(files[0]);
    } else if (name === "price" || name === "duration") {
      // Convert value to number for price and duration
      setEditService({
        ...editService,
        [name]: name === "price" ? parseFloat(value) : parseInt(value, 10),
      });
    } else {
      setEditService({ ...editService, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleEditFileChange = (e) => {
    setSelectedEditFile(e.target.files[0]);
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleEditClick = () => {
    document.getElementById("editFileInput").click();
  };

  const getImagePreviewUrl = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return uploadIcon;
  };

  const getEditImagePreviewUrl = () => {
    if (selectedEditFile) {
      return URL.createObjectURL(selectedEditFile);
    }
    return editService.image || uploadIcon;
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newService.serviceName);
      formData.append("price", newService.price);
      formData.append("duration", newService.duration);
      formData.append("serviceDesc", newService.description);
      formData.append("img", selectedFile);

      const response = await axios.post(add_Services_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setData([
        ...data,
        {
          id: response.data.id,
          image: response.data.imgUrl,
          serviceName: response.data.name,
          price: `$${response.data.price}.00`,
          duration: `${response.data.duration}min`,
          description: response.data.serviceDesc,
        },
      ]);

      setAddModalIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding service", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editService.serviceName);
      formData.append("price", editService.price);
      formData.append("duration", editService.duration);
      formData.append("serviceDesc", editService.description);
      if (selectedEditFile) {
        formData.append("img", selectedEditFile);
      }

      const response = await axios.put(edit_services_url, formData, {});

      const updatedData = data.map((service) =>
        service.id === editService.id
          ? {
              ...editService,
              image: selectedEditFile
                ? URL.createObjectURL(selectedEditFile)
                : editService.image,
            }
          : service
      );

      setData(updatedData);
      setEditModalIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error editing service", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(delete_services_url, {
        name: deleteService.serviceName,
      });

      if (response.status === 200) {
        const updatedData = data.filter(
          (service) => service.serviceName !== deleteService.serviceName
        );
        setData(updatedData);
      }

      setDeleteModalIsOpen(false);
    } catch (error) {
      console.error("Error deleting service", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAddModal = () => {
    setAddModalIsOpen(false);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const openAddModal = () => {
    setNewService({
      image: "",
      serviceName: "",
      price: "",
      duration: "",
      description: "",
    });
    setSelectedFile(null);
    setAddModalIsOpen(true);
  };

  const openEditModal = (service) => {
    setEditService({
      id: service.id,
      image: service.image,
      serviceName: service.serviceName,
      price: parseFloat(service.price.replace("$", "").replace(".00", "")), // Ensure it's a number
      duration: parseInt(service.duration.replace("min", ""), 10), // Ensure it's a number
      description: service.description,
    });
    setSelectedEditFile(null);
    setEditModalIsOpen(true);
  };

  const openDeleteModal = (service) => {
    setDeleteService({ serviceName: service.serviceName });
    setDeleteModalIsOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="admin-services-heading">
        <h2>Services</h2>
        <button onClick={openAddModal}>Add New Service</button>
      </div>

      <table {...getTableProps()} className="admin-services-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="admin-header-row"
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="admin-header-cell">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="admin-tbody">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="admin-tbody-row">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="admin-tbody-cell">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Service Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Service"
        className="admin-service-Modal"
        overlayClassName="admin-service-Overlay"
      >
        <div className="admin-service-heading">
          <img src={img} alt="Add" className="admin-service-add-image" />
          <h2>Add Service</h2>
        </div>
        <form onSubmit={handleAddService}>
          <div className="admin-service-form-group">
            <label>Service Image</label>
            <div className="admin-service-image-upload" onClick={handleClick}>
              <img
                src={getImagePreviewUrl()}
                alt="Upload"
                className="admin-add-image"
              />
              {!selectedFile && <span>Click to upload or drag and drop</span>}
              {selectedFile && (
                <span>
                  {selectedFile.name.length > 20
                    ? `${selectedFile.name.substring(0, 20)}...`
                    : selectedFile.name}
                </span>
              )}
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="admin-service-form-group">
            <label>Service Name</label>
            <input
              type="text"
              name="serviceName"
              value={newService.serviceName}
              onChange={handleInputChange}
              placeholder="example"
              required
            />
          </div>
          <div className="admin-service-form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={newService.price}
              onChange={handleInputChange}
              placeholder="$..."
              required
            />
          </div>
          <div className="admin-service-form-group">
            <label>Duration</label>
            <input
              type="number"
              name="duration"
              value={newService.duration}
              onChange={handleInputChange}
              placeholder="eg.30"
              required
            />
          </div>
          <div className="admin-service-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newService.description}
              onChange={handleInputChange}
              placeholder="example"
              required
            />
          </div>
          <div className="admin-service-form-group">
            <button type="submit" className="admin-service-submit-button">
              Add Service
            </button>
            <button
              type="button"
              className="admin-service-cancel-button"
              onClick={closeAddModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Service"
        className="admin-service-Modal"
        overlayClassName="admin-service-Overlay"
      >
        <div className="admin-service-heading">
          <img src={img} alt="Edit" className="admin-service-add-image" />
          <h2>Edit Service</h2>
        </div>
        <form onSubmit={handleEditService}>
          <div className="admin-service-form-group">
            <label>Service Image</label>
            <div
              className="admin-service-image-upload"
              onClick={handleEditClick}
            >
              <img
                src={getEditImagePreviewUrl()}
                alt="Upload"
                className="admin-add-image"
              />
              {!selectedEditFile && (
                <span>Click to upload or drag and drop</span>
              )}
              {selectedEditFile && (
                <span>
                  {selectedEditFile.name.length > 20
                    ? `${selectedEditFile.name.substring(0, 20)}...`
                    : selectedEditFile.name}
                </span>
              )}
              <input
                type="file"
                id="editFileInput"
                style={{ display: "none" }}
                onChange={handleEditFileChange}
              />
            </div>
          </div>
          <div className="admin-service-form-group">
            <label>Service Name</label>
            <input
              type="text"
              name="serviceName"
              value={editService.serviceName}
              onChange={handleEditChange}
              disabled
              className="service_name-disabled"
            />
          </div>
          <div className="admin-service-form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={editService.price}
              onChange={handleEditChange}
              required
            />
          </div>
          <div className="admin-service-form-group">
            <label>Duration</label>
            <input
              type="number"
              name="duration"
              value={editService.duration}
              onChange={handleEditChange}
              required
            />
          </div>
          <div className="admin-service-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={editService.description}
              onChange={handleEditChange}
              required
            />
          </div>
          <div className="admin-service-form-group">
            <button type="submit" className="admin-service-submit-button">
              Save Changes
            </button>
            <button
              type="button"
              className="admin-service-cancel-button"
              onClick={closeEditModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      {/* delte confirm modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Employee"
        className="admin-service-Modal"
        overlayClassName="admin-service-Overlay"
      >
        <div className="admin-employee-heading-delete-popup">
          <h2>Confirm Deletion</h2>
        </div>
        <p>Are you sure you want to delete {deleteService.serviceName} ?</p>
        <div className="admin-employee-form-buttons-delete-popup">
          <button type="button" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button type="button" onClick={handleDeleteService}>
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AdminServicesList;
