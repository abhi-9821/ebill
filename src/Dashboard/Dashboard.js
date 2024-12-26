import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaWallet,
  FaHistory,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";
import Navbar from "../Components/Navbar";

const Dashboard = () => {
  const [darkM, setDarkM] = useState(false);
  const [cstmrDtls, setCstmrDtls] = useState(null);
  const navigate = useNavigate();
  
  const toggleDarkM = () => setDarkM(!darkM);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cstmrDtls");
    navigate("/");
  };

  useEffect(() => {
  const token = localStorage.getItem("token");
   const storedDetails = localStorage.getItem("cstmrDtls");

  if (!token || !storedDetails) {
   navigate("/"); 
  } else {
   try {
  const parsedDetails = JSON.parse(storedDetails);
   setCstmrDtls(parsedDetails);
    } catch (error) {
   console.error("Error parsing customer details:", error);
   localStorage.removeItem("token");
   localStorage.removeItem("cstmrDtls");
   navigate("/"); 
    }
  }
  }, [navigate]);
 if (!cstmrDtls) {
  return (
   <div className="min-h-screen  justify-center flex items-center bg-gray-100 text-gray-900">
    <p>Loading...</p>
    </div>
   );
  }

  return (
    <div className={`${darkM ? "bg-black text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
    {/* Navbar */}
    <Navbar
      darkM={darkM}
    toggleDarkM={toggleDarkM}
    handleLogout={handleLogout}
      cstmrDtls={cstmrDtls}
     />
    <div className="container  p-6 mx-auto">
    <h1 className="text-4xl  mb-8 font-bold text-center">
      Welcome, {cstmrDtls.name}
     </h1>
     <h1 className="text-2xl font-bold mb-8 text-center">
      Your Id is:  {cstmrDtls.customerId}, Remember ID for future reference
     </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
     <DashboardCard
      title="My Account"
     description="View and update your account information"
     icon={<FaUser />}
   darkM={darkM}
    onClick={() => navigate(`/account/${cstmrDtls.customerId}`)}
      />
     <DashboardCard
         title="Pay Bill"
    description="Make payments and manage billing"
         icon={<FaWallet />}
         darkM={darkM}
       onClick={() => navigate(`/pay-bill/${cstmrDtls.customerId}`)}
        />
      <DashboardCard
      title="Payment History"
        description="View your past payments"
       icon={<FaHistory />}
       darkM={darkM}
        onClick={() => navigate(`/payment-history/${cstmrDtls.customerId}`)}
       />
       <DashboardCard
      title="Change Password"
       description="Update your password for security"
      icon={<FaKey />}
    darkM={darkM}
        onClick={() => navigate(`/change-password/${cstmrDtls.customerId}`)}
    />
    <DashboardCard
       title="Feedback"
    description="Provide your feedback and issues here"
       icon={<FaWallet />}
       darkM={darkM}
   onClick={() => navigate(`/feedback/${cstmrDtls.customerId}`)}
      />
       <DashboardCard
          title="Logout"
       description="Sign out of your account"
        icon={<FaSignOutAlt />}
      darkM={darkM}
       onClick={handleLogout}
       />
       </div>
      </div>
   </div>
  );
};

const DashboardCard = ({ title, description, icon, darkM, onClick }) => (
  <div
    className={`cursor-pointer  overflow-hidden shadow-lg rounded-lg hover:scale-105 transition-transform  transform ${
      darkM ? "text-white bg-gray-800 " : "text-gray-900 bg-white "
    }`}
    onClick={onClick}
  >
    <div className="p-6">
      <div className=" items-center flex space-x-4 mb-4">
        <div className="text-3xl text-orange-600">{icon}</div>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  </div>
);

export default Dashboard;

