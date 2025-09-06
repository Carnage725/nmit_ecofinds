import React from "react";

function ProductDetail({ product, onAddEcoPoints }) {
  if (!product) return null;
  return (
    <div className="product-detail-modal">
      <div className="product-detail-content">
        <img
          src={product.image}
          alt={product.title}
          className="product-detail-img"
        />
        <div className="product-detail-info">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>
            <b>Price:</b> ₹{product.price}
          </p>
          <p>
            <b>Eco Points:</b> {product.ecoPoints}
          </p>
          <p>
            <b>Category:</b> {product.category}
          </p>
          <p>
            <b>Condition:</b> {product.condition}
          </p>
          <button onClick={onAddEcoPoints} className="add-eco-points-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
