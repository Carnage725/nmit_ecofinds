import React, { useState } from "react";
import Card from "../components/Card";
import ProductDetail from "../components/ProductDetail";
import ecoBagImg from "../assets/images/eco_bag.jpeg";
import solarLampImg from "../assets/images/solar-lamp.jpg";
import bambooBottleImg from "../assets/images/bamboo-bottle.jpg";
import cupImg from "../assets/images/cup.jpg";
import tvImg from "../assets/images/TV.jpg";

function Home({ onAddToCart }) {
  const items = [
    {
      id: 1,
      title: "Eco Bag",
      description: "Reusable eco-friendly bag",
      image: ecoBagImg,
      price: 199,
      ecoPoints: 10,
      category: "Bags",
      condition: "Gently Used",
    },
    {
      id: 2,
      title: "Solar Lamp",
      description: "Portable solar-powered lamp",
      image: solarLampImg,
      price: 499,
      ecoPoints: 15,
      category: "Electronics",
      condition: "Like New",
    },
    {
      id: 3,
      title: "Bamboo Bottle",
      description: "Sustainable water bottle",
      image: bambooBottleImg,
      price: 299,
      ecoPoints: 8,
      category: "Bottles",
      condition: "Used",
    },
    {
      id: 4,
      title: "Cup",
      description: "Eco-friendly reusable cup",
      image: cupImg,
      price: 99,
      ecoPoints: 5,
      category: "Cups",
      condition: "New",
    },
    {
      id: 5,
      title: "TV",
      description: "Energy-efficient television",
      image: tvImg,
      price: 2999,
      ecoPoints: 25,
      category: "Electronics",
      condition: "Refurbished",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = (item) => {
    setSelectedProduct(item);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct);
      setSelectedProduct(null);
    }
  };

  return (
    <section className="home">
      <h1>Welcome to EcoFinds Marketplace</h1>
      <div className="card-grid">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            style={{ cursor: "pointer" }}
          >
            <Card {...item} />
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

export default Home;
