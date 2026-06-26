import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, NavLink, Navigate, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Search,
  User,
  Sparkles,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../redux/slices/auth";

const PatientLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (user?.role === "patient" && !user?.hasProfile) {
    return <Navigate to="/patient/create-profile" />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/signin", { replace: true });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between bg-teal-950 text-white p-4 shadow-md z-50">
        <div className="flex items-center space-x-3">
          <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="3" width="4" height="8" rx="2" className="fill-teal-400" />
            <rect x="4" y="13" width="4" height="8" rx="2" className="fill-emerald-400" />
            <rect x="6" y="10" width="12" height="4" rx="2" className="fill-teal-300" />
            <rect x="16" y="3" width="4" height="8" rx="2" className="fill-teal-200" />
            <rect x="16" y="13" width="4" height="8" rx="2" className="fill-emerald-300" />
          </svg>
          <h2 className="text-lg font-bold tracking-tight">Patient Portal</h2>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`
          bg-gradient-to-b from-teal-950 to-slate-950 text-slate-100 shadow-2xl w-72 flex flex-col z-45
          fixed inset-y-0 left-0 pt-16 md:pt-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header Block */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0 animate-pulse" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="3" width="4" height="8" rx="2" className="fill-teal-400" />
              <rect x="4" y="13" width="4" height="8" rx="2" className="fill-emerald-400" />
              <rect x="6" y="10" width="12" height="4" rx="2" className="fill-teal-300" />
              <rect x="16" y="3" width="4" height="8" rx="2" className="fill-teal-200" />
              <rect x="16" y="13" width="4" height="8" rx="2" className="fill-emerald-300" />
            </svg>
            <div>
              <h2 className="text-xl font-black text-white">
                HMS
              </h2>
              <p className="text-teal-400 text-xs font-bold tracking-wide uppercase">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-6 flex-1 overflow-y-auto space-y-2">
          <NavLink
            to="/patient/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-semibold text-sm">Dashboard</span>
          </NavLink>

          <NavLink
            to="/patient/appointments"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Calendar className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-semibold text-sm">Appointments</span>
          </NavLink>

          <NavLink
            to="/patient/find-doctors"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Search className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-semibold text-sm">Find Doctors</span>
          </NavLink>

          <NavLink
            to="/patient/ai-assistant"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Sparkles className="w-5 h-5 text-teal-400 group-[.active]:text-slate-950 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-semibold text-sm">AI Health Assistant</span>
          </NavLink>

          <NavLink
            to="/patient/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <User className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-semibold text-sm">Profile</span>
          </NavLink>
        </nav>

        {/* User Block & Logout */}
        <div className="p-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "Patient"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || "patient@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border border-red-500/20 hover:border-transparent"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Main Container */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="min-h-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;