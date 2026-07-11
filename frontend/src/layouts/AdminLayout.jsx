import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  Users,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../redux/slices/auth";

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/signin", { replace: true });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800">
      {}
      <header className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 shadow-md z-50">
        <div className="flex items-center space-x-3">
          <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="3" width="4" height="8" rx="2" className="fill-teal-400" />
            <rect x="4" y="13" width="4" height="8" rx="2" className="fill-emerald-400" />
            <rect x="6" y="10" width="12" height="4" rx="2" className="fill-teal-300" />
            <rect x="16" y="3" width="4" height="8" rx="2" className="fill-teal-200" />
            <rect x="16" y="13" width="4" height="8" rx="2" className="fill-emerald-300" />
          </svg>
          <h2 className="text-lg font-bold tracking-tight">Admin Portal</h2>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {}
      <aside
        className={`
          bg-slate-900 text-slate-100 w-72 flex flex-col z-45
          fixed inset-y-0 left-0 pt-16 md:pt-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="3" width="4" height="8" rx="2" className="fill-teal-400" />
              <rect x="4" y="13" width="4" height="8" rx="2" className="fill-emerald-400" />
              <rect x="6" y="10" width="12" height="4" rx="2" className="fill-teal-300" />
              <rect x="16" y="3" width="4" height="8" rx="2" className="fill-teal-200" />
              <rect x="16" y="13" width="4" height="8" rx="2" className="fill-emerald-300" />
            </svg>
            <div>
              <h2 className="text-xl font-black text-white">HMS</h2>
              <p className="text-teal-400 text-xs font-bold tracking-wide uppercase">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {}
        <nav className="p-6 flex-1 overflow-y-auto space-y-2">
          <NavLink
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/approve-doctors"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <UserCheck className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">Approve Doctors</span>
          </NavLink>

          <NavLink
            to="/admin/all-appointments"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">All Appointments</span>
          </NavLink>

          <NavLink
            to="/admin/all-doctors"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Users className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">All Doctors</span>
          </NavLink>

          <NavLink
            to="/admin/all-patients"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Users className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">All Patients</span>
          </NavLink>

          <NavLink
            to="/admin/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-teal-700 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">Profile</span>
          </NavLink>
        </nav>

        {}
        <div className="p-6 border-t border-zinc-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-zinc-800">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border border-zinc-200 hover:border-transparent"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="min-h-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
