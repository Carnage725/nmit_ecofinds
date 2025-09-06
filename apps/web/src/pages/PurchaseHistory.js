// pages/PurchaseHistory.js
import React, { useState } from "react";

const PurchaseHistory = ({ orders = [] }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock orders if none provided
  const mockOrders = [
    {
      id: 1,
      date: "2024-01-15T10:30:00Z",
      status: "delivered",
      total: 23599,
      items: [
        {
          id: 1,
          title: "Used Laptop - Dell Inspiron 15",
          category: "Electronics",
          price: 22000,
          quantity: 1,
          image_url:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
        },
        {
          id: 4,
          title: "Bamboo Water Bottle",
          category: "Home & Garden",
          price: 599,
          quantity: 1,
          image_url:
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300",
        },
      ],
      shipping: {
        fullName: "Demo User",
        address: "123 Green Street, Eco Colony",
        city: "Bengaluru",
        state: "Karnataka",
      },
      ecoPointsEarned: 235,
    },
    {
      id: 2,
      date: "2024-01-10T14:20:00Z",
      status: "delivered",
      total: 2699,
      items: [
        {
          id: 2,
          title: "Solid Wood Dining Chair",
          category: "Furniture",
          price: 1500,
          quantity: 1,
          image_url:
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300",
        },
        {
          id: 5,
          title: "Yoga Mat",
          category: "Sports",
          price: 1200,
          quantity: 1,
          image_url:
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300",
        },
      ],
      shipping: {
        fullName: "Demo User",
        address: "123 Green Street, Eco Colony",
        city: "Bengaluru",
        state: "Karnataka",
      },
      ecoPointsEarned: 26,
    },
    {
      id: 3,
      date: "2024-01-05T09:15:00Z",
      status: "in-transit",
      total: 1099,
      items: [
        {
          id: 3,
          title: "Novel Collection - 5 Books",
          category: "Books",
          price: 999,
          quantity: 1,
          image_url:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300",
        },
      ],
      shipping: {
        fullName: "Demo User",
        address: "123 Green Street, Eco Colony",
        city: "Bengaluru",
        state: "Karnataka",
      },
      ecoPointsEarned: 10,
    },
  ];

  const allOrders = orders.length > 0 ? orders : mockOrders;

  // Filter orders
  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      order.items.some(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "#22c55e";
      case "in-transit":
        return "#3b82f6";
      case "processing":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "in-transit":
        return "In Transit";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotalEcoPoints = () => {
    return allOrders.reduce(
      (total, order) => total + (order.ecoPointsEarned || 0),
      0
    );
  };

  const calculateTotalSavings = () => {
    return allOrders.reduce((total, order) => total + order.total, 0);
  };

  const downloadInvoice = (orderId) => {
    // Mock download functionality
    alert(`Downloading invoice for order #ECO${orderId}`);
  };

  const trackOrder = (orderId) => {
    // Mock tracking functionality
    alert(`Tracking order #ECO${orderId}`);
  };

  const reorderItems = (order) => {
    // Mock reorder functionality
    const itemNames = order.items.map((item) => item.title).join(", ");
    alert(`Adding ${itemNames} to cart for reorder`);
  };

  return (
    <div className="purchase-history-page">
      <div className="history-container">
        <div className="page-header">
          <h1>Purchase History</h1>
          <p>
            Track your sustainable shopping journey and environmental impact
          </p>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-number">{allOrders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-number">
                ₹{calculateTotalSavings().toLocaleString()}
              </span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-number">{calculateTotalEcoPoints()}</span>
              <span className="stat-label">EcoPoints Earned</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <span className="stat-number">
                {allOrders.reduce(
                  (total, order) =>
                    total +
                    order.items.reduce((sum, item) => sum + item.quantity, 0),
                  0
                )}
              </span>
              <span className="stat-label">Items Reused</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search orders by item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="status-filter">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-select"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="in-transit">In Transit</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #ECO{order.id}</h3>
                    <p className="order-date">{formatDate(order.date)}</p>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        <img src={item.image_url} alt={item.title} />
                      </div>
                      <div className="item-details">
                        <h4>{item.title}</h4>
                        <p className="item-category">{item.category}</p>
                        <div className="item-meta">
                          <span>Qty: {item.quantity}</span>
                          <span>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-left">
                    <div className="eco-impact">
                      <span className="eco-points">
                        +{order.ecoPointsEarned} EcoPoints earned
                      </span>
                      <span className="environmental-impact">
                        🌱 {Math.floor(order.total / 500)}kg CO₂ saved
                      </span>
                    </div>
                  </div>
                  <div className="summary-right">
                    <div className="order-total">
                      <span>
                        Total: <strong>₹{order.total.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="action-btn secondary"
                    onClick={() => downloadInvoice(order.id)}
                  >
                    📄 Invoice
                  </button>
                  {order.status !== "delivered" &&
                    order.status !== "cancelled" && (
                      <button
                        className="action-btn secondary"
                        onClick={() => trackOrder(order.id)}
                      >
                        📍 Track Order
                      </button>
                    )}
                  <button
                    className="action-btn primary"
                    onClick={() => reorderItems(order)}
                  >
                    🔄 Reorder
                  </button>
                  {order.status === "delivered" && (
                    <button className="action-btn secondary">
                      ⭐ Rate Items
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h3>No orders found</h3>
              <p>
                {searchQuery || selectedStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't made any purchases yet. Start shopping for sustainable products!"}
              </p>
              {!searchQuery && selectedStatus === "all" && (
                <button
                  className="browse-btn"
                  onClick={() => (window.location.href = "/")}
                >
                  Browse Products
                </button>
              )}
            </div>
          )}
        </div>

        {/* Environmental Impact Summary */}
        {allOrders.length > 0 && (
          <div className="environmental-summary">
            <h2>🌍 Your Environmental Impact</h2>
            <p>Here's how your sustainable shopping has helped the planet:</p>

            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">🌱</div>
                <div className="impact-content">
                  <span className="impact-number">
                    {Math.floor(calculateTotalSavings() / 100)}kg
                  </span>
                  <span className="impact-label">CO₂ Emissions Saved</span>
                  <p>
                    Equivalent to planting{" "}
                    {Math.floor(calculateTotalSavings() / 2000)} trees
                  </p>
                </div>
              </div>

              <div className="impact-card">
                <div className="impact-icon">💧</div>
                <div className="impact-content">
                  <span className="impact-number">
                    {Math.floor(calculateTotalSavings() / 50)}L
                  </span>
                  <span className="impact-label">Water Saved</span>
                  <p>Manufacturing water consumption reduced</p>
                </div>
              </div>

              <div className="impact-card">
                <div className="impact-icon">♻️</div>
                <div className="impact-content">
                  <span className="impact-number">
                    {allOrders.reduce(
                      (total, order) =>
                        total +
                        order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        ),
                      0
                    )}
                  </span>
                  <span className="impact-label">Items Given New Life</span>
                  <p>Products saved from becoming waste</p>
                </div>
              </div>

              <div className="impact-card">
                <div className="impact-icon">⚡</div>
                <div className="impact-content">
                  <span className="impact-number">
                    {Math.floor(calculateTotalSavings() / 20)}kWh
                  </span>
                  <span className="impact-label">Energy Saved</span>
                  <p>Manufacturing energy consumption avoided</p>
                </div>
              </div>
            </div>

            <div className="achievement-badge">
              <div className="badge-icon">🏆</div>
              <div className="badge-content">
                <h3>Eco Champion Status</h3>
                <p>
                  You're in the top 20% of our eco-conscious users! Keep up the
                  great work making sustainable choices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Return Policy */}
        <div className="return-policy">
          <h3>📋 Return Policy</h3>
          <div className="policy-content">
            <div className="policy-item">
              <span className="policy-icon">✅</span>
              <div>
                <strong>7-Day Return Window</strong>
                <p>Return items within 7 days of delivery if not satisfied</p>
              </div>
            </div>
            <div className="policy-item">
              <span className="policy-icon">📦</span>
              <div>
                <strong>Original Condition</strong>
                <p>Items must be in original condition with all accessories</p>
              </div>
            </div>
            <div className="policy-item">
              <span className="policy-icon">💰</span>
              <div>
                <strong>Full Refund</strong>
                <p>Get full refund including EcoPoints deduction reversal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
