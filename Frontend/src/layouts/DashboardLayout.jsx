import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('vendor'); // Default

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
      // Not logged in -> Redirect to Login
      if (location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
      return;
    }

    // Role Logic
    if (location.pathname.includes('/admin')) {
      if (userRole !== 'SUPER_ADMIN' && userRole !== 'SUB_ADMIN') {
        // Logged in but not admin -> Redirect to home or vendor dashboard
        window.location.href = '/';
        return;
      }
      setRole('admin');
    } else if (location.pathname.includes('/vendor')) {
      if (userRole !== 'VENDOR') {
        window.location.href = '/';
        return;
      }
      setRole('vendor');
    }
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed Width */}
      <Sidebar role={role} />

      {/* Main Content - Offset by Sidebar width */}
      <div className="flex-1 ml-64 flex flex-col">
        <DashboardNavbar role={role} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
