import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! We'll get back to you shortly.");
  };

  return (
    <div className="contact-container">
      <header className="contact-hero">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you</p>
      </header>

      <div className="contact-grid">
        {/* Left: Info */}
        <section className="contact-info">
          <h2>Get in Touch</h2>
          <p className="contact-lead">
            Have questions about EcoFinds? Need help with your account? Or want to share feedback? We're here to help!
          </p>

          <ul className="contact-list">
            <li>
              <span className="contact-icon" aria-hidden>📧</span>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">support@ecofinds.com</div>
              </div>
            </li>
            <li>
              <span className="contact-icon" aria-hidden>📞</span>
              <div>
                <div className="contact-label">Phone</div>
                <div className="contact-value">+91 12345 67890</div>
              </div>
            </li>
            <li>
              <span className="contact-icon" aria-hidden>📍</span>
              <div>
                <div className="contact-label">Address</div>
                <div className="contact-value">123 Eco Street<br/>Green City, GC 12345</div>
              </div>
            </li>
          </ul>
        </section>

        {/* Right: Form */}
        <section className="contact-form">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option>Account Support</option>
                <option>Buying &amp; Selling</option>
                <option>Report a Problem</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                rows={6}
                required
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Contact;
