// src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import profilePic from '../assets/profile-placeholder.png'; 
import AccountMenu from './AccountMenu/AccountMenu';
import Button from '../Button';

const Navbar = ({ onStoreClick }) => {
  return (
    <div className="w-screen flex items-center justify-center p-4 bg-slate-600 mb-0">
      <p className='w-full flex justify-center text-xl font-bold font-inter text-white'>Web Terminal</p>
      <Button
        variant="secondary"
        onClick={onStoreClick} // Add click handler
      >
        Store
      </Button>
      <AccountMenu />
    </div>
  );
};

export default Navbar;
