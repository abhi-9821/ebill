import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const AccountDetails = () => {
  const { id } = useParams();
  const [cData, setCData] = useState(null);
  const [editM, setEditM] = useState(false);
  const [dataUpdated, setDataUpdated] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [darkM, setDarkM] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchcData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/customers/${id}`);
        if (!response.ok) throw new Error("Failed to fetch customer data");
        const data = await response.json();
        setCData(data);
        setDataUpdated(data);
      } catch (error) {
        setErrorMsg(error.message);
      }
    };
    fetchcData();
  }, [id]);

  const handleEdit = () => setEditM(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataUpdated((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8081/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUpdated),
      });
      if (!response.ok) throw new Error("Unable to update customer details");
      const updatedCustomer = await response.json();
      setCData(updatedCustomer);
      setEditM(false);
      setSuccessMsg("Updated Successfully!");
      setTimeout(() => setSuccessMsg(""), 3000); 
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  if (errorMsg) {
    return (
      <div
        className={`flex min-h-screen  justify-center items-center ${
          darkM ? " text-gray-200 bg-gray-800"  : " text-gray-900 bg-gray-100"
        }`}
      >
        <p>Error: {errorMsg}</p>
      </div>
    );
  }

  if (!cData) {
    return (
      <div
        className={` justify-center flex items-center min-h-screen  ${
          darkM ? " text-gray-200 bg-gray-800" : " text-gray-900 bg-gray-100"
        }`}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkM ? " text-gray-200 bg-black" : " text-gray-900 bg-gray-100"
      }`}
    >
      <nav
        className={`p-4 ${
          darkM ? "bg-gray-700" : "bg-orange-600"
        } text-white items-center justify-between flex `}
      >
        <h1 className=" font-bold text-xl ">Customer Portal</h1>
        <div>
          <button
            className=" py-2 px-4   mr-4 rounded-md transition"
            onClick={() => setDarkM(!darkM)}
          >
            {darkM ? <FaSun className="text-yellow-500" /> : <FaMoon />}
          </button>
          <button
            className="bg-white px-4 py-2 rounded-md text-gray-800 "
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6 container mx-auto ">
        <h1 className="font-bold text-3xl  mb-6 text-center">Account Details</h1>
        {successMsg && (
          <p className="text-center font-semibold text-green-600 ">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="text-red-600 text-center  font-semibold">
            {errorMsg}
          </p>
        )}
        <div
          className={`${
            darkM ? "bg-gray-700 text-gray-200" : "bg-white"
          } shadow-lg rounded-lg p-6`}
        >
          {editM ? (
            <>
              <form>
  {Object.keys(cData).map((key) => {
    console.log("Field key:", key); // Debug the keys being iterated
    return (
      <div key={key} className="mb-4">
        <label
          className={` text-lg block  font-semibold mb-2 ${
            darkM ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}:
        </label>
        <input
          type="text"
          name={key}
          value={dataUpdated[key]}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
            darkM
              ? " text-gray-200 bg-gray-800  border-gray-600"
              : "border-gray-300bg-gray-100 "
          }`}
          disabled={key === "email" || key === "password" || key === "customerId"}
        />
      </div>
    );
  })}
</form>

              <div className="justify-centerflex  gap-4 mt-4">
                <button
                  onClick={handleSubmit}
                  className="py-2 px-6  bg-green-600  hover:bg-green-500 text-white rounded-md"
                >
                  Submit
                </button>
                <button
                  onClick={() => setEditM(false)}
                  className="py-2 px-6  bg-red-600  hover:bg-red-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <table
              className={`text-left w-full  ${
                darkM ? "text-gray-200" : "text-gray-900"
              }`}
            >
              <tbody>
                {Object.keys(cData).map((key) => (
                  <tr key={key}>
                    <th className="px-4 py-2 text-lg font-semibold">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                    <td className="px-4 py-2">{cData[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!editM && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-6 py-2 text-white rounded-md bg-orange-600 hover:bg-orange-500"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
              <button
                className="px-6 py-2 text-white rounded-md hover:bg-blue-500  bg-blue-600"
                onClick={handleEdit}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
