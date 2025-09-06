import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <div className="footer-logo">
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt="EcoFinds Logo" className="logo" style={{ height: 22, width: 22, marginRight: 6, verticalAlign: 'middle' }} />
            <b style={{ verticalAlign: 'middle' }}>EcoFinds</b>
          </div>
          <p>
            Making sustainable shopping accessible to everyone.
            <br />
            Join our community of eco-conscious consumers.
          </p>
        </div>
        <div className="footer-section">
          <h4>Marketplace</h4>
          <ul>
            <li>
              <a href="#">Browse Products</a>
            </li>
            <li>
              <a href="#">Sell Items</a>
            </li>
            <li>
              <a href="#">Categories</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Safety Tips</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        © {new Date().getFullYear()} EcoFinds. All rights reserved. Built with
        sustainability in mind.
      </div>
    </footer>
  );
}

export default Footer;
