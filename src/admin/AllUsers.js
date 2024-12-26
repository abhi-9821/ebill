import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNav from './AdminNav';
const UsersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [cc, setcc] = useState(null);
  const [edit, setedit] = useState(false);
  useEffect(() => {cus();
  }, []);
  const cus = async () => {
    try {
      const response = await axios.get('http://localhost:8081/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  const uc = async () => {
    if (!cc) return;
    try {
      await axios.put(`http://localhost:8081/customers/${cc.customerId}`, cc);
      setCustomers(prev => prev.map(customer =>
        customer.customerId === cc.customerId ? cc : customer
      ));
      setedit(false);
      alert('Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };
  const hc = (e, field) => {
    if (cc) {
      setcc({
        ...cc,
        [field]: e.target.value,
      });
    }
  };
  const toggleEditMode = (customer) => {
    if (customer) {
      setcc({ ...customer });
    } else {
      setcc({ customerId: 0, name: '', address: '', city: '', state: '', email: '', phoneNumber: '', password: '', accountType: '' });
    }
    setedit(prev => !prev);
  };
  const logout = () => {
    console.log('Logging out...');
  };

  return (
    <div>
      <AdminNav
        logout={logout}
      />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Customer Management</h1>
        <div className="flex justify-end mb-4">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.customerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleEditMode(customer)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {edit && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">{cc ? 'Edit Customer' : 'Add Customer'}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={cc?.name || ''}
                    onChange={(e) => hc(e, 'name')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={cc?.address || ''}
                    onChange={(e) => hc(e, 'address')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={cc?.city || ''}
                    onChange={(e) => hc(e, 'city')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={cc?.state || ''}
                    onChange={(e) => hc(e, 'state')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={cc?.email || ''}
                    onChange={(e) => hc(e, 'email')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={cc?.phoneNumber || ''}
                    onChange={(e) => hc(e, 'phoneNumber')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <input
                    type="text"
                    value={cc?.accountType || ''}
                    onChange={(e) => hc(e, 'accountType')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={cc?.password || ''}
                    onChange={(e) => hc(e, 'password')}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={uc}
                  className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setedit(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                > Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
