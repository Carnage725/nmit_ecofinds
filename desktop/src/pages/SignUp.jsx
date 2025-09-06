import React, { useState } from "react";
import "../assets/styles/global.css";

function SignUp({ onSignInClick }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add sign up logic here
    alert("Account created!");
  };

  return (
    <div className="signup-bg">
      <div className="signup-container">
        <h2>Join EcoFinds</h2>
        <p className="signup-sub">
          Create your account and start your sustainable shopping journey
        </p>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            name="username"
            placeholder="Choose a username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a password (min. 8 characters)"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
          />
          <button type="submit" className="signup-btn">
            Create account
          </button>
        </form>
        <div className="signup-footer">
          Already have an account?{" "}
          <span className="signup-link" onClick={onSignInClick}>
            Sign in
          </span>
        </div>
      </div>
      <div className="signup-bottom-text">
        Join thousands of eco-conscious shoppers making a difference
      </div>
    </div>
  );
}

export default SignUp;
