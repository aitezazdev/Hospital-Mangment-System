import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <header className="md:hidden flex items-center justify-between bg-emerald-600 text-white p-4 shadow-md z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <h2 className="text-lg font-bold">Admin Portal</h2>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white hover:bg-emerald-500 rounded-lg transition-colors">
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      <aside className={`
        bg-gradient-to-b from-emerald-600 to-emerald-700 text-white shadow-2xl w-72 flex flex-col z-40
        fixed inset-y-0 left-0 pt-16 md:pt-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-emerald-500 border-opacity-30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Portal</h2>
              <p className="text-emerald-200 text-sm opacity-90">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        <nav className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <NavLink
              to="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white hover:bg-opacity-10 group ${
                  isActive
                    ? "bg-white text-emerald-500 bg-opacity-20 font-semibold shadow-lg"
                    : "text-emerald-100 hover:text-emerald-500"
                }`
              }>
              <div className="w-6 h-6 bg-current opacity-70 rounded group-hover:opacity-100"></div>
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/approve-doctors"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white hover:bg-opacity-10 group ${
                  isActive
                    ? "bg-white bg-opacity-20 text-emerald-500 font-semibold shadow-lg"
                    : "text-emerald-100 hover:text-emerald-500"
                }`
              }>
              <div className="w-6 h-6 bg-current opacity-70 rounded-full group-hover:opacity-100"></div>
              <span className="font-medium">Approve Doctors</span>
            </NavLink>

            <NavLink
              to="/admin/all-appointments"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white hover:bg-opacity-10 group ${
                  isActive
                    ? "bg-white bg-opacity-20 text-emerald-500 font-semibold shadow-lg"
                    : "text-emerald-100 hover:text-emerald-500"
                }`
              }>
              <div className="w-6 h-6 bg-current opacity-70 rounded group-hover:opacity-100"></div>
              <span className="font-medium">All Appointments</span>
            </NavLink>

            <NavLink
              to="/admin/all-doctors"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white hover:bg-opacity-10 group ${
                  isActive
                    ? "bg-white bg-opacity-20 text-emerald-500 font-semibold shadow-lg"
                    : "text-emerald-100 hover:text-emerald-500"
                }`
              }>
              <div className="w-6 h-6 bg-current opacity-70 rounded group-hover:opacity-100"></div>
              <span className="font-medium">All Doctors</span>
            </NavLink>

            <NavLink
              to="/admin/all-patients"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white hover:bg-opacity-10 group ${
                  isActive
                    ? "bg-white bg-opacity-20 text-emerald-500 font-semibold shadow-lg"
                    : "text-emerald-100 hover:text-emerald-500"
                }`
              }>
              <div className="w-6 h-6 bg-current opacity-70 rounded group-hover:opacity-100"></div>
              <span className="font-medium">All Patients</span>
            </NavLink>

            <NavLink
              to="/admin/profile"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white hover:bg-opacity-10 group ${
                  isActive
                    ? "bg-white bg-opacity-20 text-emerald-500 font-semibold shadow-lg"
                    : "text-emerald-100 hover:text-emerald-500"
                }`
              }>
              <div className="w-6 h-6 bg-current opacity-70 rounded-full group-hover:opacity-100"></div>
              <span className="font-medium">Profile</span>
            </NavLink>
          </div>
        </nav>

        <div className="p-6 border-t border-emerald-500 border-opacity-30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white bg-opacity-60 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-emerald-200 opacity-75 truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden" />
      )}

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
