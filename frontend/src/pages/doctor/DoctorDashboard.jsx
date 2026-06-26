import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { allAppointments } from "../../apis/appointment";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const doctorProfile = useSelector((state) => state.doctorProfile.profile);
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchAllData = async () => {
    if (!doctorProfile?._id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await allAppointments(doctorProfile._id, "all", true);
      const appts = res.appointments || [];
      setAppointments(appts);

      const fee = doctorProfile.consultationFee || 0;
      const startOfToday = moment().startOf("day");
      const endOfToday = moment().endOf("day");
      const startOfWeek = moment().startOf("week");
      const endOfWeek = moment().endOf("week");

      const todayConfirmedOrCompleted = appts.filter((appt) => {
        const d = moment(appt.date);
        return (
          d.isBetween(startOfToday, endOfToday, null, "[]") &&
          (appt.status === "confirmed" || appt.status === "completed")
        );
      });

      const weekConfirmedOrCompleted = appts.filter((appt) => {
        const d = moment(appt.date);
        return (
          d.isBetween(startOfWeek, endOfWeek, null, "[]") &&
          (appt.status === "confirmed" || appt.status === "completed")
        );
      });

      setTodayRevenue(todayConfirmedOrCompleted.length * fee);
      setWeekRevenue(weekConfirmedOrCompleted.length * fee);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorProfile?._id) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [doctorProfile?._id]);

  const getStats = () => {
    const startOfToday = moment().startOf("day");
    const endOfToday = moment().endOf("day");
    const weekStart = moment().startOf("week");
    const weekEnd = moment().endOf("week");
    const monthStart = moment().startOf("month");
    const monthEnd = moment().endOf("month");

    const daily = { all: 0, completed: 0, rejected: 0 };
    const weekly = { all: 0, completed: 0, rejected: 0 };
    const monthly = { all: 0, completed: 0, rejected: 0 };

    appointments.forEach((appt) => {
      const date = moment(appt.date);
      const isToday = date.isBetween(startOfToday, endOfToday, null, "[]");
      const isThisWeek = date.isBetween(weekStart, weekEnd, null, "[]");
      const isThisMonth = date.isBetween(monthStart, monthEnd, null, "[]");

      if (isToday) {
        daily.all++;
        if (appt.status === "completed") daily.completed++;
        if (appt.status === "cancelled") daily.rejected++;
      }
      if (isThisWeek) {
        weekly.all++;
        if (appt.status === "completed") weekly.completed++;
        if (appt.status === "cancelled") weekly.rejected++;
      }
      if (isThisMonth) {
        monthly.all++;
        if (appt.status === "completed") monthly.completed++;
        if (appt.status === "cancelled") monthly.rejected++;
      }
    });

    return { daily, weekly, monthly };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  const statsData = getStats();

  const periods = [
    {
      name: "Daily Overview",
      data: statsData.daily,
      desc: "Today's statistics",
    },
    {
      name: "Weekly Overview",
      data: statsData.weekly,
      desc: "Current week's statistics",
    },
    {
      name: "Monthly Overview",
      data: statsData.monthly,
      desc: "Current month's statistics",
    },
  ];

  return (
    <div className="space-y-6">
      {!user?.isApproved ? (
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-100 p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Account Pending Approval
          </h2>
          <p className="text-slate-600">
            Your account is not approved yet. Please wait for approval from our team.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Doctor Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">{today}</p>
            </div>
            <div className="px-3 py-1 rounded-md text-xs font-semibold border bg-slate-50 text-slate-700 border-slate-200">
              Profile Approved
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {periods.map((period, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm"
              >
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    {period.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {period.desc}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      All
                    </span>
                    <span className="text-2xl font-bold text-slate-800 mt-1 block">
                      {period.data.all}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Completed
                    </span>
                    <span className="text-2xl font-bold text-slate-800 mt-1 block">
                      {period.data.completed}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Rejected
                    </span>
                    <span className="text-2xl font-bold text-slate-800 mt-1 block">
                      {period.data.rejected}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              Revenue Estimates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Today's Revenue
                </span>
                <span className="text-2xl font-bold text-slate-800 block">
                  Rs {todayRevenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Estimated earnings
                </span>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Weekly Revenue
                </span>
                <span className="text-2xl font-bold text-slate-800 block">
                  Rs {weekRevenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  This week's earnings
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
