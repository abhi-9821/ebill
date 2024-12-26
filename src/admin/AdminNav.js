import React from "react";
import {FaSignOutAlt } from "react-icons/fa";

const AdminNav = ({ handleLogout }) => (
  <nav className="flex flex-wrap items-center justify-between px-4 py-3 shadow-md rounded-lg bg-cyan-600 text-white">
    <div className="flex items-center space-x-4">
      <span className="text-2xl font-semibold tracking-wide sm:text-3xl">Dashboard Admin</span>
    </div>
    
    <div className="flex items-center space-x-6"> 
      <button
        className="p-2 rounded-full hover:bg-opacity-80 transition duration-200"
        onClick={handleLogout}
        aria-label="Logout"
      >
        <FaSignOutAlt className="text-xl sm:text-2xl" />

      </button>
      
    </div>
  </nav>
);

export default AdminNav;
