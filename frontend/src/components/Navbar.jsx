import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/auth";
import {
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (!user.hasProfile) {
        dispatch(logoutUser());
        navigate("/auth/signin");
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    } else {
      navigate("/auth/signin");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 w-full select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="3" width="4" height="8" rx="2" className="fill-teal-500" />
            <rect x="4" y="13" width="4" height="8" rx="2" className="fill-emerald-600" />
            <rect x="6" y="10" width="12" height="4" rx="2" className="fill-teal-600" />
            <rect x="16" y="3" width="4" height="8" rx="2" className="fill-teal-400" />
            <rect x="16" y="13" width="4" height="8" rx="2" className="fill-emerald-500" />
          </svg>
          <div className="leading-tight">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              HMS
            </span>
            <span className="block text-[9px] tracking-wider text-slate-400 font-bold uppercase">
              Clinical System
            </span>
          </div>
        </Link>

        {}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/#departments" className="text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors">Departments</Link>
          <Link to="/#services" className="text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors">Portal Access</Link>
          <Link to="/#about" className="text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {token && user ? (
            <button
              onClick={handleGetStarted}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              Go to Portal <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <Link to="/auth/signin" className="text-slate-600 hover:text-emerald-600 text-sm font-semibold px-3 py-2 transition-colors">
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Book Appointment
              </Link>
            </>
          )}
        </div>

        {}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200">
          <div className="px-4 pt-2 pb-4 space-y-1 text-center">
            <Link to="/#departments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl">Departments</Link>
            <Link to="/#services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl">Portal Access</Link>
            <Link to="/#about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl">Contact</Link>
            <div className="pt-4 border-t border-zinc-200 flex flex-col items-center gap-2">
              {token && user ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); handleGetStarted(); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl"
                >
                  Go to Portal
                </button>
              ) : (
                <>
                  <Link to="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="w-full text-slate-700 font-medium py-2 rounded-xl bg-slate-100 block text-center">
                    Sign In
                  </Link>
                  <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl block text-center">
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
