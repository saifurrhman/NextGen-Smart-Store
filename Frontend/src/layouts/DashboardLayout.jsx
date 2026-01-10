import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';

const DashboardLayout = () => {
  const location = useLocation();
  const [role, setRole] = useState('vendor'); // Default

  useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setRole('admin');
    } else {
      setRole('vendor');
    }
  }, [location]);

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
