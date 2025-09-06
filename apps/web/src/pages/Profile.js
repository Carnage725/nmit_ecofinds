// pages/Profile.js
import React, { useState } from "react";

const Profile = ({ user, ecoPoints, onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset changes if canceling
      setEditedUser({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  };

  const handleSave = () => {
    // In real app, make API call to update user
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
    // Show success message
    alert("Profile updated successfully!");
  };

  const ecoLevel = Math.floor(ecoPoints / 100) + 1;
  const pointsToNextLevel = ecoLevel * 100 - ecoPoints;

  const mockListings = [
    { id: 1, title: "Used Laptop", price: 22000, status: "Active", views: 45 },
    { id: 2, title: "Dining Chair", price: 1500, status: "Sold", views: 23 },
    { id: 3, title: "Novel Set", price: 999, status: "Active", views: 12 },
  ];

  const mockOrders = [
    {
      id: 1,
      items: "Bamboo Bottle",
      total: 599,
      date: "2024-01-15",
      status: "Delivered",
    },
    {
      id: 2,
      items: "Yoga Mat",
      total: 1200,
      date: "2024-01-10",
      status: "Delivered",
    },
    {
      id: 3,
      items: "Used Laptop",
      total: 22000,
      date: "2024-01-05",
      status: "In Transit",
    },
  ];

  const ecoRewards = [
    {
      id: 1,
      name: "Eco Warrior Badge",
      points: 100,
      unlocked: ecoPoints >= 100,
    },
    {
      id: 2,
      name: "Sustainability Champion",
      points: 250,
      unlocked: ecoPoints >= 250,
    },
    { id: 3, name: "Green Hero", points: 500, unlocked: ecoPoints >= 500 },
    {
      id: 4,
      name: "Planet Protector",
      points: 1000,
      unlocked: ecoPoints >= 1000,
    },
  ];

  const renderOverview = () => (
    <div className="overview-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>EcoPoints</h3>
          <div className="stat-value">{ecoPoints}</div>
          <p>Level {ecoLevel} Eco Champion</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((ecoPoints % 100) / 100) * 100}%` }}
            ></div>
          </div>
          <small>{pointsToNextLevel} points to next level</small>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{mockOrders.length}</div>
          <p>Sustainable purchases</p>
        </div>

        <div className="stat-card">
          <h3>Items Listed</h3>
          <div className="stat-value">{mockListings.length}</div>
          <p>Contributing to circular economy</p>
        </div>

        <div className="stat-card">
          <h3>CO₂ Saved</h3>
          <div className="stat-value">127kg</div>
          <p>Environmental impact</p>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">🛒</span>
            <div className="activity-content">
              <p>
                <strong>Purchased</strong> Bamboo Water Bottle
              </p>
              <small>2 days ago • ₹599</small>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">⭐</span>
            <div className="activity-content">
              <p>
                <strong>Earned</strong> 12 EcoPoints
              </p>
              <small>2 days ago</small>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📦</span>
            <div className="activity-content">
              <p>
                <strong>Listed</strong> Yoga Mat for sale
              </p>
              <small>5 days ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="personal-info-content">
      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar">{user.full_name.charAt(0).toUpperCase()}</div>
          <button className="change-avatar-btn">Change Photo</button>
        </div>

        <div className="user-details">
          {!isEditing ? (
            <>
              <h2>{user.full_name}</h2>
              <p className="user-email">{user.email}</p>
              <p className="user-member-since">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
            </>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editedUser.full_name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, full_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editedUser.location}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, location: e.target.value })
                  }
                  placeholder="Enter your city"
                />
              </div>
              <div className="form-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleEditToggle}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="verification-status">
        <h3>Account Verification</h3>
        <div className="verification-items">
          <div className="verification-item verified">
            <span className="check-icon">✓</span>
            <span>Email Verified</span>
          </div>
          <div className="verification-item pending">
            <span className="pending-icon">⏳</span>
            <span>Phone Verification Pending</span>
            <button className="verify-btn">Verify Now</button>
          </div>
          <div className="verification-item pending">
            <span className="pending-icon">⏳</span>
            <span>ID Verification Pending</span>
            <button className="verify-btn">Upload ID</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyListings = () => (
    <div className="my-listings-content">
      <div className="listings-header">
        <h3>My Listings</h3>
        <button className="add-listing-btn">+ Add New Listing</button>
      </div>

      <div className="listings-table">
        <div className="table-header">
          <span>Item</span>
          <span>Price</span>
          <span>Status</span>
          <span>Views</span>
          <span>Actions</span>
        </div>
        {mockListings.map((listing) => (
          <div key={listing.id} className="table-row">
            <span className="item-name">{listing.title}</span>
            <span className="item-price">
              ₹{listing.price.toLocaleString()}
            </span>
            <span className={`item-status ${listing.status.toLowerCase()}`}>
              {listing.status}
            </span>
            <span className="item-views">{listing.views}</span>
            <div className="item-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEcoRewards = () => (
    <div className="eco-rewards-content">
      <div className="rewards-header">
        <h3>EcoRewards & Achievements</h3>
        <p>
          Earn points for every sustainable purchase and unlock exclusive
          rewards!
        </p>
      </div>

      <div className="current-level">
        <div className="level-badge">
          <span className="level-number">{ecoLevel}</span>
          <span className="level-text">ECO LEVEL</span>
        </div>
        <div className="level-info">
          <h4>Eco Champion Level {ecoLevel}</h4>
          <p>You have {ecoPoints} EcoPoints</p>
          <div className="progress-container">
            <div className="progress-bar-large">
              <div
                className="progress-fill-large"
                style={{ width: `${((ecoPoints % 100) / 100) * 100}%` }}
              ></div>
            </div>
            <p>
              {pointsToNextLevel} points to reach Level {ecoLevel + 1}
            </p>
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        {ecoRewards.map((reward) => (
          <div
            key={reward.id}
            className={`achievement-card ${
              reward.unlocked ? "unlocked" : "locked"
            }`}
          >
            <div className="achievement-icon">
              {reward.unlocked ? "🏆" : "🔒"}
            </div>
            <h4>{reward.name}</h4>
            <p>{reward.points} points required</p>
            {reward.unlocked && (
              <span className="unlocked-badge">Unlocked!</span>
            )}
          </div>
        ))}
      </div>

      <div className="points-history">
        <h4>Points History</h4>
        <div className="history-list">
          <div className="history-item">
            <span className="points-earned">+12</span>
            <div className="history-details">
              <p>Purchase: Bamboo Water Bottle</p>
              <small>2 days ago</small>
            </div>
          </div>
          <div className="history-item">
            <span className="points-earned">+25</span>
            <div className="history-details">
              <p>First listing bonus</p>
              <small>1 week ago</small>
            </div>
          </div>
          <div className="history-item">
            <span className="points-earned">+15</span>
            <div className="history-details">
              <p>Profile completion</p>
              <small>2 weeks ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-summary">
            <div className="profile-avatar">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <h3>{user.full_name}</h3>
            <p>
              Level {ecoLevel} • {ecoPoints} EcoPoints
            </p>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={`nav-item ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              👤 Personal Info
            </button>
            <button
              className={`nav-item ${activeTab === "listings" ? "active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              📦 My Listings
            </button>
            <button
              className={`nav-item ${activeTab === "rewards" ? "active" : ""}`}
              onClick={() => setActiveTab("rewards")}
            >
              🏆 EcoRewards
            </button>
            <button className="nav-item logout" onClick={onLogout}>
              🚪 Logout
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "listings" && renderMyListings()}
          {activeTab === "rewards" && renderEcoRewards()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
