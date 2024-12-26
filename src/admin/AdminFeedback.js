import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminNav from './AdminNav';

const Adminfeedback = () => {
  const [afeed, setafeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fcid, setFcid] = useState('');
  const [fbn, setFbn] = useState('');
  const [fs, setFs] = useState('');

  useEffect(() => {
    fetchafeed();
  }, []);

  const fetchafeed = async () => {
    try {
      const response = await axios.get('http://localhost:8081/feedbacks');
      setafeed(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setLoading(false);
    }
  };
  
  const clearFilters = () => {
    setFcid('');
    setFbn('');
    setFs('');
  };

  const logout = () => {
    console.log('Logging out...');
  };

  const filteredafeed = afeed.filter((feedback) => {
    return (
      (fcid ? (feedback.customer.customerId.toString().includes(fcid)) : true &&feedback.customer.customerId) &&
      (fbn ? (feedback.feedbackId && feedback.feedbackId.toString().includes(fbn)) : true) &&
      (fs ? (feedback.status && feedback.status === fs) : true)
    );
  });

  const handleChangeStatus = async (feedback) => {
    const updatedFeedback = { ...feedback, status: 'RESOLVED' };

    try {
      await axios.put(`http://localhost:8081/feedbacks/${updatedFeedback.feedbackId}`, updatedFeedback);

      const updatedafeed = afeed.map((item) =>
        item.feedbackId === updatedFeedback.feedbackId ? updatedFeedback : item
      );
      setafeed(updatedafeed);

      alert('Feedback resolved');
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  return (
    <div>
      <AdminNav logout={logout} />
      <div className="bg-gray-50 text-gray-800 min-h-screen p-6">
        <div className="container mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-center">Feedbacks Management</h1>

          <div className="justify-end mb-6 flex">
            <Link to="/admin-dashboard" className="rounded-md hover:bg-cyan-600 transition duration-200 px-4 py-2 bg-cyan-500 text-white "  >
              Back to Dashboard  </Link>
          </div>
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                <input
                  type="text"
                  value={fcid}
                  onChange={(e) => setFcid(e.target.value)}
                  placeholder="Enter Customer ID"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Feedback Number</label>
                <input type="text" value={fbn}
                  onChange={(e) => setFbn(e.target.value)}
                  placeholder="Enter Feedback Number"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={fs}
                  onChange={(e) => setFs(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            <div className="flex items-end">
                <button onClick={clearFilters} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" >lear Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="ont-medium text-gray-600 uppercase px-6 py-3 text-left text-xs f tracking-wider">Customer ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Feedback No</th>
                    <th className="text-gray-600 uppercase tracking-wider px-12 py-3 text-left text-xs font-medium">Feedback </th>                    
                    <th className=" text-gray-600 uppercase tracking-wider px-6 py-3 text-left text-xs font-medium">Status</th>
                    <th className="px-6 py-3 text-gray-600 uppercase text-left text-xs font-medium tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white divide-gray-200">
                  {filteredafeed.map((feedback) => (
                    <tr key={feedback.feedbackId}>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{feedback.customer.customerId}</td>
                      <td className="whitespace-nowrap text-sm text-gray-500 px-6 py-4">{feedback.feedbackId}</td>
                      <td className="px-12 py-4 text-gray-500 whitespace-nowrap text-sm px-6 py-4">{feedback.feedback}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 rounded  py-1 text-sm font-medium ${
                            feedback.status.toLowerCase() === 'pending' ? 'bg-green-200' : 'bg-red-200'
                          }`} >
                          {feedback.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <button className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleChangeStatus(feedback)}
                        > Resolve Feedback  </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminfeedback;
