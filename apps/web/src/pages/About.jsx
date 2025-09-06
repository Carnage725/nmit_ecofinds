import React from "react";

function About() {
  return (
    <div className="about-container">
      <header className="about-hero">
        <h1>About EcoFinds</h1>
        <p className="about-subtitle">
          Making sustainable shopping accessible to everyone
        </p>
      </header>

      <main className="about-content">
        {/* Mission */}
        <section className="about-section">
          <h2>Our Mission</h2>
          <p className="about-paragraph">
            At <b>EcoFinds</b>, we believe in the power of second-hand shopping to create a more sustainable future.
            Our marketplace connects eco-conscious consumers with quality pre-loved items, reducing waste and promoting
            circular economy principles.
          </p>
        </section>

        {/* Why Choose */}
        <section className="about-section">
          <h2>Why Choose EcoFinds?</h2>
          <div className="about-features">
            <article className="about-feature">
              <div className="feature-icon" aria-hidden>🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Every purchase helps reduce environmental impact by giving items a second life.</p>
            </article>
            <article className="about-feature">
              <div className="feature-icon" aria-hidden>💰</div>
              <h3>Affordable</h3>
              <p>Quality products at a fraction of retail prices, making sustainability accessible.</p>
            </article>
            <article className="about-feature">
              <div className="feature-icon" aria-hidden>✅</div>
              <h3>Quality Assured</h3>
              <p>All items are carefully vetted, making sure you get the quality you expect.</p>
            </article>
            <article className="about-feature">
              <div className="feature-icon" aria-hidden>🤝</div>
              <h3>Community</h3>
              <p>Join a community of like-minded individuals passionate about sustainability.</p>
            </article>
          </div>
        </section>

        {/* Impact */}
        <section className="about-section">
          <h2>Our Impact</h2>
          <div className="about-stats">
            <div className="stat-card">
              <div className="stat-value">10,000+</div>
              <div className="stat-label">Items rehomed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">5,000+</div>
              <div className="stat-label">Happy customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">50 tons</div>
              <div className="stat-label">Waste diverted from landfills</div>
            </div>
          </div>
        </section>

        {/* Join */}
        <section className="about-section">
          <h2>Join Our Mission</h2>
          <p className="about-paragraph">
            Ready to make a difference? Whether you're buying or selling, every transaction on EcoFinds contributes to
            a more sustainable future. Join our community today and be part of the change!
          </p>
        </section>
      </main>
    </div>
  );
}

export default About;
