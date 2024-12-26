import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [un, setun] = useState("");
  const [pass, setpass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const loginCredentials = {
    un: "admin",
    pass: "admin123",
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (un === loginCredentials.un && pass === loginCredentials.pass) {
      localStorage.setItem(
        "adminDetails",
        JSON.stringify({ name: "Admin", adminId: "ADM001" })
      );
      localStorage.setItem("token", "admin-token");
      navigate("/admin-dashboard");
    } else {
      setErrorMessage("Incorrect username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 justify-center  items-center flex">
      <div className=" p-8 w-full bg-white rounded-lg  max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className=" font-medium block text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              id="username" value={un}
              onChange={(e) => setun(e.target.value)}
              className=" focus:outline-none  w-full rounded-lg focus:ring focus:ring-cyan-500 px-4 py-2 border "
              placeholder="Enter username" required
            /></div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password" value={pass}
              onChange={(e) => setpass(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-500"
              placeholder="Enter your password" required
            />  </div>
          <button
            type="submit"
            className="w-full py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 focus:outline-none focus:ring focus:ring-cyan-500"
          >  Login </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
