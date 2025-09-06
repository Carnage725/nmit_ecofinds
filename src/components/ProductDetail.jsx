import React from "react";

function ProductDetail({ product, onAddToCart, onClose }) {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart();
    // Show success message or keep modal open - you decide
  };

  return (
    <div className="product-detail-modal" onClick={onClose}>
      <div
        className="product-detail-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
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
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
