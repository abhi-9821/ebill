import React from "react";
import { Navigate } from "react-router-dom";

const PR = ({ children }) => {
  const token = localStorage.getItem("token"); 
  return token ? children : <Navigate to="/" replace />;
};

export default PR;
