import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Spinner } from './components/shared/Spinner';
import Layout from './components/shared/Layout';
import Packages from './pages/Packages';
import AllMember from './pages/AllMember';
import NewRequest from './pages/NewRequest';
import AddnewMember from './pages/AddnewMember';
import NewGymRequests from './pages/NewGymRequests';
import NewPackages from './pages/NewPackages';
import UpgradePackage from './pages/UpgradePackage';
import AdminPackages from './pages/AdminPackages';
import AdminContact from './pages/AdminContact';
import Attendance from './pages/Attendance';
import Payment from './pages/Payment';
// Lazy-loaded components
const DashBoard = React.lazy(() => import('./pages/DashBoard'));
const Gyms = React.lazy(() => import('./pages/Gyms'));
const GymUsers = React.lazy(() => import('./pages/GymUsers'));
const AddNewJim = React.lazy(() => import('./pages/AddNewJim'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Earning = React.lazy(() => import('./pages/Earning'));
const Login = React.lazy(() => import('./pages/Login'));
const NoPageFound = React.lazy(() => import('./components/shared/NoPageFound'));
const Otherjims = React.lazy(() => import('./pages/Otherjims'));
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (user && token && role) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <div className="App">
        <div className="Content">
          <Suspense fallback={<Spinner />}>
            {isLoggedIn ? (
              <AuthenticatedApp />
            ) : (
              <UnauthenticatedApp />
            )}
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

// Component for authenticated users
function AuthenticatedApp() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/gyms" element={<NewGymRequests />} />
        <Route path="/gym-users" element={<GymUsers  />} />
        <Route path="/add-new-jim" element={<AddNewJim />} />
        <Route path="/add-new-member" element={<AddnewMember />} />
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/new-gym-request" element={<NewGymRequests  isRequests/>} />
        <Route path="/all-member" element={<AllMember />} />
        <Route path="/Other-jims" element={<Otherjims />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/earning" element={<Earning />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-contact" element={<AdminContact />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/newpackages" element={<NewPackages />} />
        <Route path="/admin-packages" element={<AdminPackages />} />
        <Route path="/checkoutPackage" element={<UpgradePackage />} />
        <Route path="/earning" element={<Earning />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

// Component for unauthenticated users
function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
