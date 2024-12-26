import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const FeedbackForm = () => {
  const [darkM, setDarkM] = useState(false);
  const [detailsOfCustomers, setDetailsOfCustomers] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const storeddarkM = localStorage.getItem('darkM') === 'true';
    setDarkM(storeddarkM);
  }, []);

  
  const toggledarkM = () => {
    setDarkM((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkM', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    const storedDetails = localStorage.getItem("detailsOfCustomers");
    if (storedDetails) {
      try {
        const parsedDetails = JSON.parse(storedDetails);
        setDetailsOfCustomers(parsedDetails);
      } catch (error) {
        console.error("Error parsing customer details:", error);
        setErrorMsg("Error loading customer details");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMsg('');

    if (!feedback.trim()) {
      setErrorMsg("Please enter your feedback");
      setIsSubmitting(false);
      return;
    }

    const feedbackData = {
      customer: {
        customerId: detailsOfCustomers?.customerId
      },
      feedback: feedback,
      feedbackDate: new Date().toISOString(),
      status: "NEW"
    };

    try {
      const response = await fetch('http://localhost:8081/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFeedback('');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
      setErrorMsg('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${darkM ? 'text-white bg-gray-900 ' : 'text-gray-800 bg-gray-50 '} min-h-screen`}>

      <nav
        className={`p-4 ${
          darkM ? "bg-gray-700" : "bg-orange-600"
        } text-white  justify-between flex items-center`}
      >
        <h1 className="text-xl font-bold">Feedback</h1>
        <div>
          <button
            className="px-4 py-2  mr-4 rounded-md transition"
            onClick={() => setDarkM(!darkM)}
          >
            {darkM ? <FaSun className="text-yellow-500" /> : <FaMoon />}
          </button>
          <button
            className="px-4  bg-white py-2 rounded-md text-gray-800 "
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </nav>


      <div className=" mx-auto max-w-3xl shadow-xl bg-white  rounded-lg p-8 mt-8">
  <h2 className="text-3xl font-bold text-gray-900">Customer Feedback</h2>
  <p className="mt-4 text-lg text-gray-700">
    {detailsOfCustomers && (
      <div className="mt-4 text-black-600 text-m  font-semibold">
        Customer ID: <span className="">{detailsOfCustomers.customerId}</span>
      </div>
    )}
  </p>

  <form onSubmit={handleSubmit} className="space-y-6 mt-6">
    {/* Feedback Textarea */}
    <div>
      <label
        htmlFor="feedback"
        className="block  font-medium text-sm text-gray-700"
      >
        Your Feedback
      </label>
      <textarea
        id="feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Please share your experience with us..."
        className="mt-1 w-full  rounded-xl focus:outline-none p-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      />
    </div>

    {/* Success Message */}
    {submitStatus === 'success' && (
      <div className="bg-green-50  p-4 border-l-4 border-green-400 rounded-md">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6  text-green-500 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className=" text-green-600 font-semibold">Success!</p>
        </div>
        <p className="mt-2 text-sm text-green-600">
          Thank you for your feedback. We appreciate your input!
        </p>
        <p
            className="underline rounded-md  text-blue-600 cursor-pointer" 
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
      </div>
    )}
    
    {submitStatus === 'error' && (
      <div className="bg-red-50  border-red-400 p-4  border-l-4 rounded-md">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6  mr-2 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="font-semibold text-red-600">Error</p>
        </div>
        <p className="mt-2  text-red-600 text-sm">{errorMsg}</p>
      </div>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full  p-3 rounded-lg text-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
    >
      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
    </button>
  </form>
</div>

    </div>

  );
};

export default FeedbackForm;
