// components/Navbar.js
import React from "react";

const Navbar = ({
  cartCount,
  user,
  ecoPoints,
  onSignInClick,
  onSignUpClick,
  onNavigate,
  onCartClick,
  onLogout,
  currentPage,
}) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => onNavigate("home")}>
          <span className="logo-icon">🌱</span>
          <span className="logo-text">EcoFinds</span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === "home" ? "active" : ""}`}
            onClick={() => onNavigate("home")}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentPage === "listings" ? "active" : ""}`}
            onClick={() => onNavigate("listings")}
          >
            Browse
          </button>
          <button
            className={`nav-link ${currentPage === "about" ? "active" : ""}`}
            onClick={() => onNavigate("about")}
          >
            About
          </button>
          <button
            className={`nav-link ${currentPage === "contact" ? "active" : ""}`}
            onClick={() => onNavigate("contact")}
          >
            Contact
          </button>
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          {/* Eco Points Display */}
          {user && (
            <div className="eco-points">
              <span className="eco-icon">⭐</span>
              <span className="points-text">{ecoPoints} EcoPoints</span>
            </div>
          )}

          {/* Cart */}
          <button className="cart-button" onClick={onCartClick}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Authentication */}
          {user ? (
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => onNavigate("profile")}
              >
                <span className="user-icon">👤</span>
                <span className="user-name">
                  {user.full_name.split(" ")[0]}
                </span>
              </button>
              <div className="user-dropdown">
                <button onClick={() => onNavigate("profile")}>Profile</button>
                <button onClick={() => onNavigate("purchase-history")}>
                  Orders
                </button>
                <button onClick={onLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="sign-in-btn" onClick={onSignInClick}>
                Sign In
              </button>
              <button className="sign-up-btn" onClick={onSignUpClick}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
