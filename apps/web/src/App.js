import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SignInModal from "./components/SignInModal";
import CartModal from "./components/CartModal";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Listings from "./pages/Listings";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import PurchaseHistory from "./pages/PurchaseHistory";
import Chat from "./components/Chat";
import "./assets/styles/global.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("ecofinds_user");
    const savedCart = localStorage.getItem("ecofinds_cart");
    const savedEcoPoints = localStorage.getItem("ecofinds_ecopoints");
    const savedOrders = localStorage.getItem("ecofinds_orders");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedEcoPoints) {
      setEcoPoints(parseInt(savedEcoPoints));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ecofinds_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save ecoPoints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ecofinds_ecopoints", ecoPoints.toString());
  }, [ecoPoints]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ecofinds_orders", JSON.stringify(orders));
  }, [orders]);

  // Navigation handlers
  const navigateToPage = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    setIsSignInModalOpen(false);
    setIsCartModalOpen(false);
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleSignUpClick = () => {
    navigateToPage("signup");
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handleSignInFromSignUp = () => {
    setIsSignInModalOpen(true);
  };

  // Authentication handlers
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("ecofinds_user", JSON.stringify(userData));
    setIsSignInModalOpen(false);
    navigateToPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("ecofinds_user");
    setCartItems([]);
    localStorage.removeItem("ecofinds_cart");
    navigateToPage("home");
  };

  // Cart handlers
  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    alert(`${product.title} added to cart! 🛒`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Order handlers
  const handleCheckout = () => {
    if (!user) {
      alert("Please sign in to checkout");
      setIsSignInModalOpen(true);
      return;
    }
    navigateToPage("checkout");
  };

  const handlePlaceOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      items: [...cartItems],
      total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      date: new Date().toISOString(),
      status: "confirmed",
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setCurrentOrder(newOrder);

    // Award eco points (1 point per ₹100 spent)
    const pointsEarned = Math.floor(newOrder.total / 100);
    setEcoPoints((prevPoints) => prevPoints + pointsEarned);

    // Clear cart
    setCartItems([]);

    navigateToPage("order-confirmation");
  };

  // Chat handlers
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Calculate total cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Home
            onAddToCart={addToCart}
            onNavigateToProduct={(id) => navigateToPage("product-detail", id)}
          />
        );
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "signup":
        return <SignUp onSignInClick={handleSignInFromSignUp} />;
      case "login":
        return <Login onLogin={handleLogin} />;
      case "profile":
        return (
          <Profile user={user} ecoPoints={ecoPoints} onLogout={handleLogout} />
        );
      case "listings":
        return (
          <Listings
            onAddToCart={addToCart}
            onNavigateToProduct={(id) => navigateToPage("product-detail", id)}
          />
        );
      case "product-detail":
        return (
          <ProductDetail
            productId={selectedProductId}
            onAddToCart={addToCart}
            onToggleChat={toggleChat}
          />
        );
      case "checkout":
        return (
          <Checkout
            cartItems={cartItems}
            user={user}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      case "order-confirmation":
        return <OrderConfirmation order={currentOrder} />;
      case "purchase-history":
        return <PurchaseHistory orders={orders} />;
      default:
        return (
          <Home
            onAddToCart={addToCart}
            onNavigateToProduct={(id) => navigateToPage("product-detail", id)}
          />
        );
    }
  };

  return (
    <div className="App">
      {currentPage !== "signup" && currentPage !== "login" && (
        <Navbar
          cartCount={cartCount}
          user={user}
          ecoPoints={ecoPoints}
          onSignInClick={handleSignInClick}
          onSignUpClick={handleSignUpClick}
          onNavigate={navigateToPage}
          onCartClick={handleCartClick}
          onLogout={handleLogout}
          currentPage={currentPage}
        />
      )}

      <main>{renderCurrentPage()}</main>

      {currentPage !== "signup" && currentPage !== "login" && <Footer />}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        onLogin={handleLogin}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={closeCartModal}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Chat Component */}
      {isChatOpen && <Chat onClose={toggleChat} user={user} />}
    </div>
  );
}

export default App;
