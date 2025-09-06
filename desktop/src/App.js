import React, { useState } from "react";
import Navbar from "./components/Navbar";
import SignInModal from "./components/SignInModal";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import "./assets/styles/global.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Navigation handlers
  const navigateToPage = (page) => {
    setCurrentPage(page);
    setIsSignInModalOpen(false); // Close modal when navigating
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

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "signup":
        return <SignUp onSignInClick={handleSignInFromSignUp} />;
      default:
        return <Home />;
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
          currentPage={currentPage}
        />
      )}

      <main>{renderCurrentPage()}</main>

      {currentPage !== "signup" && <Footer />}

      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
    </div>
  );
}

export default App;
