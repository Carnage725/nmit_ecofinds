// pages/ProductDetail.js
import React, { useState, useEffect } from "react";

const ProductDetail = ({ productId, onAddToCart, onToggleChat }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Mock product data
        const mockProducts = {
          1: {
            id: 1,
            title: "Used Laptop - Dell Inspiron 15",
            description:
              "Excellent condition Dell Inspiron 15 with Intel i5 processor, 8GB RAM, and 256GB SSD. Perfect for students and professionals. Includes original charger and carrying case. Minor wear on corners but fully functional. Battery life still great - around 6-7 hours of normal use.",
            category: "Electronics",
            price: 22000,
            seller_id: 1,
            seller_name: "Tech Seller",
            seller_rating: 4.8,
            images: [
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
              "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
              "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
            ],
            specifications: {
              Processor: "Intel Core i5-8250U",
              RAM: "8GB DDR4",
              Storage: "256GB SSD",
              Display: '15.6" Full HD',
              Graphics: "Intel UHD Graphics 620",
              Battery: "42WHr, 6-7 hours",
              Weight: "2.2 kg",
              Condition: "Used - Excellent",
            },
            eco_benefits: [
              "Saves 70% CO2 emissions vs buying new",
              "Extends product lifecycle",
              "Reduces e-waste",
            ],
            is_available: true,
            created_at: new Date().toISOString(),
          },
          2: {
            id: 2,
            title: "Solid Wood Dining Chair",
            description:
              "Beautiful solid wood dining chair with elegant design. Made from sustainable oak wood with natural finish. Shows minor scratches from normal use but structurally sound and comfortable. Perfect for eco-conscious homes.",
            category: "Furniture",
            price: 1500,
            seller_id: 1,
            seller_name: "Furniture Lover",
            seller_rating: 4.6,
            images: [
              "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
            ],
            specifications: {
              Material: "Solid Oak Wood",
              Dimensions: "45cm x 55cm x 85cm",
              Weight: "6 kg",
              Finish: "Natural Oil",
              Style: "Modern Minimalist",
              Condition: "Used - Good",
            },
            eco_benefits: [
              "Sustainable wood source",
              "No harmful chemicals",
              "Reduces furniture waste",
            ],
            is_available: true,
            created_at: new Date().toISOString(),
          },
        };

        const product = mockProducts[productId] || mockProducts[1];
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.title}
              className="product-main-image"
            />
          </div>
          {product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className={`thumbnail ${
                    index === selectedImageIndex ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <span className="product-category">{product.category}</span>
            <h1 className="product-title">{product.title}</h1>
            <div className="seller-info">
              <span className="seller-name">
                Sold by: {product.seller_name}
              </span>
              <span className="seller-rating">⭐ {product.seller_rating}</span>
            </div>
          </div>

          <div className="product-price">
            <span className="price">₹{product.price.toLocaleString()}</span>
            <span className="price-note">Negotiable</span>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Eco Benefits */}
          <div className="eco-benefits">
            <h3>🌱 Environmental Benefits</h3>
            <ul>
              {product.eco_benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* Add to Cart Section */}
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="add-to-cart-btn-large"
                onClick={handleAddToCart}
              >
                Add to Cart - ₹{(product.price * quantity).toLocaleString()}
              </button>
              <button className="chat-seller-btn" onClick={onToggleChat}>
                💬 Chat with Seller
              </button>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="product-specifications">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Trust */}
          <div className="safety-info">
            <h3>🛡️ Safe Transaction</h3>
            <ul>
              <li>✓ Verified seller</li>
              <li>✓ Secure payment processing</li>
              <li>✓ Return policy available</li>
              <li>✓ Buyer protection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products">
        <h2>Similar Products</h2>
        <div className="related-grid">
          {/* Mock related products */}
          {[
            {
              id: 3,
              title: "Gaming Laptop",
              price: 35000,
              image:
                "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300",
            },
            {
              id: 4,
              title: "Office Chair",
              price: 2500,
              image:
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300",
            },
            {
              id: 5,
              title: "Desk Lamp",
              price: 800,
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
            },
          ].map((item) => (
            <div key={item.id} className="related-item">
              <img src={item.image} alt={item.title} />
              <h4>{item.title}</h4>
              <p>₹{item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
