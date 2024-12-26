import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNav from './AdminNav';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fcid, setfcid] = useState('');
  const [fbn, setfbn] = useState('');
  const [fm, setfm] = useState('');
  const [fs, setfs] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:8081/bills');
      setBills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setfcid('');
    setfbn('');
    setfm('');
    setfs('');
  };

  const logout = () => {
    console.log('Logging out...');
  };

  const filteredBills = bills.filter((bill) => {
    const billMonth = new Date(bill.dueDate).getMonth() + 1;
    const billYear = new Date(bill.dueDate).getFullYear();
    const fmNumber = fm ? parseInt(fm.split('-')[1], 10) : null;
    const filterYear = fm ? parseInt(fm.split('-')[0], 10) : null;

    return (
      (fcid ? (bill.customer.customerId && bill.customer.customerId.toString().includes(fcid)) : true) &&
      (fbn ? (bill.billNo && bill.billNo.toString().includes(fbn)) : true) &&
      (fm
        ? billMonth === fmNumber && billYear === filterYear
        : true) &&
      (fs ? (bill.status && bill.status === fs) : true)
    );
  });

  const handleEditBill = (bill) => {
    setCurrentBill(bill);
    setEditMode(true);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setCurrentBill((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveBill = async () => {
    try {
      const { billNo, customer, unitsConsumed, totalAmount, dueDate, status } = currentBill;
      const updatedBill = {
        customer,
        unitsConsumed: parseInt(unitsConsumed),
        totalAmount: parseFloat(totalAmount),
        dueDate: new Date(dueDate).toISOString(),
        status,
      };

      if (billNo) {
        // Update existing bill
        await axios.put(`http://localhost:8081/bills/change/${billNo}`, updatedBill);
        alert('Bill updated successfully');
      } else {
        // Create new bill
        await axios.post('http://localhost:8081/bills', updatedBill);
        alert('Bill added successfully');
      }

      // Refresh the bills after save
      fetchBills();
      setEditMode(false);
      setCurrentBill(null);
    } catch (error) {
      console.error('Error saving bill:', error);
      alert('Error saving bill');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentBill(null);
  };

  return (
    <div>
      <AdminNav logout={logout} />
      <div className="bg-gray-50 text-gray-800 min-h-screen p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Bills Management</h1>

          <div className="flex justify-end mb-6">
            <Link
              to="/admin-dashboard"
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-200"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                <input
                  type="text"
                  value={fcid}
                  onChange={(e) => setfcid(e.target.value)}
                  placeholder="Enter Customer ID"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bill Number</label>
                <input
                  type="text"
                  value={fbn}
                  onChange={(e) => setfbn(e.target.value)}
                  placeholder="Enter Bill Number"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date (Month)</label>
                <input
                  type="month"
                  value={fm}
                  onChange={(e) => setfm(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={fs}
                  onChange={(e) => setfs(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 uppercase py-3 text-left font-medium text-gray-600 text-xs tracking-wider">Customer ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Bill No</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 font-medium uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 font-medium text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th className="font-medium text-gray-600 px-6 py-3 text-left text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill.billNo}>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{bill.customer.customerId}</td>
                      <td className="whitespace-nowrap text-sm text-gray-500 px-6 py-4">{bill.billNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${bill.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 text-sm rounded ${
                            bill.status === 'Paid' || bill.status === 'PAID' ? 'bg-green-200' : 'bg-red-200'
                          }`}
                        >
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditBill(bill)}
                          className="hover:bg-yellow-700 text-white font-bold py-2 px-4 bg-yellow-500 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => alert(`Delete Bill ${bill.billNo}`)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Bill Modal */}
      {editMode && currentBill && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">Edit Bill</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bill Number</label>
              <input
                type="text"
                value={currentBill.billNo || ''}
                disabled
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Units Consumed</label>
              <input
                type="number"
                value={currentBill.unitsConsumed || ''}
                onChange={(e) => handleInputChange(e, 'unitsConsumed')}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="number"
                value={currentBill.totalAmount || ''}
                onChange={(e) => handleInputChange(e, 'totalAmount')}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="datetime-local"
                value={currentBill.dueDate ? new Date(currentBill.dueDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleInputChange(e, 'dueDate')}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={currentBill.status || 'PENDING'}
                onChange={(e) => handleInputChange(e, 'status')}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveBill}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md ml-2 hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
