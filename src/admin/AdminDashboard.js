import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUpload,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import AdminNav from "./AdminNav";

const ADash = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const sds = localStorage.getItem("adminDetails");

    if (!token || !sds) {
      nav("/");
    } else {
      try {
        const pd = JSON.parse(sds);
        setAdminDetails(pd);
      } catch (error) {
        console.error("Error parsing admin details:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("adminDetails");
        nav("/");
      }
    }
  }, [nav]);

  if (!adminDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <p>Details not available</p>
      </div>
    );
  }
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminDetails");
    nav("/");
  };

  const ADC = ({ title, des, icon, onClick }) => (
    <div
      className={`shadow-lg transition-transform hover:scale-105 transform cursor-pointer rounded-lg overflow-hidden}`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-3xl text-cyan-600">{icon}</div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <p className="text-sm">{des}</p>
      </div>
    </div>
  );

  
  return (
    <div
      className={`min-h-screen`}
    >
      <AdminNav
        handleLogout={handleLogout}
        customerDetails={adminDetails}
      />

      <div className="container mx-auto p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ADC
            title="Manage users"
            des="Create, update, and delete user accounts"
            icon={<FaUsers />}
            onClick={() => nav("/admin/users")}
          />
                    <ADC
            title="Upload Bills"
            des="Create, update, and delete Bills of Users"
            icon={<FaUpload />}
            onClick={() => nav("/admin/upload-bill")}
          />

          <ADC
            title="Previous Bills"
            des="Access bill history"
            icon={<FaHistory />}
            onClick={() => nav("/admin/previous-bills")}
          />
                    <ADC
            title="Feedbacks"
            des="Access customers feedback"
            icon={<FaHistory />}
            onClick={() => nav("/admin/feedbacks")}
          />
          <ADC
            title="Logout"
            des="Sign out of the admin panel"
            icon={<FaSignOutAlt />}
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};




export default ADash;
