import React, { useState } from "react";
import Card from "../components/Card";
import ProductDetail from "../components/ProductDetail";
import ecoBagImg from "../assets/images/eco_bag.jpeg";
import solarLampImg from "../assets/images/solar-lamp.jpg";
import bambooBottleImg from "../assets/images/bamboo-bottle.jpg";

function Home() {
  const items = [
    {
      title: "Eco Bag",
      description: "Reusable eco-friendly bag",
      image: ecoBagImg,
      price: 199,
      ecoPoints: 10,
      category: "Bags",
      condition: "Gently Used",
    },
    {
      title: "Solar Lamp",
      description: "Portable solar-powered lamp",
      image: solarLampImg,
      price: 499,
      ecoPoints: 15,
      category: "Electronics",
      condition: "Like New",
    },
    {
      title: "Bamboo Bottle",
      description: "Sustainable water bottle",
      image: bambooBottleImg,
      price: 299,
      ecoPoints: 8,
      category: "Bottles",
      condition: "Used",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = (item) => {
    setSelectedProduct(item);
  };

  const handleAddEcoPoints = () => {
    if (selectedProduct) {
      window.alert(`${selectedProduct.ecoPoints} ecopoints added!`);
      setSelectedProduct(null);
    }
  };

  return (
    <section className="home">
      <h1>Welcome to EcoFinds Marketplace</h1>
      <div className="card-grid">
        {items.map((item, idx) => (
          <div
            key={idx}
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
          onAddEcoPoints={handleAddEcoPoints}
        />
      )}
    </section>
  );
}

export default Home;
