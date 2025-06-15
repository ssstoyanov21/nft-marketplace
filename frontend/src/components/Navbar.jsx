// src/components/Navbar.jsx
import React from 'react';

export default function Navbar({ address }) {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <span className="font-bold">My Marketplace</span>
      <span>
        {address 
          ? `${address.substring(0,6)}…${address.substring(address.length-4)}`
          : 'Not connected'}
      </span>
    </nav>
  );
}
