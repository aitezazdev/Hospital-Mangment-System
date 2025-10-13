import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { nextAppointments } from "../../apis/patient";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchUpComingThreeAppointments = async () => {
    try {
      const res = await nextAppointments();
      if (res.success) {
        setAppointments(res.nextAppointments || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpComingThreeAppointments();
  }, [user]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-xl p-8 mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
              Patient Dashboard
            </h1>
            <p className="text-emerald-100 text-lg">
              Manage Your Appointments and Profile Here
            </p>
          </div>
          <div className="bg-white bg-opacity-20 text-white rounded-lg px-5 py-3 mt-6 sm:mt-0">
            <p className="text-sm text-black opacity-90">Today</p>
            <p className="font-semibold text-black">{today}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : appointments.length > 0 ? (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg mr-3"></div>
            Upcoming Appointments
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-zinc-200 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6">
                <div className="mb-4 border-b pb-3">
                  <h3 className="text-lg font-bold text-emerald-600">
                    {appt.doctor?.user?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appt.doctor?.user?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appt.doctor?.user?.phone}
                  </p>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Date: </span>
                    {new Date(appt.date).toLocaleDateString("en-GB")}
                  </p>

                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {appt.startTime} - {appt.endTime}
                  </p>
                  <p>
                    <span className="font-semibold">Reason:</span> {appt.reason}
                  </p>
                  <p>
                    <span className="font-semibold">Fee:</span> Rs.{" "}
                    {appt.doctor?.consultationFee}
                  </p>
                </div>
                <div
                  className={`mt-4 inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    appt.status === "confirmed"
                      ? "bg-emerald-200 text-emerald-700"
                      : appt.status === "pending"
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-red-200 text-red-700"
                  }`}>
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-gray-600">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"></div>
          <p className="text-lg font-medium">No upcoming appointments found</p>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
