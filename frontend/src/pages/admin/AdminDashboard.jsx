import React, { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { fullList } from "../../apis/admin";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fullList();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-16 h-16 border-4 border-zinc-200 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] p-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-8 max-w-md w-full shadow-sm">
          <div className="flex justify-center text-red-500 mb-4">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
            Error Loading Data
          </h2>
          <p className="text-slate-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border-none">
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const appointments = data?.stats?.appointmentStats || {};
  const doctors = data?.doctors || [];
  const patients = data?.patients || [];
  const allAppointments = data?.appointments || [];

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors || 0,
    },
    {
      title: "Pending Approvals",
      value: stats.pendingDoctors || 0,
    },
    {
      title: "Total Patients",
      value: stats.totalPatients || 0,
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments || 0,
    },
  ];

  const appointmentCards = [
    {
      title: "Pending",
      value: appointments.pending || 0,
    },
    {
      title: "Confirmed",
      value: appointments.confirmed || 0,
    },
    {
      title: "Completed",
      value: appointments.completed || 0,
    },
    {
      title: "Cancelled",
      value: appointments.cancelled || 0,
    },
  ];

  const activeDoctors = (stats.totalDoctors || 0) - (stats.pendingDoctors || 0);

  const completionRate = stats.totalAppointments
    ? Math.round((appointments.completed / stats.totalAppointments) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">{today}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-slate-800 block">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Appointment Overview
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              Total: {stats.totalAppointments || 0}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appointmentCards.map((card, index) => (
              <div
                key={index}
                className="border border-zinc-200 rounded-xl p-5 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-slate-800 block">
                  {card.value}
                </span>
                <div className="mt-2 text-[10px] text-slate-400 font-semibold">
                  {stats.totalAppointments
                    ? `${Math.round(
                        (card.value / stats.totalAppointments) * 100
                      )}% of total`
                    : "0% of total"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Doctors</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Active</span>
                <span className="font-bold text-slate-800">
                  {activeDoctors}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Pending Approval</span>
                <span className="font-bold text-slate-800">
                  {stats.pendingDoctors || 0}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-500"
                  style={{
                    width: `${
                      stats.totalDoctors
                        ? (activeDoctors / stats.totalDoctors) * 100
                        : 0
                    }%`,
                  }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">
                {stats.totalDoctors
                  ? `${Math.round(
                      (activeDoctors / stats.totalDoctors) * 100
                    )}% of profiles approved`
                  : "No profiles"}
              </p>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Patients</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Total Registered</span>
                <span className="font-bold text-slate-800">
                  {stats.totalPatients || 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">With Appointments</span>
                <span className="font-bold text-slate-800">
                  {new Set(allAppointments.map((a) => a.patient?._id)).size}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="border-b border-zinc-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Completion Rate</span>
                <span className="font-bold text-slate-800">
                  {completionRate}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Active Today</span>
                <span className="font-bold text-slate-800">
                  {appointments.confirmed || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Recent Doctors
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {doctors.length} total
              </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {doctors.slice(0, 5).map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-zinc-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-zinc-200">
                      <span className="text-slate-600 text-xs font-semibold">
                        {doctor.user?.name?.charAt(0) || "D"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {doctor.user?.name || "N/A"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {doctor.specialization || "General"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      doctor.status === "approved"
                        ? "bg-slate-100 text-slate-700 border-zinc-200"
                        : "bg-slate-50 text-slate-500 border-zinc-200"
                    } capitalize`}>
                    {doctor.status}
                  </span>
                </div>
              ))}
              {doctors.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-8">
                  No doctors found
                </p>
              )}
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Recent Patients
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {patients.length} total
              </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {patients.slice(0, 5).map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-zinc-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-zinc-200">
                      <span className="text-slate-600 text-xs font-semibold">
                        {patient.user?.name?.charAt(0) || "P"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {patient.user?.name || "N/A"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {patient.user?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {patients.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-8">
                  No patients found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
