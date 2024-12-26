import React from "react";
import { FaSun, FaMoon, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ darkMode, toggleDarkMode, handleLogout, customerDetails }) => (
  <nav
    className={`flex flex-wrap  px-4 py-3 items-center rounded-lg justify-between shadow-md  transition-all ${
  darkMode ? "bg-gray-900 text-white" : "bg-orange-600 text-white"
    }`}
  >
  {/* Left side (Logo/Title) */}
  <div className="flex items-center space-x-4">
   <span className="text-2xl  tracking-wide  font-semibold pl-20 sm:text-3xl ">
    Ebills
   </span>
  </div>
    {/* Right side (User Info, Dark Mode Toggle, Logout) */}
  <div className="flex items-center space-x-6">
   {/* User Info */}
  <div className="flex  space-x-2 items-center">
   <FaUser className="text-lg sm:text-xl" />
    <p className="text-sm sm:text-lg font-medium truncate">
     ID: {customerDetails?.customerId || "Guest"}
     </p>
   </div>
     {/* Dark Mode Toggle */}
   <button
    className="p-2 hover:bg-opacity-80 rounded-full  transition duration-200"
   onClick={toggleDarkMode}
    aria-label="Toggle Dark Mode"
   >
    {darkMode ? (
    <FaSun className="text-yellow-500  sm:text-2xl text-xl" />
  ) : (
  <FaMoon className="text-gray-200  sm:text-2xl text-xl" />
    )}
     </button>
   {/* Logout Button */}
   <button
   className="p-2 rounded-full  transition  hover:bg-opacity-80 duration-200"
     onClick={handleLogout}
     aria-label="Logout"
  >
  <FaSignOutAlt className="sm:text-2xl text-xl " />
   </button>
  </div>
 </nav>
);

export default Navbar;
