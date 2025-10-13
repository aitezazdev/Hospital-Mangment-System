import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  todayAppointments,
  getComingWeekAppointments,
  todayREvenue,
  thisWeekRevenue,
} from "../../apis/appointment";
import { getMe } from "../../apis/auth";
import { setUser } from "../../redux/slices/auth";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [todatAppointments, setTodayAppointments] = useState([]);
  const [todatApprovedAppointments, setTodayApprovedAppointments] = useState([]);
  const [todatPendingAppointments, setTodayPendingAppointments] = useState([]);
  const [weeklyAssignments, setWeeklyAssignments] = useState([]);
  const [weeklyApprovedAppointments, setWeeklyApprovedAppointments] = useState([]);
  const [weeklyPendingAppointments, setWeeklyPendingAppointments] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const dispatch = useDispatch();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchTodayAppointments = async () => {
    try {
      const data = await todayAppointments();
      setTodayAppointments(data.appointments || []);
      setTodayApprovedAppointments(data.approvedAppointments || []);
      setTodayPendingAppointments(data.pendingAppointments || []);
    } catch (error) {
      setError(error.message || "something went wrong");
    }
  };

  const fetchWeeklyAssignments = async () => {
    try {
      const data = await getComingWeekAppointments();
      setWeeklyAssignments(data.appointments || []);
      setWeeklyApprovedAppointments(data.approvedAppointments || []);
      setWeeklyPendingAppointments(data.pendingAppointments || []);
    } catch (error) {
      setError(error.message || "something went wrong");
    }
  };

  const fetchTodatRevenue = async () => {
    try {
      const data = await todayREvenue();
      setTodayRevenue(data.totalRevenue || 0);
    } catch (error) {
      setError(error.message || "something went wrong");
    }
  };

  const fetchThisWeekRevenue = async () => {
    try {
      const data = await thisWeekRevenue();
      setWeekRevenue(data.totalRevenue);
    } catch (error) {
      setError(error.message || "something went wrong");
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
    fetchWeeklyAssignments();
    fetchTodatRevenue();
    fetchThisWeekRevenue();
  }, []);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const freshUser = await getMe();
        dispatch(setUser(freshUser));
      } catch (err) {
        console.error("Failed to refresh user", err);
      }
    };
    refreshUser();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!user?.isApproved ? (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Account Pending Approval
          </h2>
          <p className="text-gray-600">
            Your account is not approved yet. Please wait for approval from our team.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="bg-emerald-600 rounded-xl shadow-md p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Doctor Dashboard
                </h1>
                <p className="text-white font-semibold">{today}</p>
              </div>
              <div
                className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg ${
                  user.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.isApproved ? "Profile Approved" : "Profile Pending Approval"}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Today's Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Total Appointments</h3>
                    <p className="text-4xl font-bold text-emerald-600 mb-1">
                      {todatAppointments.length}
                    </p>
                    <p className="text-sm text-gray-500">Scheduled for today</p>
                  </>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Approved</h3>
                    <p className="text-4xl font-bold text-green-600 mb-1">
                      {todatApprovedAppointments.length}
                    </p>
                    <p className="text-sm text-gray-500">Confirmed appointments</p>
                  </>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Pending</h3>
                    <p className="text-4xl font-bold text-orange-600 mb-1">
                      {todatPendingAppointments.length}
                    </p>
                    <p className="text-sm text-gray-500">Awaiting confirmation</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Total Appointments</h3>
                <p className="text-4xl font-bold text-emerald-600 mb-1">
                  {weeklyAssignments.length}
                </p>
                <p className="text-sm text-gray-500">This week</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Approved</h3>
                <p className="text-4xl font-bold text-green-600 mb-1">
                  {weeklyApprovedAppointments.length}
                </p>
                <p className="text-sm text-gray-500">Weekly confirmed</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Pending</h3>
                <p className="text-4xl font-bold text-orange-600 mb-1">
                  {weeklyPendingAppointments.length}
                </p>
                <p className="text-sm text-gray-500">Weekly pending</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Revenue Estimates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Today's Revenue</h3>
                <p className="text-3xl font-bold text-emerald-600 mb-1">
                  Rs {todayRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Estimated earnings</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Weekly Revenue</h3>
                <p className="text-3xl font-bold text-emerald-600 mb-1">
                  Rs {weekRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">This week's earnings</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
