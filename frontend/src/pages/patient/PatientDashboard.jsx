import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { nextAppointments } from "../../apis/patient";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  User, 
  Activity, 
  Sparkles, 
  ClipboardList 
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-2xl shadow-xl p-8 border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Welcome back, <span className="text-teal-400 font-bold">{user?.name || "Patient"}</span>
            </h1>
            <p className="text-teal-100/80 text-base sm:text-lg font-medium max-w-xl">
              Access your medical scheduling, visit statistics, and active clinical records below.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-5 py-3 shadow-inner shrink-0">
            <p className="text-[10px] text-teal-300 font-bold uppercase tracking-wider mb-0.5">Clinical Date</p>
            <p className="font-semibold text-white text-sm">{today}</p>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</h3>
            </div>
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Confirmed Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.confirmed}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</p>
              <h3 className="text-3xl font-extrabold text-amber-500 mt-2">{stats.pending}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</p>
              <h3 className="text-3xl font-extrabold text-teal-700 mt-2">{stats.completed}</h3>
            </div>
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Appointments + Quick Navigation */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left/Middle: Upcoming Appointments (Col-Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-teal-600" />
              Upcoming Active Schedules
            </h2>
            {appointments.length > 0 && (
              <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-100">
                Next {appointments.length} Visits
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white border border-slate-100 rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-teal-600 border-t-transparent"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-3 w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-800">
                          Dr. {appt.doctor?.user?.name || "Specialist"}
                        </h3>
                        <p className="text-xs text-teal-600 font-semibold">
                          {appt.doctor?.specialty || "General Practitioner"}
                        </p>
                      </div>
                      <div className="sm:hidden">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          appt.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
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
                        <span className="truncate max-w-[120px] block">{appt.reason || "General Checkup"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end justify-between h-full min-h-[70px] shrink-0">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      appt.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="max-w-xs">
                <h4 className="text-base font-bold text-slate-800">No Upcoming Appointments</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You don't have any pending or confirmed sessions scheduled at this moment.
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
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-800">
              Quick Portals
            </h2>
          </div>

          <div className="space-y-4">
            {/* Book Doctor */}
            <Link
              to="/patient/find-doctors"
              className="group block bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors flex items-center gap-1">
                    Find Clinical Specialist <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Browse verified hospital doctors, view active calendars, and book slots.
                  </p>
                </div>
              </div>
            </Link>

            {/* AI Assistant */}
            <Link
              to="/patient/ai-assistant"
              className="group block bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                    AI Health Assistant <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Check potential health conditions based on symptoms (disclaimer applied).
                  </p>
                </div>
              </div>
            </Link>

            {/* View Profile */}
            <Link
              to="/patient/profile"
              className="group block bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-slate-700 group-hover:text-white transition-colors">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-700 transition-colors flex items-center gap-1">
                    Manage Health Profile <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Update demographic info, emergency address, and clinical record histories.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
