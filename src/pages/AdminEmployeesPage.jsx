import React, { useEffect, useState } from "react";
import "../styles/AdminEmployeesPage.css";
import EmployeeCard from "../components/EmployeeCard";
import axios from "axios";
import Loader from "../components/Loader";
import { FaEdit, FaTrash } from "react-icons/fa";
import img from "../assets/add_product.png";
import uploadIcon from "../assets/Avatar.png";
import Modal from "react-modal";

const employee_url = import.meta.env.VITE_API_PENDING_APPOINTMENTS_EMPLOYEES;
const add_employee_url = import.meta.env.VITE_API_ADD_EMPLOYEE;
const edit_employee_url = import.meta.env.VITE_API_EDIT_EMPLOYEE;
const delete_employee_url = import.meta.env.VITE_API_DELETE_EMPLOYEE;

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    phone: "",
    designation: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(employee_url);
        const employeeData = response.data;

        console.log("Fetched employees data:", employeeData);

        const employeeArray = Object.keys(employeeData)
          .filter((key) => key !== "counter" && key !== "success")
          .map((id) => ({
            id,
            ...employeeData[id],
          }));

        setEmployees(employeeArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSelect = (id) => {
    console.log(`Selected employee ID: ${id}`);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFile(null); // Reset the selected file
    setNewEmployee({
      name: "",
      phone: "",
      designation: "",
    });
  };

  const openEditModal = (employee) => {
    console.log("Opening edit modal for:", employee);
    setSelectedEmployee(employee);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedFile(null); // Reset the selected file
    setSelectedEmployee(null);
  };

  const openDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setEmployeeToDelete(null);
  };

  const handleAddWorker = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("img", selectedFile);
    formData.append("name", newEmployee.name);
    formData.append("phone", newEmployee.phone);
    formData.append("designation", newEmployee.designation);

    try {
      const response = await axios.post(add_employee_url, formData, {});

      console.log("New worker added:", response.data);

      // Directly update the state without refetching
      const addedEmployee = response.data;
      setEmployees((prevEmployees) => [...prevEmployees, addedEmployee]);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error adding new worker:", error);
    }
  };

  const handleEditWorker = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (selectedFile) {
      formData.append("img", selectedFile);
    }
    formData.append("name", selectedEmployee.name);
    formData.append("phone", selectedEmployee.phone);
    formData.append("designation", selectedEmployee.designation);
    formData.append("empId", selectedEmployee.id);

    try {
      const response = await axios.post(edit_employee_url, formData, {});

      console.log("Worker edited:", response.data);

      // Update the employee list state
      setEmployees((prevEmployees) =>
        prevEmployees
          .map((employee) =>
            employee.id === selectedEmployee.id ? response.data : employee
          )
          .filter((employee) => employee.id !== "success")
      );
      closeEditModal();
      window.location.reload();
    } catch (error) {
      console.error("Error editing worker:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteWorker = async () => {
    try {
      await axios.post(delete_employee_url, { empId: employeeToDelete.id });

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeToDelete.id)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="admin-employee-list-container">
      <h1>Workers</h1>
      <button className="admin-add-new-member" onClick={openModal}>
        Add New Member
      </button>
      <div className="admin-employee-list">
        {employees
          .filter((employee) => employee.id !== "success")
          .map((employee) => (
            <div key={employee.id} className="employee-card-container">
              <EmployeeCard employee={employee} onSelect={handleSelect} />
              <div className="employee-actions">
                <FaEdit
                  className="button"
                  style={{ color: "blue" }}
                  onClick={() => openEditModal(employee)}
                />
                <FaTrash
                  className="button"
                  style={{ color: "red" }}
                  onClick={() => openDeleteModal(employee)}
                />
              </div>
            </div>
          ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Worker"
        className="admin-employee-Modal"
        overlayClassName="admin-employee-Overlay"
      >
        <div className="admin-employee-heading">
          <img src={img} alt="Add" className="admin-employee-add-image" />
          <h2>Add Worker</h2>
        </div>
        <form onSubmit={handleAddWorker}>
          <div className="admin-employee-form-group">
            <label>Service image</label>
            <div className="admin-employee-image-upload" onClick={handleClick}>
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Upload"
                  className="admin-add-image"
                />
              ) : (
                <img src={uploadIcon} alt="Upload" />
              )}
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
          <div className="admin-employee-form-group">
            <label>Worker Name</label>
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleChange}
              placeholder="example"
            />
          </div>
          <div className="admin-employee-form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={newEmployee.designation}
              onChange={handleChange}
              placeholder="example"
            />
          </div>
          <div className="admin-employee-form-group">
            <label>Contact</label>
            <input
              type="text"
              name="phone"
              value={newEmployee.phone}
              onChange={handleChange}
              placeholder="+91..."
            />
          </div>
          <div className="admin-employee-form-buttons">
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit">Confirm</button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Worker"
        className="admin-employee-Modal"
        overlayClassName="admin-employee-Overlay"
      >
        <div className="admin-employee-heading">
          <img src={img} alt="Edit" className="admin-employee-add-image" />
          <h2>Edit Worker</h2>
        </div>
        <form onSubmit={handleEditWorker}>
          <div className="admin-employee-form-group">
            <label>Service image</label>
            <div className="admin-employee-image-upload" onClick={handleClick}>
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Upload"
                  className="admin-add-image"
                />
              ) : selectedEmployee?.imgUrl ? (
                <img
                  src={selectedEmployee.imgUrl}
                  alt="Existing"
                  className="admin-add-image"
                />
              ) : (
                <img src={uploadIcon} alt="Upload" />
              )}
              <div className="admin-employee-image-upload-text">
                <span>Click to upload or drag and drop</span>
              </div>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="admin-employee-form-group">
            <label>Worker I.D</label>
            <input
              type="text"
              value={selectedEmployee?.id}
              disabled
              className="worker_id"
            />
          </div>
          <div className="admin-employee-form-group">
            <label>Worker Name</label>
            <input
              type="text"
              name="name"
              value={selectedEmployee?.name || ""}
              onChange={handleEditChange}
            />
          </div>
          <div className="admin-employee-form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={selectedEmployee?.designation || ""}
              onChange={handleEditChange}
            />
          </div>
          <div className="admin-employee-form-group">
            <label>Contact</label>
            <input
              type="text"
              name="phone"
              value={selectedEmployee?.phone || ""}
              onChange={handleEditChange}
            />
          </div>
          <div className="admin-employee-form-buttons">
            <button type="button" onClick={closeEditModal}>
              Cancel
            </button>
            <button type="submit">Confirm</button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Worker"
        className="admin-employee-Modal"
        overlayClassName="admin-employee-Overlay"
      >
        <div className="admin-employee-heading-delete-popup">
          <h2>Confirm Deletion</h2>
        </div>
        <p>Are you sure you want to delete {employeeToDelete?.name} ?</p>
        <div className="admin-employee-form-buttons-delete-popup">
          <button type="button" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button type="button" onClick={handleDeleteWorker}>
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminEmployeesPage;
