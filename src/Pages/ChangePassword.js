import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const ChangePassword = () => {
  const { id } = useParams(); // Extract user ID from the route parameter
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [darkM, setDarkM] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPass.length < 6) {
      setErrMsg("Password length must be at least 6 characters long.");
      setSuccessMsg("");
      return;
    }

    if (newPass !== passConfirm) {
      setErrMsg("New password and confirm password do not match.");
      setSuccessMsg("");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/password/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPass,
          newPass,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.text();
      setSuccessMsg(result);
      setErrMsg("");
      setOldPass("");
      setNewPass("");
      setPassConfirm("");
    } catch (error) {
      setErrMsg(error.message || "Something went wrong. Please try again.");
      setSuccessMsg("");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkM ? "text-white bg-gray-900 " : " text-gray-900 bg-gray-100 "
      }`}
    >
      <nav className={`p-4 ${darkM ? "bg-gray-800" : "bg-orange-600"} text-white items-center justify-between  flex`}>
        <h1 className="text-xl font-bold">Ebills</h1>
        <div>
          <button
            className="py-2 px-4 mr-4 rounded-md  transition"
            onClick={() => setDarkM(!darkM)}
          >
            {darkM ? <FaSun className="text-yellow-500" /> : <FaMoon />}
          </button>
          <button
            className="py-2 px-4  text-gray-800 bg-white rounded-md"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center flex-grow">
        <div
          className={` max-w-md rounded-lg p-8  w-full shadow-md ${
            darkM ? "bg-gray-700 text-gray-200" : "bg-white"
          }`}
        >
          <h1 className=" font-bold mb-6 text-2xl text-center">Change Password</h1>
          {successMsg && (
            <p className="text-green-600text-center  font-semibold mb-4">
              {successMsg}
            </p>
          )}
          {errMsg && (
            <p className="text-center  font-semibold text-red-600 mb-4">
              {errMsg}
            </p>
          )}
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label
                className={`block font-semibold text-lg  mb-2 ${
                  darkM ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Old Password
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className={`px-4 w-full  py-2 border focus:outline-none rounded-md  ${
                  darkM
                    ? "bg-gray-800 text-gray-200 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className={`block font-semibold mb-2 text-lg  ${
                  darkM ? "text-gray-300" : "text-gray-700"
                }`}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                  darkM
                    ? "bg-gray-800 text-gray-200 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className={`block  font-semibold text-lg mb-2 ${
                  darkM ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.target.value)}
                className={`w-full focus:outline-none px-4 py-2  rounded-md  border ${
                  darkM
                    ? "bg-gray-800 text-gray-200 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white  bg-orange-600  py-2 px-4  hover:bg-orange-400 rounded-md"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
