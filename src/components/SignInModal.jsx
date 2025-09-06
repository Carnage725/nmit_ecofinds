import React, { useState } from "react";

function SignInModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in/sign up logic here
    console.log("Form submitted:", formData);
    onClose(); // Close modal after submission
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: "", password: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-logo">
            <span role="img" aria-label="leaf">
              🌱
            </span>
            <span className="brand-text">EcoFinds</span>
          </div>
          <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
          <p>
            {isSignUp
              ? "Join our sustainable community"
              : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={toggleMode} className="switch-btn">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInModal;
