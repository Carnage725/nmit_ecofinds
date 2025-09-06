// pages/OrderConfirmation.js
import React from "react";

const OrderConfirmation = ({ order }) => {
  if (!order) {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-container">
          <h2>Order not found</h2>
          <p>Please check your order details.</p>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          <h1>Order Confirmed!</h1>
          <p className="success-message">
            Thank you for your sustainable purchase! Your order has been
            confirmed and will be processed soon.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="order-details-card">
          <div className="order-header">
            <h2>Order Details</h2>
            <div className="order-meta">
              <span className="order-number">Order #ECO{order.id}</span>
              <span className="order-date">
                {new Date(order.date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items">
            <h3>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title}
                  />
                </div>
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p className="item-category">{item.category}</p>
                  <div className="item-meta">
                    <span className="quantity">Qty: {item.quantity}</span>
                    <span className="price">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="price-summary">
            <div className="price-row">
              <span>Subtotal</span>
              <span>
                ₹
                {(
                  order.total -
                  (order.shipping || 0) -
                  (order.tax || 0)
                ).toLocaleString()}
              </span>
            </div>
            {order.shipping > 0 && (
              <div className="price-row">
                <span>Shipping</span>
                <span>₹{order.shipping}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="price-row">
                <span>Tax (GST)</span>
                <span>₹{order.tax.toFixed(0)}</span>
              </div>
            )}
            {order.ecoPointsUsed > 0 && (
              <div className="price-row discount">
                <span>EcoPoints Discount ({order.ecoPointsUsed} points)</span>
                <span>-₹{(order.ecoPointsUsed * 10).toFixed(0)}</span>
              </div>
            )}
            <div className="price-row total">
              <span>
                <strong>Total Paid</strong>
              </span>
              <span>
                <strong>₹{order.total.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="shipping-info-card">
          <h3>📦 Shipping Information</h3>
          <div className="shipping-details">
            <div className="delivery-timeline">
              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Order Confirmed</h4>
                  <p>Your order has been confirmed</p>
                  <span className="timestamp">Just now</span>
                </div>
              </div>
              <div className="timeline-item pending">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Processing</h4>
                  <p>Seller is preparing your order</p>
                  <span className="timestamp">Within 24 hours</span>
                </div>
              </div>
              <div className="timeline-item pending">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Shipped</h4>
                  <p>Your order is on the way</p>
                  <span className="timestamp">2-3 business days</span>
                </div>
              </div>
              <div className="timeline-item pending">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Delivered</h4>
                  <p>Order arrives at your doorstep</p>
                  <span className="timestamp">
                    Expected by {estimatedDelivery.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="delivery-address">
              <h4>Delivery Address</h4>
              <div className="address">
                <p>
                  <strong>{order.shipping?.fullName}</strong>
                </p>
                <p>{order.shipping?.address}</p>
                <p>
                  {order.shipping?.city}, {order.shipping?.state}{" "}
                  {order.shipping?.pincode}
                </p>
                <p>{order.shipping?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* EcoPoints Earned */}
        <div className="eco-points-earned">
          <div className="eco-card">
            <div className="eco-icon">🌱</div>
            <div className="eco-content">
              <h3>EcoPoints Earned!</h3>
              <div className="points-earned">
                <span className="points-number">
                  +{Math.floor(order.total / 100)}
                </span>
                <span className="points-label">EcoPoints</span>
              </div>
              <p>
                You've earned {Math.floor(order.total / 100)} EcoPoints for this
                sustainable purchase!
              </p>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="environmental-impact">
          <h3>🌍 Your Environmental Impact</h3>
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-icon">🌱</div>
              <div className="impact-content">
                <span className="impact-value">45kg</span>
                <span className="impact-label">CO₂ Saved</span>
                <p>vs buying new</p>
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">♻️</div>
              <div className="impact-content">
                <span className="impact-value">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
                <span className="impact-label">Items Reused</span>
                <p>Extended lifecycle</p>
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-icon">💧</div>
              <div className="impact-content">
                <span className="impact-value">120L</span>
                <span className="impact-label">Water Saved</span>
                <p>Manufacturing water</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button
            className="primary-btn"
            onClick={() => window.location.reload()}
          >
            Continue Shopping
          </button>
          <button className="secondary-btn">Track Your Order</button>
          <button className="secondary-btn">View Invoice</button>
        </div>

        {/* Contact Support */}
        <div className="support-section">
          <h3>Need Help?</h3>
          <p>
            If you have any questions about your order, feel free to{" "}
            <a href="#contact" className="support-link">
              contact our support team
            </a>
            .
          </p>
          <div className="support-options">
            <div className="support-option">
              <span className="support-icon">📧</span>
              <span>support@ecofinds.com</span>
            </div>
            <div className="support-option">
              <span className="support-icon">📞</span>
              <span>1-800-ECO-FINDS</span>
            </div>
            <div className="support-option">
              <span className="support-icon">💬</span>
              <span>Live Chat (9 AM - 6 PM)</span>
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="social-sharing">
          <h3>Share Your Sustainable Choice!</h3>
          <p>
            Let your friends know about your contribution to a greener planet
          </p>
          <div className="share-buttons">
            <button className="share-btn facebook">Share on Facebook</button>
            <button className="share-btn twitter">Share on Twitter</button>
            <button className="share-btn whatsapp">Share on WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
