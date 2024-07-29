import React from "react";
import "../styles/Login.css";
import auth_img from "../assets/auth_img.png";

const Login = () => {
  return (
    <div className="sign-in">
        <div className="sign-in-headings">
            <p className="sign-in-headings-sub-heading1">Sign In to</p>
            <p className="sign-in-headings-sub-heading2">Saloon Management App</p>
            <p className="sign-in-headings-sub-heading3">Your journey to effortless salon management begins here. <br />Join us and transform your business today!</p>
        </div>
      <div className="sign-in-form">
        <div className="sign-in-form_heading">
            <p>Welcome to <span>Saloon</span></p>
            <p>Sign In</p>
        </div>
        <form className="sign-in__form">
          <label htmlFor="username">Username or email address</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username or email address"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          />
          <div className="sign-in__form__forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit">Sign in</button>
        </form>
      </div>
      <div className="sign-in-img">
        <img src={auth_img} alt="" />
      </div>
    </div>
  );
};

export default Login;
