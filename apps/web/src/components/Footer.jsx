import React, { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert("Thanks for subscribing!"); // wire to your API here
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer className="footer-v2" role="contentinfo">
      {/* Top: Newsletter */}
      <section className="footer-v2-newsletter" aria-labelledby="newsletter-title">
        <div className="footer-v2-shell">
          <h2 id="newsletter-title">Join our newsletter</h2>
          <p>Fresh deals & tips for sustainable living. No spam, ever.</p>
          <form className="newsletter-form" onSubmit={onSubscribe}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Middle: Links */}
      <div className="footer-v2-shell">
        <section className="footer-v2-grid">
          {/* Brand */}
          <div className="footer-v2-col">
            <div className="brand">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="EcoFinds"
                className="brand-logo"
              />
              <span className="brand-name">EcoFinds</span>
            </div>
            <p className="brand-copy">
              Making sustainable shopping accessible to everyone.
              Join our community of eco-conscious consumers.
            </p>

            <div className="social">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 7.4c.01.2.01.4.01.61 0 6.23-4.74 13.41-13.41 13.41-2.66 0-5.14-.78-7.23-2.12.37.04.74.06 1.12.06 2.21 0 4.24-.75 5.86-2.02a4.72 4.72 0 01-4.41-3.28c.3.06.6.09.92.09.44 0 .87-.06 1.28-.17A4.71 4.71 0 012.9 9.2v-.06c.66.37 1.42.6 2.23.62A4.72 4.72 0 013.2 5.45c0-.87.23-1.68.64-2.38a13.4 13.4 0 009.73 4.93 4.72 4.72 0 018.04-4.31 9.39 9.39 0 002.99-1.14 4.73 4.73 0 01-2.07 2.61 9.4 9.4 0 002.71-.74 10.12 10.12 0 01-2.54 2.95z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2A3.5 3.5 0 1012 16a3.5 3.5 0 000-7zm5.75-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/></svg>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.5V8.5L15.8 12l-6.2 3.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Columns */}
          <nav className="footer-v2-col" aria-label="Marketplace">
            <h4>Marketplace</h4>
            <ul>
              <li><a href="/browse">Browse Products</a></li>
              <li><a href="/sell">Sell Items</a></li>
              <li><a href="/categories">Categories</a></li>
            </ul>
          </nav>

          <nav className="footer-v2-col" aria-label="Support">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/safety">Safety Tips</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </nav>

          <nav className="footer-v2-col" aria-label="Company">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </nav>
        </section>

        <hr className="footer-v2-divider" />

        {/* Bottom bar */}
        <div className="footer-v2-bottom">
          <div className="legal">© {year} EcoFinds</div>
          <button
            type="button"
            className="to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
