import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";

const BillPayment = () => {
  const [darkM, setDarkM] = useState(false);
  const [billDtls, setBillDtls] = useState([]);
  const [billsCurrMonth, setBillsCurrMonth] = useState([]);
  const [prevBills, setPrevBills] = useState([]);
  const [load, setLoad] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchbillDtls = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/bills/pending/id/${id}`);
        const bills = response.data;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const billsOfThisMonth = bills.filter(bill => {
          const dueDate = new Date(bill.dueDate);
          return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
        });

        const prevBills = bills.filter(bill => {
          const dueDate = new Date(bill.dueDate);
          return dueDate.getMonth() !== currentMonth || dueDate.getFullYear() !== currentYear;
        });

        setBillDtls(bills);
        setBillsCurrMonth(billsOfThisMonth);
        setPrevBills(prevBills);
      } catch (err) {
        console.err("err fetching bill details:", err.message);
        setErr("Failed to fetch bill details.");
      } finally {
        setLoad(false);
      }
    };

    fetchbillDtls();
  }, [id]);

  if (load) {
    return <div className=" text-xl text-center ">load...</div>;
  }

  if (err) {
    return <div className=" text-red-500 text-center">{err}</div>;
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-white bg-green-500 ";
      case "pending":
        return "text-white bg-yellow-500 ";
      case "overdue":
        return "text-white bg-red-500 ";
      default:
        return "text-white bg-gray-400 ";
    }
  };

  const renderBills = (bills, heading) => (
    <div className="mb-12">
      <h2 className="text-2xl mb-6 font-semibold ">{heading}</h2>
      {bills.length > 0 ? (
        <div className="grid  lg:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-6">
          {bills.map((bill) => (
            <div
            key={bill.billNo}
            className={`p-6  transform hover:scale-105 rounded-lg shadow-lg transition duration-300 ${
              darkM ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="text-xl  mb-4 font-bold">Bill No: {bill.billNo}</h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-36 font-semibold ">Total Amount:</span>
                <span>${bill.totalAmount}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold ">Due Date:</span>
                <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold ">Units Consumed:</span>
                <span>{bill.unitsConsumed} kWh</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold ">Status:</span>
                <span
                  className={`py-1 px-3 font-medium text-sm  ${getStatusClass(
                    bill.status || "pending"
                  )}`}
                >
                  {bill.status || "Pending"}
                </span>
              </div>
            </div>
            <button
  className="mt-6 px-6 py-2 hover:bg-orange-500  w-full bg-orange-600 text-white font-bold rounded-md"
  onClick={() => navigate(`/customer/${id}/${bill.billNo}`)}
>
  Pay Now
</button>

          </div>
          
          ))}
        </div>
      ) : (
        <p className="text-center">No bills available.</p>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${darkM ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <nav
        className={`p-4 ${
          darkM ? "bg-gray-800" : "bg-orange-600"
        } text-white  items-center flex justify-between shadow-md`}
      >
        <h1 className="font-bold text-xl ">Unpaid Bills</h1>
        <div>
          <button
            className="px-4 py-2 bg-white  rounded-md mr-4 text-gray-800"
            onClick={() => setDarkM(!darkM)}
          >
            {darkM ? <FaSun className="text-yellow-500" /> : <FaMoon />}
          </button>
          <button
            className="px-4 py-2 text-white rounded-md  bg-gray-700 hover:bg-gray-600"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6">
        <h1 className="text-3xl  mb-12 font-bold text-center">Bill Payment</h1>
        {renderBills(billsCurrMonth, "Bills of This Month")}
        {renderBills(prevBills, "Previous Bills")}
      </div>
    </div>
  );
};

export default BillPayment;
