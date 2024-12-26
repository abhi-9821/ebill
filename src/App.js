
import './App.css';
import './input.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import SignInSignUp from './Login/Login';
import AccountDetails from './Pages/AccountDetails';
import BillPayment from './Pages/PayBill';
import PaymentHistory from './Pages/PaymentHistory';
import AdminDashboard from './admin/AdminDashboard';
import ChangePassword from './Pages/ChangePassword';
import AdminLogin from './admin/AdminLogin';
import PR from './PrivateRoute';

import PaymentPage from './Pages/PaymentPage';
import UsersPage from './admin/AllUsers';
import Bills from './admin/AllBills';
import FeedbackForm from './Pages/Feedback';
import BillsPage from './admin/UploadBill';
import Adminfeedback from './admin/AdminFeedback';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInSignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/account/:id" element={<AccountDetails />} />
        <Route path="/pay-bill/:id" element={<BillPayment />} />
        <Route path="/payment-history/:id" element={<PaymentHistory />} />
        <Route
          path="/change-password/:id"
          element={<ChangePassword />}
        />
        <Route path="/feedback/:customerId" element={<FeedbackForm />} />
        <Route path="/customer/:customerId/:billNo" element={<PaymentPage />} />
      </Routes>
      
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path='/admin/users' element={<PR><UsersPage /></PR>} />
        <Route path='/admin/upload-bill' element={<PR><BillsPage /></PR>} />
        <Route path='/admin/previous-bills' element={<PR><Bills /></PR>} />
        <Route path='/admin/feedbacks' element={<PR><Adminfeedback /></PR>} />
        
        

        <Route
          path="/admin-dashboard"
          element={
            <PR>
              <AdminDashboard />
            </PR>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
