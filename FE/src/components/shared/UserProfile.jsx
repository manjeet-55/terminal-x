// src/components/UserProfile.js
import React from 'react';
import './UserProfile.css';

const UserProfile = () => {
  return (
    <div className="user-profile">
      <div className="profile-image-container">
        <img src="profile-placeholder.png" alt="User" className="profile-image" />
      </div>
      <div className="profile-info">
        <p className="profile-name">Sonam Kumari</p>
        <p className="profile-email">sonam.kumari@example.com</p>
      </div>
    </div>
  );
};

export default UserProfile;
