import React, { useEffect, useRef, useState } from "react";

/**
 * Home page styled to look similar to Amazon:
 * - Full-width hero carousel with arrows & dots
 * - Three promo cards grid with mini product thumbnails
 * - Horizontal category strip
 * - Responsive & lightweight (no external libs)
 */
export default function Home() {
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=2000",
      alt: "Work from home setup",
      caption: "Super savings on tech & home",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=2000",
      alt: "Groceries & kitchen",
      caption: "Fresh picks for your kitchen",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=2000",
      alt: "Fashion & accessories",
      caption: "Trending fashion deals",
    },
  ];

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  const go = (dir) => {
    setIndex((i) => (i + (dir === "next" ? 1 : -1) + slides.length) % slides.length);
    clearInterval(timerRef.current);
  };

  const productThumb = (src, label) => (
    <div className="promo-thumb" key={src}>
      <img src={src} alt={label} loading="lazy" decoding="async" />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="home-container">
      {/* HERO CAROUSEL */}
      <section className="hero-carousel">
        {slides.map((s, i) => (
          <div
            className={`hero-slide ${index === i ? "active" : ""}`}
            style={{ backgroundImage: `url(${s.image})` }}
            aria-hidden={index !== i}
            key={s.id}
          >
            <div className="hero-overlay">
              <h2>{s.caption}</h2>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="hero-nav left"
          aria-label="Previous"
          onClick={() => go("prev")}
        >
          ‹
        </button>
        <button
          type="button"
          className="hero-nav right"
          aria-label="Next"
          onClick={() => go("next")}
        >
          ›
        </button>

        <div className="hero-dots" role="tablist" aria-label="Slides">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              className={i === index ? "dot active" : "dot"}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="category-strip">
        {[
          ["Electronics", "📱"],
          ["Home & Kitchen", "🏺"],
          ["Fashion", "👗"],
          ["Books", "📚"],
          ["Sports", "🏃"],
          ["Beauty", "💄"],
          ["Grocery", "🛒"],
          ["Toys", "🧸"],
          ["Automotive", "🚗"],
          ["Garden", "🌿"],
        ].map(([name, icon]) => (
          <button key={name} className="category-chip" type="button">
            <span className="icon" aria-hidden>{icon}</span>
            {name}
          </button>
        ))}
      </section>

      {/* PROMO CARDS GRID */}
      <section className="promo-grid">
        <article className="promo-card">
          <h3>Revamp your home in style</h3>
          <div className="promo-thumbs">
            {productThumb(
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
              "Cushion covers"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1503602642458-232111445657?w=400",
              "Figurines"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1556912173-46c336c7fd50?w=400",
              "Home storage"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=400",
              "Lighting"
            )}
          </div>
          <button type="button" className="promo-link">Explore all</button>
        </article>

        <article className="promo-card">
          <h3>Up to 60% off | Footwear & handbags</h3>
          <div className="promo-thumbs">
            {productThumb(
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
              "Sports shoes"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1528701800489-20be3c2ea5fd?w=400",
              "Men's shoes"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
              "Women's shoes"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
              "Handbags"
            )}
          </div>
          <button type="button" className="promo-link">See all offers</button>
        </article>

        <article className="promo-card">
          <h3>Up to 75% off | Headphones</h3>
          <div className="promo-banner">
            <img
              src="https://images.unsplash.com/photo-1585386959984-a41552231658?w=900"
              alt="Headphones"
              loading="lazy"
              decoding="async"
            />
          </div>
          <button type="button" className="promo-link">Shop Now</button>
        </article>

        <article className="promo-card">
          <h3>Up to 60% off | Furniture & mattresses</h3>
          <div className="promo-thumbs">
            {productThumb(
              "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=400",
              "Mattresses"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400",
              "Office chairs"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400",
              "Sofas"
            )}
            {productThumb(
              "https://images.unsplash.com/photo-1578898887932-dce23f2b1f29?w=400",
              "Bean bags"
            )}
          </div>
          <button type="button" className="promo-link">Explore all</button>
        </article>
      </section>
    </div>
  );
}
