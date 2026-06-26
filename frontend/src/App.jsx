import React, { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { setDoctorProfile } from "./redux/slices/doctorProfile";
import { setPatientProfile } from "./redux/slices/patientProfile";
import { fetchUserProfileByEmail } from "./apis/user";


import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";


const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ApproveDoctors = lazy(() => import("./pages/admin/ApproveDoctors"));
const AllAppointments = lazy(() => import("./pages/admin/AllAppointments"));
const AllDoctors = lazy(() => import("./pages/admin/AllDoctors"));
const AllPatients = lazy(() => import("./pages/admin/AllPatients"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));

const DoctorLayout = lazy(() => import("./layouts/DoctorLayout"));
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));
const DoctorAppointments = lazy(() => import("./pages/doctor/DoctorAppointments"));
const DoctorPatients = lazy(() => import("./pages/doctor/DoctorPatients"));
const PatientDetails = lazy(() => import("./pages/doctor/PatientDetails"));
const DoctorAvailability = lazy(() => import("./pages/doctor/DoctorAvailability"));
const DoctorProfile = lazy(() => import("./pages/doctor/DoctorProfile"));
const DoctorCreateProfile = lazy(() => import("./pages/doctor/DoctorCreateProfile"));

const PatientLayout = lazy(() => import("./layouts/PatientLayout"));
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientAppointments = lazy(() => import("./pages/patient/PatientAppointments"));
const PatientFindDoctors = lazy(() => import("./pages/patient/PatientFindDoctors"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile"));
const PatientCreateProfile = lazy(() => import("./pages/patient/PatientCreateProfile"));
const AiAssistant = lazy(() => import("./pages/patient/AiAssistant"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const userEmail = user?.email || null;
  const userRole = user?.role || null;

  useEffect(() => {
    if (!userEmail) return; 

    let cancelled = false;
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfileByEmail(userEmail);
        if (cancelled) return;

        if (userRole === "doctor" && profileData?.doctorProfile) {
          dispatch(setDoctorProfile(profileData.doctorProfile));
        }

        if (userRole === "patient" && profileData?.patientProfile) {
          dispatch(setPatientProfile(profileData.patientProfile));
        }
      } catch (err) {
        if (!cancelled) console.error("Error loading profile:", err);
      }
    };

    loadProfile();
    return () => { cancelled = true; }; 
  }, [userEmail, userRole, dispatch]); 

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />

        {}
        <Route element={<ProtectedRoute role="doctor" />}>
          <Route
            path="/doctor/create-profile"
            element={<DoctorCreateProfile />}
          />
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/patients/:id" element={<PatientDetails />} />
            <Route path="/doctor/availability" element={<DoctorAvailability />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
          </Route>
        </Route>

        {}
        <Route element={<ProtectedRoute role="patient" />}>
          <Route
            path="/patient/create-profile"
            element={<PatientCreateProfile />}
          />
          <Route element={<PatientLayout />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient/appointments"
              element={<PatientAppointments />}
            />
            <Route
              path="/patient/find-doctors"
              element={<PatientFindDoctors />}
            />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/ai-assistant" element={<AiAssistant />} />
          </Route>
        </Route>

        {}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/approve-doctors" element={<ApproveDoctors />} />
            <Route path="/admin/all-appointments" element={<AllAppointments />} />
            <Route path="/admin/all-doctors" element={<AllDoctors />} />
            <Route path="/admin/all-patients" element={<AllPatients />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;

