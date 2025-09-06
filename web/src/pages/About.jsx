import React from "react";

function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About EcoFinds</h1>
        <p className="hero-subtitle">
          Making sustainable shopping accessible to everyone
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At EcoFinds, we believe in the power of second-hand shopping to
            create a more sustainable future. Our marketplace connects
            eco-conscious consumers with quality pre-loved items, reducing waste
            and promoting circular economy principles.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose EcoFinds?</h2>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">🌱</span>
              <h3>Eco-Friendly</h3>
              <p>
                Every purchase helps reduce environmental impact by giving items
                a second life.
              </p>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <h3>Affordable</h3>
              <p>
                Quality products at fraction of retail prices, making
                sustainability accessible.
              </p>
            </div>
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <h3>Quality Assured</h3>
              <p>
                All items are carefully vetted to ensure they meet our quality
                standards.
              </p>
            </div>
            <div className="feature">
              <span className="feature-icon">🤝</span>
              <h3>Community</h3>
              <p>
                Join a community of like-minded individuals passionate about
                sustainability.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Impact</h2>
          <div className="impact-stats">
            <div className="stat">
              <h3>10,000+</h3>
              <p>Items rehomed</p>
            </div>
            <div className="stat">
              <h3>5,000+</h3>
              <p>Happy customers</p>
            </div>
            <div className="stat">
              <h3>50 tons</h3>
              <p>Waste diverted from landfills</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Join Our Mission</h2>
          <p>
            Ready to make a difference? Whether you're buying or selling, every
            transaction on EcoFinds contributes to a more sustainable future.
            Join our community today and be part of the change!
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
