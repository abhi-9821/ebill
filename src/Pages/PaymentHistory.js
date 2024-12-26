import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";

const PymtHstry = () => {
  const [darkM, setDarkM] = useState(false);
  const [pymtHstry, setPymtHstry] = useState([]);
  const [load, setLoad] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPymtHstry = async () => {
      console.log("Fetching payment history for ID:", id);
      try {
        const response = await axios.get(`http://localhost:8081/bills/id/${id}`);
        console.log("Fetched data:", response.data);
        setPymtHstry(response.data);
      } catch (err) {
        console.err("err fetching payment history:", err.message);
        if (err.response) {
          console.err("Response err:", err.response.data);
        }
        setErr("Failed to fetch payment history.");
      } finally {
        setLoad(false);
      }
    };

    fetchPymtHstry();
  }, [id]);
  return (
    <div
 className={`min-h-screen ${
  darkM ? " text-white bg-black" : "text-gray-900 bg-gray-100 "
   }`}
    >
   <nav
    className={`p-4 ${
      darkM ? "bg-gray-700" : "bg-orange-600"
    }   justify-between flex items-center text-white`}
   >
  <h1 className=" font-bold text-xl ">Ebill history</h1>
   <div>
   <button
 className="py-2 px-4 mr-4 rounded-md  transition"
     onClick={() => setDarkM(!darkM)}
     >
  {darkM ? <FaSun className="text-yellow-500" /> : <FaMoon />}
</button>
      <button
       className="py-2 px-4 text-gray-800 bg-white  rounded-md"
      onClick={() => navigate("/dashboard")}
     >
     Dashboard
  </button>
    </div>
  </nav>

   {/* Content */}
<div className="container mx-auto p-6">
  <h1 className="font-bold text-3xl text-center mb-6 ">Payment History</h1>
        {load ? (
   <div className="text-center">load...</div>
    ) : err ? (
   <div className="text-red-500 text-center ">{err}</div>
   ) : pymtHstry.length === 0 ? (
  <div className="text-center">No payment history available.</div>
   ) : (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
   {pymtHstry.map((payment, index) => (
   <div
   key={index}
      className={`${
         darkM
    ? "text-gray-200 bg-gray-700 "
    : "text-gray-900 bg-white "
     } shadow-lg rounded-lg space-y-4 p-6 duration-300 transition-all hover:shadow-xl hover:scale-105 `}
    >
      <div className="justify-between flex ">
    <div className="text-lg font-semibold ">
      Bill No: {payment.billNo}
</div>
         <div
       className={`px-3 py-1 rounded-full  text-sm ${
  payment.status === "Paid" || payment.status === "PAID"
           ? "bg-green-600 text-white"
: payment.status === "Pending"
      ? "text-white bg-yellow-500 "
      : "text-white bg-red-600 "
          }`}
        >
     {payment.status || "N/A"}
   </div>
    </div>
        <div className="space-y-2">
  <div className="justify-between flex ">
      <span className="font-medium">Due Date:</span>
   <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
    </div>
     <div className="justify-between flex ">
      <span className="font-medium">Total Amount:</span>
              <span>${payment.totalAmount}</span>
      </div>
           <div className="flex justify-between">
      <span className="font-medium">Overdue Amount:</span>
          <span>${payment.overdueAmount}</span>
           </div>
         <div className="justify-between flex ">
      <span className="font-medium">Units Consumed:</span>
          <span>{payment.unitsConsumed}</span>
          </div>
        </div>
      </div>
    ))}
   </div>
  )}
        {/* Back to Dashboard Button */}
<div className="flex mt-8 justify-center ">
     <Link
        to="/dashboard"
  className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-md  transition duration-300"
     >
      Back to Dashboard
       </Link>
     </div>
    </div>
  </div>
  );
};

export default PymtHstry;
