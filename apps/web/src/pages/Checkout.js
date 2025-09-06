// pages/Checkout.js
import React, { useState } from "react";

const Checkout = ({ cartItems, user, onPlaceOrder }) => {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [upiInfo, setUpiInfo] = useState({
    upiId: "",
  });

  const [useEcoPoints, setUseEcoPoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over ₹1000
  const tax = subtotal * 0.12; // 12% GST
  const ecoPointsDiscount = useEcoPoints
    ? Math.min(subtotal * 0.1, user?.eco_points * 10 || 0)
    : 0;
  const total = subtotal + shipping + tax - ecoPointsDiscount;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19) return; // Max 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5) return;
    }

    // Format CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 3) return;
    }

    setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Shipping validation
    if (!shippingInfo.fullName.trim()) newErrors.fullName = "Name is required";
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.pincode.trim()) newErrors.pincode = "Pincode is required";

    // Payment validation
    if (paymentMethod === "card") {
      if (!cardInfo.cardNumber.replace(/\s/g, ""))
        newErrors.cardNumber = "Card number is required";
      if (!cardInfo.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      if (!cardInfo.cvv) newErrors.cvv = "CVV is required";
      if (!cardInfo.cardholderName.trim())
        newErrors.cardholderName = "Cardholder name is required";
    }

    if (paymentMethod === "upi" && !upiInfo.upiId.trim()) {
      newErrors.upiId = "UPI ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData = {
        shipping: shippingInfo,
        paymentMethod,
        paymentDetails: paymentMethod === "card" ? cardInfo : upiInfo,
        subtotal,
        shippingCost: shipping,
        tax,
        ecoPointsUsed: useEcoPoints ? Math.floor(ecoPointsDiscount / 10) : 0,
        total,
      };

      onPlaceOrder(orderData);
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart to proceed with checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          {/* Left Column - Forms */}
          <div className="checkout-forms">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="checkout-section">
                <h2>🚚 Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      className={errors.fullName ? "error" : ""}
                    />
                    {errors.fullName && (
                      <span className="error-text">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && (
                      <span className="error-text">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className={errors.address ? "error" : ""}
                      rows="3"
                    />
                    {errors.address && (
                      <span className="error-text">{errors.address}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className={errors.city ? "error" : ""}
                    />
                    {errors.city && (
                      <span className="error-text">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={shippingInfo.pincode}
                      onChange={handleShippingChange}
                      className={errors.pincode ? "error" : ""}
                    />
                    {errors.pincode && (
                      <span className="error-text">{errors.pincode}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="checkout-section">
                <h2>💳 Payment Information</h2>

                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>UPI</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="card-details">
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className={errors.cardNumber ? "error" : ""}
                      />
                      {errors.cardNumber && (
                        <span className="error-text">{errors.cardNumber}</span>
                      )}
                    </div>

                    <div className="card-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date *</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          className={errors.expiryDate ? "error" : ""}
                        />
                        {errors.expiryDate && (
                          <span className="error-text">
                            {errors.expiryDate}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          className={errors.cvv ? "error" : ""}
                        />
                        {errors.cvv && (
                          <span className="error-text">{errors.cvv}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardholderName">Cardholder Name *</label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        value={cardInfo.cardholderName}
                        onChange={handleCardChange}
                        className={errors.cardholderName ? "error" : ""}
                      />
                      {errors.cardholderName && (
                        <span className="error-text">
                          {errors.cardholderName}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="upi-details">
                    <div className="form-group">
                      <label htmlFor="upiId">UPI ID *</label>
                      <input
                        type="text"
                        id="upiId"
                        name="upiId"
                        value={upiInfo.upiId}
                        onChange={(e) => setUpiInfo({ upiId: e.target.value })}
                        placeholder="username@paytm"
                        className={errors.upiId ? "error" : ""}
                      />
                      {errors.upiId && (
                        <span className="error-text">{errors.upiId}</span>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="cod-info">
                    <p>You can pay with cash when your order is delivered.</p>
                    <p>
                      <strong>Note:</strong> COD orders may take 1-2 additional
                      days for delivery.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-summary">
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title}
                  />
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="price-row">
                <span>Tax (GST 12%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>

              {user && user.eco_points > 0 && (
                <div className="eco-points-section">
                  <label className="eco-points-checkbox">
                    <input
                      type="checkbox"
                      checked={useEcoPoints}
                      onChange={(e) => setUseEcoPoints(e.target.checked)}
                    />
                    <span>
                      Use EcoPoints (Save up to ₹
                      {Math.min(subtotal * 0.1, user.eco_points * 10).toFixed(
                        0
                      )}
                      )
                    </span>
                  </label>
                  {useEcoPoints && (
                    <div className="price-row discount">
                      <span>EcoPoints Discount</span>
                      <span>-₹{ecoPointsDiscount.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="price-row total">
                <span>
                  <strong>Total</strong>
                </span>
                <span>
                  <strong>₹{total.toFixed(0)}</strong>
                </span>
              </div>
            </div>

            <div className="eco-impact">
              <h3>🌱 Environmental Impact</h3>
              <div className="impact-stats">
                <div className="impact-item">
                  <span className="impact-value">45kg</span>
                  <span className="impact-label">CO₂ Saved</span>
                </div>
                <div className="impact-item">
                  <span className="impact-value">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                  <span className="impact-label">Items Reused</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                `Place Order • ₹${total.toFixed(0)}`
              )}
            </button>

            <div className="security-badges">
              <span>🔒 Secure Checkout</span>
              <span>✅ Buyer Protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;