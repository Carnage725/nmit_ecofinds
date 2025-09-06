// pages/Listings.js
import React, { useState, useEffect, useCallback } from "react";

const Listings = ({ onAddToCart, onNavigateToProduct }) => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  // Mock API calls - replace with real API
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock listings data
      const mockListings = [
        {
          id: 1,
          title: "Used Laptop",
          description: "Dell i5, 8GB RAM, excellent condition",
          category: "Electronics",
          price: 22000,
          image_url:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
          seller_id: 1,
          is_available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Dining Chair",
          description: "Solid wood dining chair with minor scratches",
          category: "Furniture",
          price: 1500,
          image_url:
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
          seller_id: 1,
          is_available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          title: "Novel Collection",
          description: "5 bestselling novels bundle",
          category: "Books",
          price: 999,
          image_url:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
          seller_id: 1,
          is_available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 4,
          title: "Bamboo Water Bottle",
          description: "Eco-friendly bamboo water bottle",
          category: "Home & Garden",
          price: 599,
          image_url:
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
          seller_id: 1,
          is_available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 5,
          title: "Yoga Mat",
          description: "Natural rubber yoga mat, lightly used",
          category: "Sports",
          price: 1200,
          image_url:
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
          seller_id: 1,
          is_available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 6,
          title: "Vintage Camera",
          description: "Classic film camera in working condition",
          category: "Electronics",
          price: 8500,
          image_url:
            "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
          seller_id: 1,
          is_available: true,
          created_at: new Date().toISOString(),
        },
      ];

      // Apply filters
      let filteredListings = mockListings.filter((listing) => {
        const matchesSearch =
          !searchQuery ||
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          !selectedCategory || listing.category === selectedCategory;

        const matchesMinPrice =
          !minPrice || listing.price >= parseFloat(minPrice);
        const matchesMaxPrice =
          !maxPrice || listing.price <= parseFloat(maxPrice);

        return (
          matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
        );
      });

      // Simulate pagination
      const startIndex = (currentPage - 1) * perPage;
      const paginatedListings = filteredListings.slice(
        startIndex,
        startIndex + perPage
      );
      setTotalPages(Math.ceil(filteredListings.length / perPage));

      setListings(paginatedListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, minPrice, maxPrice, currentPage]);

  const fetchCategories = async () => {
    try {
      // Mock categories
      const mockCategories = [
        { name: "Electronics", count: 15 },
        { name: "Furniture", count: 8 },
        { name: "Books", count: 12 },
        { name: "Home & Garden", count: 6 },
        { name: "Sports", count: 4 },
        { name: "Clothing", count: 20 },
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchListings();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  return (
    <div className="listings-page">
      <div className="listings-container">
        <h1 className="page-title">Browse Sustainable Products</h1>

        {/* Search and Filter Section */}
        <div className="filters-section">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </div>
          </form>

          <div className="filter-controls">
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            <div className="price-range">
              <input
                type="number"
                className="price-input"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                className="price-input"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            {loading ? "Loading..." : `Showing ${listings.length} products`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner">Loading...</div>
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <div className="listings-grid">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing.id} className="listing-card">
                    <div className="listing-image-container">
                      <img
                        src={listing.image_url || "/placeholder-image.jpg"}
                        alt={listing.title}
                        className="listing-image" loading="lazy" decoding="async"
                        onClick={() => onNavigateToProduct(listing.id)}
                      />
                      <div className="listing-category-tag">
                        {listing.category}
                      </div>
                    </div>

                    <div className="listing-content">
                      <h3
                        className="listing-title"
                        onClick={() => onNavigateToProduct(listing.id)}
                      >
                        {listing.title}
                      </h3>
                      <p className="listing-description">
                        {listing.description.length > 80
                          ? `${listing.description.substring(0, 80)}...`
                          : listing.description}
                      </p>
                      <div className="listing-footer">
                        <span className="listing-price">
                          ₹{listing.price.toLocaleString()}
                        </span>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => onAddToCart(listing)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <h3>No products found</h3>
                  <p>
                    Try adjusting your search criteria or browse all categories.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Listings;