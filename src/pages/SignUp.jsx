import React from "react";
import "../styles/SignUp.css";
import auth_img from "../assets/auth_img.png";

const SignUp = () => {
  return (
    <div className="sign-up">
      <div className="sign-up-headings">
        <p className="sign-up-headings-sub-heading1">Sign Up to</p>
        <p className="sign-up-headings-sub-heading2">Saloon Management App</p>
        <p className="sign-up-headings-sub-heading3">
          Your journey to effortless salon management begins here. <br />
          Join us and transform your business today!
        </p>
      </div>
      <div className="sign-up-form">
        <div className="sign-up-form_heading">
          <p>
            Welcome to <span>Saloon</span>
          </p>
          <p>Sign Up</p>
        </div>
        <form className="sign-up__form">
          <label htmlFor="username">Username or email address</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username or email address"
          />
          <label htmlFor="username-name">Username</label>
          <input
            type="text"
            id="username-name"
            name="username-name"
            placeholder="Username"
          />

          <label htmlFor="contact">Contact Number</label>
          <input
            type="text"
            id="contact"
            name="contact"
            placeholder="Contact Number"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          />
          <button type="submit">Sign up</button>
        </form>
      </div>
      <div className="sign-up-img">
        <img src={auth_img} alt="" />
      </div>
    </div>
  );
};

export default SignUp;
