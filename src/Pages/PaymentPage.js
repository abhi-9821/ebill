import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";

const PaymentPage = () => {
  const { custId, billNo } = useParams();
  const navigate = useNavigate();
  const [darkM, setDarkM] = useState(false);
  const [pymtMthd, setPymtMthd] = useState("CREDIT_CARD"); // Default to CREDIT_CARD
  const [transacId, setTransacId] = useState("");
  const [billDtls, setBillDtls] = useState(null);
  const [status, setStatus] = useState(null);
  const [load, setLoad] = useState(true);
  const [paymntDtls, setPaymntDtls] = useState([]);
  const [paymntDtlInpt, setPaymntDtlInpt] = useState("");

  // Map display values to API values
  const pymtMthdsMap = {
    "Credit Card": "CREDIT_CARD",
    "Debit Card": "DEBIT_CARD",
    "Net Banking": "NET_BANKING",
    "UPI": "UPI"
  };

  // Generate a unique transaction ID when the component mounts
  useEffect(() => {
    const generatetransacId = () => {
    return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    };
    setTransacId(generatetransacId());
  }, []);

  // Fetch the bill details when the component mounts
  useEffect(() => {
   const fetchBillDtls = async () => {
   try {
    const response = await axios.get(`http://localhost:8081/bills/${billNo}`);
       const payingbill = response.data;
     setBillDtls(payingbill);
    } catch (err) {
     console.error("Error fetching bill details:", err.message);
     setStatus("Failed to fetch bill details.");
   } finally {
     setLoad(false);
     }
   };

   if (billNo) {
     fetchBillDtls();
    }
  }, [billNo]);

  // Fetch the payment details when the component mounts
  useEffect(() => {
  const fetchPaymntDtls = async () => {
   try {
    const response = await axios.get(`http://localhost:8081/api/paymntDtls`);
     setPaymntDtls(response.data);
    } catch (err) {
    console.error("Error fetching payment details:", err.message);
    }
  };
   fetchPaymntDtls();
 }, []);
  // Handle the payment process
const handlePayment = async () => {
  try {
   // Validate payment details by calling the backend API
    const response = await axios.post("http://localhost:8081/api/paymntDtls/validatePayment", {
    paymentType: pymtMthd,  // Send the mapped value
   paymentDetail: paymntDtlInpt,  
   });
     if (response.data.includes("Success")) {
    // Proceed with further payment logic
  const paymentResponse = await axios.post(`http://localhost:8081/payments/${billNo}`, {
   pymtMthd,
     paymentDetail: paymntDtlInpt,
       transacId,
     amountPaid: parseFloat(billDtls.totalAmount),
     });

    setStatus("Payment Successful!");
   setTimeout(() => navigate("/dashboard"), 2000);
   } else {
   setStatus(response.data);  // Show error if validation fails
    }
 } catch (error) {
 console.error("Payment failed:", error);
 setStatus("Payment Failed.");
  }
};
  if (load) {
  return <div className="text-xl text-center ">Load...</div>;
 }
 return (
  <div className={`h-screen ${darkM ? "text-white bg-gray-900 " : "text-black bg-gray-100 "}`}>
    <nav
     className={`p-4 ${darkM ? "bg-gray-800" : "bg-orange-600"} text-white flex justify-between items-center shadow-md`}
   >
   <h1 className="text-xl font-bold">Customer Portal</h1>
     <div>
     <button
    className="px-4 py-2 rounded-md mr-4 bg-white text-gray-800"
     onClick={() => setDarkM(!darkM)}
     >
  {darkM ? <FaSun className="text-yellow-500" /> : <FaMoon />}
     </button>
    <button
   className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
     onClick={() => navigate("/dashboard")}
  >
   Dashboard
   </button>
   </div>
   </nav>
      <div className={`shadow-lg rounded-lg  max-w-md w-full p-6  mx-auto mt-12 ${darkM ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
       <h1 className="text-2xl font-bold mb-6 text-center">
          Payment for Bill No: <span className="text-orange-600">{billNo}</span>
</h1>
        {billDtls && (
    <div className="space-y-4">
        <div>
       <label className="block font-medium mb-2">Transaction ID</label>
      <input
      type="text"
         className="w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
     value={transacId}
        readOnly
        />
        </div>
            <div className={`${darkM ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
       <label className="block font-medium mb-2">Payment Method</label>
        <select
      className="w-full p-2  bg-gray-100 border rounded text-gray-600"
    value={pymtMthd} // State stores the API value
    onChange={(e) => setPymtMthd(pymtMthdsMap[e.target.value])} // Map UI text to API value
      >
    <option value="Credit Card">Credit Card</option>
    <option value="Debit Card">Debit Card</option>
    <option value="Net Banking">Net Banking</option>
             <option value="UPI">UPI</option>
  </select>
     </div>
           <div>
    <label className="block  mb-2 font-medium">Enter {pymtMthd} details</label>
        <input
    type="text"
            className="w-full  border rounded p-2 bg-gray-100 text-gray-600"
               value={paymntDtlInpt}
                onChange={(e) => setPaymntDtlInpt(e.target.value)}
       />
        </div>
            <div>
              <label className="block mb-2 font-medium ">Amount to be Paid: ${billDtls.totalAmount}</label>
      <input
          type="number"
          className="w-full p-2 border rounded cursor-not-allowed bg-gray-100 text-gray-600 "
      value={billDtls.totalAmount}
        readOnly
        />
            </div>
     <button
           className="mt-4 w-full bg-orange-600 hover:bg-orange-500 font-bold rounded text-white py-2  transition duration-300"
   onClick={handlePayment}
           >
              Pay Now
     </button>
     <button
           className="mt-4 w-full bg-orange-600 text-white py-2 hover:bg-orange-500  font-bold rounded transition duration-300"
                onClick={() => navigate(`/pay-bill/${  custId}`)}
              >
                Back to Bills
              </button>

            {status && (
              <p
       className={`text-center font-bold  mt-4 ${
          status === "Payment Successful!"
         ? "text-green-600"
                    : "text-red-600"
                }`}
             >
          {status}
             </p>
           )}
          </div>
       )}
   </div>
    </div>
  );
};

export default PaymentPage;
