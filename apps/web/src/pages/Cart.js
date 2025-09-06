import React, { useEffect, useMemo, useState } from "react";

/**
 * Cart page
 * - Persists to localStorage under "cart" (if parent doesn't manage it)
 * - Accepts optional props to integrate with your own store
 *
 * Props (all optional):
 *   initialCart: [{ id, title, image, condition, price, quantity }, ...]
 *   onCartChange(nextCart)
 *   onProceedToCheckout(cartSummary)
 */
export default function Cart({
  initialCart,
  onCartChange,
  onProceedToCheckout,
}) {
  const [cart, setCart] = useState(() => {
    if (initialCart && Array.isArray(initialCart)) return initialCart;
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Save to localStorage and notify parent
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
    onCartChange && onCartChange(cart);
  }, [cart, onCartChange]);

  const formatINR = (v) =>
    `₹${Number(v || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: v % 1 ? 2 : 0,
    })}`;

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    // Shipping: free over ₹1000 else ₹100
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 100;

    // 12% GST (match your Checkout.js)
    const tax = subtotal * 0.12;

    // Coupon: ECO10 = 10% off subtotal (cap ₹1500)
    let couponDiscount = 0;
    if (appliedCoupon?.code === "ECO10") {
      couponDiscount = Math.min(subtotal * 0.1, 1500);
    }

    const total = Math.max(subtotal + shipping + tax - couponDiscount, 0);

    return { subtotal, shipping, tax, couponDiscount, total };
  }, [cart, appliedCoupon]);

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    if (code === "ECO10") {
      setAppliedCoupon({ code, label: "10% off (max ₹1,500)" });
    } else {
      setAppliedCoupon({ code, invalid: true });
    }
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((it) =>
          it.id === id
            ? { ...it, quantity: Math.min(99, Math.max(1, (it.quantity || 1) + delta)) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const setQty = (id, value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    setCart((prev) =>
      prev
        .map((it) =>
          it.id === id
            ? { ...it, quantity: Math.min(99, Math.max(1, Math.floor(n))) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((it) => it.id !== id));
  const clearCart = () => setCart([]);

  const proceed = () => {
    const summary = { cart, ...totals, coupon: appliedCoupon?.code || null };
    if (onProceedToCheckout) {
      onProceedToCheckout(summary);
    } else {
      // default: navigate to /checkout
      window.location.href = "/checkout";
    }
  };

  if (!cart.length) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <a className="btn-primary" href="/browse">Browse products</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-grid">
        {/* Items */}
        <section aria-label="Cart items">
          <div className="cart-items">
            {cart.map((item) => (
              <article key={item.id} className="cart-item">
                <img
                  src={item.image || "/placeholder-image.jpg"}
                  alt={item.title}
                  className="cart-item-image"
                  loading="lazy"
                  decoding="async"
                />
                <div className="cart-item-main">
                  <h3 className="cart-item-title">{item.title}</h3>
                  {item.condition && (
                    <div className="cart-item-condition">{item.condition}</div>
                  )}
                  <div className="cart-item-price">{formatINR(item.price)}</div>

                  <div className="cart-item-actions">
                    <div className="qty-control" aria-label="Quantity">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(item.id, -1)}
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity || 1}
                        onChange={(e) => setQty(item.id, e.target.value)}
                        aria-label={`Quantity of ${item.title}`}
                      />
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQty(item.id, +1)}
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="link-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-line-total">
                  {formatINR((item.price || 0) * (item.quantity || 1))}
                </div>
              </article>
            ))}
          </div>

          <div className="cart-list-cta">
            <a href="/browse" className="btn-secondary">Continue shopping</a>
            <button type="button" className="btn-plain" onClick={clearCart}>
              Clear cart
            </button>
          </div>
        </section>

        {/* Summary */}
        <aside className="cart-summary" aria-label="Order summary">
          <h2>Summary</h2>

          <form className="coupon-row" onSubmit={applyCoupon}>
            <input
              type="text"
              placeholder="Coupon code (e.g., ECO10)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              aria-label="Coupon code"
            />
            <button type="submit" className="btn-secondary">Apply</button>
          </form>

          {appliedCoupon && (
            <div
              className={
                appliedCoupon.invalid ? "coupon-status error" : "coupon-status"
              }
            >
              {appliedCoupon.invalid
                ? `“${appliedCoupon.code}” is not valid`
                : `Applied: ${appliedCoupon.code} — ${appliedCoupon.label}`}
            </div>
          )}

          <div className="summary-line">
            <span>Subtotal</span>
            <span>{formatINR(totals.subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span>{totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}</span>
          </div>
          <div className="summary-line">
            <span>Tax (12%)</span>
            <span>{formatINR(totals.tax)}</span>
          </div>
          {totals.couponDiscount > 0 && (
            <div className="summary-line discount">
              <span>Coupon</span>
              <span>-{formatINR(totals.couponDiscount)}</span>
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>{formatINR(totals.total)}</span>
          </div>

          <button type="button" className="btn-primary wide" onClick={proceed}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
