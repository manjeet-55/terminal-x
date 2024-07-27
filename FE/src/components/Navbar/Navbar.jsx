// src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import profilePic from '../assets/profile-placeholder.png'; 
import AccountMenu from './AccountMenu/AccountMenu';
// import logo from '../assets/logo.png'; 

const Navbar = () => {
  return (
    <div className="w-screen flex items-center justify-center p-4 bg-red-500">
      
      {/* <img src={logo} style={{width: "60px", height: "auto"}} /> */}
      <p className='w-full flex justify-center text-xl font-bold font-inter text-white'>Web Terminal</p>
      <button className='p-2 m-2 bg-blue-500 rounded-xl text-white '> Store</button>

      <AccountMenu />
    </div>
  );
};

export default Navbar;
