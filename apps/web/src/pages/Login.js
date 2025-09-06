// pages/Login.js
import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication - check demo credentials
      if (
        formData.email === "demo@ecofinds.com" &&
        formData.password === "password123"
      ) {
        const userData = {
          id: 1,
          email: formData.email,
          full_name: "Demo User",
          eco_points: 150,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        onLogin(userData);
      } else if (
        formData.email === "seller@demo.com" &&
        formData.password === "password123"
      ) {
        const userData = {
          id: 2,
          email: formData.email,
          full_name: "Demo Seller",
          eco_points: 250,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        onLogin(userData);
      } else {
        setErrors({ general: "Invalid email or password" });
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userType) => {
    if (userType === "buyer") {
      setFormData({
        email: "demo@ecofinds.com",
        password: "password123",
      });
    } else {
      setFormData({
        email: "seller@demo.com",
        password: "password123",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-section">
            <span className="logo-icon">🌱</span>
            <h1>EcoFinds</h1>
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your sustainable shopping journey</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" className="forgot-password" aria-disabled="true">
              Forgot password?
            </button></div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-text">Try the demo accounts:</p>
          <div className="demo-buttons">
            <button
              className="demo-btn buyer-demo"
              onClick={() => handleDemoLogin("buyer")}
              disabled={loading}
            >
              Demo Buyer
            </button>
            <button
              className="demo-btn seller-demo"
              onClick={() => handleDemoLogin("seller")}
              disabled={loading}
            >
              Demo Seller
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <button type="button" className="signup-link" aria-disabled="true">
              Sign up here
            </button>
          </p>
        </div>

        <div className="eco-message">
          <div className="eco-stats">
            <div className="stat">
              <span className="stat-number">1,234</span>
              <span className="stat-label">Items Saved</span>
            </div>
            <div className="stat">
              <span className="stat-number">89%</span>
              <span className="stat-label">CO₂ Reduced</span>
            </div>
            <div className="stat">
              <span className="stat-number">567</span>
              <span className="stat-label">Happy Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
