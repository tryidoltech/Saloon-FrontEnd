import React from "react";
import "../styles/AdminSettings.css";
import logo from "../assets/admin_logo.png";

const AdminSettings = () => {
  return (
    <div className="admin-settings-container">
      <h1>Settings</h1>
      <form className="admin-settings-form">
        <div className="admin-form-group">
          <label>Shop logo</label>
          <div className="admin-file-upload">
            <img
              src = {logo}
              alt="Shop Logo"
              className="admin-shop-logo"
            />
            <input type="file" accept="image/*" />
            <span>Click to upload or drag and drop</span>
            <small>SVG, PNG, JPG or GIF (max. 800x400px)</small>
          </div>
        </div>
        <div className="admin-form-group">
          <label>Shop Name</label>
          <input type="text" defaultValue="Abcd" />
        </div>
        <div className="admin-form-group">
          <label>Address</label>
          <input type="text" defaultValue="123, near prabhat" />
        </div>
        <div className="admin-form-group">
          <label>Owner Name</label>
          <input type="text" defaultValue="xyz" />
        </div>
        <div className="admin-form-group">
          <label>Contact</label>
          <input type="text" defaultValue="9026671648" />
        </div>
        <div className="admin-form-group">
          <label>Email</label>
          <input type="email" defaultValue="qwert@gmail.com" />
        </div>
        <div className="admin-form-group">
          <label>Off Days/Date</label>
          <select>
            <option>Saturday, Sunday</option>
          </select>
          <input type="text" defaultValue="21/08/24 , 30/09/24" />
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-cancel-button">
            Cancel
          </button>
          <button type="submit" className="admin-confirm-button">
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
