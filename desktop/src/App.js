import React, { useState } from "react";
import Navbar from "./components/Navbar";
import SignInModal from "./components/SignInModal";
import CartModal from "./components/CartModal";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import "./assets/styles/global.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Navigation handlers
  const navigateToPage = (page) => {
    setCurrentPage(page);
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
        // If item already exists, increase quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new item, add with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // Show success feedback
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

  // Calculate total cart count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onAddToCart={addToCart} />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "signup":
        return <SignUp onSignInClick={handleSignInFromSignUp} />;
      default:
        return <Home onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="App">
      {currentPage !== "signup" && (
        <Navbar
          cartCount={cartCount}
          onSignInClick={handleSignInClick}
          onSignUpClick={handleSignUpClick}
          onNavigate={navigateToPage}
          onCartClick={handleCartClick}
          currentPage={currentPage}
        />
      )}

      <main>{renderCurrentPage()}</main>

      {currentPage !== "signup" && <Footer />}

      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={closeCartModal}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}

export default App;
