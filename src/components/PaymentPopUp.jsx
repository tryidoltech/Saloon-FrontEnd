import React, { useState } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import "../styles/PaymentPopUp.css";

const PaymentPopUp = ({ appt, totalAmount, onClose }) => {
  const [inputValue, setInputValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const handleInputChangeqr = (event) => {
    setInputValue(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleMarkAsPaid = async () => {
    const paymentDetails = {
      apptId: appt.apptId,
      pymntMethod: paymentMethod,
      recvdAmount: totalAmount,
      txnId: paymentMethod === "cash" ? null : inputValue || null,
    };

    try {
      const response = await axios.post(import.meta.env.VITE_API_PAYMENT, paymentDetails);
      console.log("Payment response:", response.data);
      // Handle the response as needed
      onClose();
    } catch (error) {
      console.error("Error processing payment", error);
      // Handle error as needed
    }
  };

  return (
    <div className="payment-popup-overlay">
      <div className="payment-popup">
        <div className="payment-popup-header">
          <h2>Payment Window</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="payment-popup-content">
          <div className="payment-method">
            <p>Payment Method</p>
            <label>
              Cash
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={handlePaymentMethodChange}
              />
            </label>
            <label className="upi-label">
              UPI
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={handlePaymentMethodChange}
              />
            </label>
            <label>
              Card
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={handlePaymentMethodChange}
              />
            </label>
          </div>
          {paymentMethod !== "cash" && (
            <div className="payment-details">
              <div className="payment-details-tid">
                <p>Transaction ID</p>
                <label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChangeqr}
                    placeholder="Enter transaction ID"
                  />
                </label>
              </div>
              <div className="qrcode-container">
                {inputValue && <QRCode value={inputValue} />}
              </div>
            </div>
          )}
          <div className="payment-total">
            <p>
              Total Amount: <span>{totalAmount}</span>
            </p>
          </div>
          <button className="mark-as-paid" onClick={handleMarkAsPaid}>
            Mark as Paid
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopUp;
