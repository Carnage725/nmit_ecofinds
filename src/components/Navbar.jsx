import React from "react";

function Navbar({
  cartCount,
  onSignUpClick,
  onSignInClick,
  onNavigate,
  currentPage,
  onCartClick,
}) {
  return (
    <header className="header">
      <nav className="navbar">
        <div
          className="navbar-brand"
          onClick={() => onNavigate("home")}
          style={{ cursor: "pointer" }}
        >
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="EcoFinds Logo" className="logo" style={{ height: 32, width: 32, marginRight: 8 }} />
          <span className="brand-text">EcoFinds</span>
        </div>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${currentPage === "home" ? "active" : ""}`}
              onClick={() => onNavigate("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${
                currentPage === "marketplace" ? "active" : ""
              }`}
              onClick={() => onNavigate("home")}
            >
              Marketplace
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${
                currentPage === "contact" ? "active" : ""
              }`}
              onClick={() => onNavigate("contact")}
            >
              Support
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === "about" ? "active" : ""}`}
              onClick={() => onNavigate("about")}
            >
              Company
            </button>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="cart-link" onClick={onCartClick} aria-label="Cart">
            <span className="cart-icon" role="img" aria-label="cart">
              🛒
            </span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="sign-in" onClick={onSignInClick}>
            Sign in
          </button>
          <button className="sign-up" onClick={onSignUpClick}>
            Sign up
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
