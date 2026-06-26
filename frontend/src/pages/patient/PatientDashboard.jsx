import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { nextAppointments } from "../../apis/patient";
import { 
  ArrowRight,
  LogOut
} from "lucide-react";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchDashboardData = async () => {
    try {
      const res = await nextAppointments();
      if (res.success) {
        setAppointments(res.nextAppointments || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.email]);

  return (
    <div className="space-y-8 pb-12">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, <span className="text-teal-600">{user?.name || "Patient"}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Access your medical scheduling, visit statistics, and active clinical records below.</p>
        </div>
        <div className="text-slate-500 text-xs font-medium shrink-0">
          Clinical Date: <span className="font-semibold text-slate-800">{today}</span>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1.5">{stats.total}</p>
        </div>

        {}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmed</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1.5">{stats.confirmed}</p>
        </div>

        {}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1.5">{stats.pending}</p>
        </div>

        {}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1.5">{stats.completed}</p>
        </div>
      </div>

      {}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">
              Upcoming Active Schedules
            </h2>
            {appointments.length > 0 && (
              <span className="text-xs font-semibold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100">
                Next {appointments.length} Visits
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white border border-slate-100 rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-teal-600 mx-auto border-t-transparent"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-3 w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Dr. {appt.doctor?.user?.name || "Specialist"}
                        </h3>
                        <p className="text-xs text-teal-600 font-semibold mt-0.5">
                          {appt.doctor?.specialty || "General Practitioner"}
                        </p>
                      </div>
                      <div className="sm:hidden">
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${
                          appt.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div>
                        <span className="font-semibold text-slate-700 block">Date</span>
                        {new Date(appt.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Time Slot</span>
                        {appt.startTime} - {appt.endTime}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Consultation Fee</span>
                        Rs. {appt.doctor?.consultationFee || 1500}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Reason</span>
                        <span className="truncate max-w-[150px] block">{appt.reason || "General Checkup"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end justify-center shrink-0">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                      appt.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center flex flex-col items-center justify-center space-y-4">
              <div className="max-w-xs">
                <h4 className="text-sm font-bold text-slate-800">No Upcoming Appointments</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You don't have any active schedules or pending visits at this moment.
                </p>
              </div>
              <Link
                to="/patient/find-doctors"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Book an Appointment <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Sidebar: Quick Actions & Portal Links */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">
              Quick Portals
            </h2>
          </div>

          <div className="space-y-4">
            {/* Book Doctor */}
            <Link
              to="/patient/find-doctors"
              className="group block bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all"
            >
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center justify-between">
                Find Clinical Specialist
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Browse verified hospital doctors, view active calendars, and book slots.
              </p>
            </Link>

            {/* AI Assistant */}
            <Link
              to="/patient/ai-assistant"
              className="group block bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all"
            >
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center justify-between">
                AI Health Assistant
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Check potential health conditions based on symptoms (disclaimer applied).
              </p>
            </Link>

            {/* View Profile */}
            <Link
              to="/patient/profile"
              className="group block bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all"
            >
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center justify-between">
                Manage Health Profile
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Update demographic info, emergency address, and clinical record histories.
              </p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
