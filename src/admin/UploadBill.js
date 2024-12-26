import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNav from './AdminNav';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchBills();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:8081/bills');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const handleChange = (e, field) => {
    if (currentBill) {
      setCurrentBill({
        ...currentBill,
        [field]: e.target.value,
      });
    }
  };

  const handleCustomerChange = (e) => {
    setCurrentBill({
      ...currentBill,
      customer: {
        customerId: e.target.value
      }
    });
  };

  const updateBill = async () => {
    if (!currentBill) return;
    try {
      // Ensure proper field mapping
      const formattedBill = {
        ...currentBill,
        totalAmount: parseFloat(currentBill.totalAmount),
        unitsConsumed: parseInt(currentBill.unitsConsumed),
        overdueAmount: parseFloat(currentBill.overdueAmount || 0),
        status: currentBill.status || 'PENDING',  // Default to 'PENDING' if not provided
        dueDate: currentBill.dueDate ? new Date(currentBill.dueDate).toISOString() : null, // Ensure correct date format
      };

      if (currentBill.billNo) {
        // PUT request to update the bill
        const response = await axios.put(`http://localhost:8081/bills/change/${currentBill.billNo}`, formattedBill);
        const updatedBill = response.data; // Get the updated bill from the response
        
        // Update the bills array in state
        setBills(prevBills => 
          prevBills.map(bill => bill.billNo === updatedBill.billNo ? updatedBill : bill)
        );
      } else {
        await axios.post('http://localhost:8081/bills', formattedBill);
      }

      // Hide the edit modal after successful update
      setEditMode(false);
      alert(currentBill.billNo ? 'Bill updated successfully' : 'Bill added successfully');
    } catch (error) {
      console.error('Error updating/adding bill:', error);
      alert('Error saving bill. Please try again.');
    }
  };

  const deleteBill = async (billNo) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await axios.delete(`http://localhost:8081/admins/bills/${billNo}`);
        fetchBills();
        alert('Bill deleted successfully');
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Error deleting bill. Please try again.');
      }
    }
  };

  const toggleEditMode = (bill) => {
    if (bill) {
      // Set current bill when editing
      setCurrentBill({
        ...bill,
        status: bill.status || 'PENDING',  // Default status if not provided
      });
    } else {
      // Reset current bill for adding a new bill
      setCurrentBill({
        customer: { customerId: '' },
        paidDate: '',
        totalAmount: '',
        dueDate: '',
        overdueAmount: 0,
        unitsConsumed: '',
        status: 'PENDING',  // Default to 'PENDING' for new bills
      });
    }
    setEditMode(true);
  };

  const logout = () => {
    console.log('Logging out...');
  };

  return (
    <div>
      <AdminNav logout={logout} />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Bills Management</h1>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => toggleEditMode(null)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            Add New Bill
          </button>
          <Link
            to="/admin-dashboard"
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Consumed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => (
                <tr key={bill.billNo}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.customer.customerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.unitsConsumed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleEditMode(bill)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBill(bill.billNo)} // Use billNo instead of billId
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

        {editMode && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">
                {currentBill.billNo ? 'Edit Bill' : 'Add New Bill'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <select
                    value={currentBill?.customer?.customerId || ''}
                    onChange={handleCustomerChange}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name} ({customer.customerId})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Units Consumed</label>
                  <input
                    type="number"
                    value={currentBill?.unitsConsumed || ''}
                    onChange={(e) => handleChange(e, 'unitsConsumed')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentBill?.totalAmount || ''}
                    onChange={(e) => handleChange(e, 'totalAmount')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="datetime-local"
                    value={currentBill?.dueDate ? new Date(currentBill.dueDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleChange(e, 'dueDate')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={currentBill?.status || 'PENDING'}
                    onChange={(e) => handleChange(e, 'status')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overdue Amount</label>
                  <input
                    type="number"
                    value={currentBill?.overdueAmount || ''}
                    onChange={(e) => handleChange(e, 'overdueAmount')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={updateBill}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  {currentBill.billNo ? 'Update Bill' : 'Add Bill'}
                </button>
              </div>
              <button
                onClick={() => setEditMode(false)}
                className="mt-4 text-red-500 hover:text-red-700 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillsPage;
