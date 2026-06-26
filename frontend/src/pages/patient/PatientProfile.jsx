import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfileByEmail, updatePersonalInfo } from "../../apis/user";
import { updateProfessionalInfo } from "../../apis/patient";
import { logout } from "../../redux/slices/auth";
import { setPatientProfile } from "../../redux/slices/patientProfile";
import { User, Mail, Phone, Shield, Edit, Heart, AlertCircle, LogOut } from "lucide-react";

const PatientProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const patientProfile = useSelector((state) => state.patientProfile.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientForm, setPatientForm] = useState({
    gender: "",
    age: "",
    address: "",
    medicalHistory: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user?.email) {
          const profileData = await fetchUserProfileByEmail(user.email);
          setProfile(profileData.user);

          if (profileData.patientProfile) {
            dispatch(setPatientProfile(profileData.patientProfile));
            setPatientForm({
              gender: profileData.patientProfile.gender || "",
              age: profileData.patientProfile.age || "",
              address: profileData.patientProfile.address || "",
              medicalHistory: (
                profileData.patientProfile.medicalHistory || []
              ).join(", "),
            });
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user?.email, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/signin", { replace: true });
  };

  const editingPersonalInfo = () => {
    setPersonalForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
    });
    setIsEditingPersonal(true);
  };

  const handlePersonalChange = (e) => {
    setPersonalForm({ ...personalForm, [e.target.name]: e.target.value });
  };

  const handleSavePersonal = async () => {
    try {
      const updated = await updatePersonalInfo(profile._id, personalForm);
      setProfile(updated.user);
      setIsEditingPersonal(false);
    } catch (err) {
      setError(err.message || "Failed to update personal profile info");
    }
  };

  const editingPatientInfo = () => {
    if (patientProfile) {
      setPatientForm({
        gender: patientProfile.gender || "",
        age: patientProfile.age || "",
        address: patientProfile.address || "",
        medicalHistory: (patientProfile.medicalHistory || []).join(", "),
      });
    }
    setIsEditingPatient(true);
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      const numValue = value === "" ? "" : parseInt(value, 10);
      setPatientForm({ ...patientForm, [name]: numValue });
    } else {
      setPatientForm({ ...patientForm, [name]: value });
    }
  };

  const handleSavePatient = async () => {
    try {
      const updated = await updateProfessionalInfo(profile._id, {
        ...patientForm,
        age: parseInt(patientForm.age, 10) || 0,
        medicalHistory: patientForm.medicalHistory
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      });

      setProfile(updated.user);
      dispatch(setPatientProfile(updated.patient));

      setPatientForm({
        gender: updated.patient.gender || "",
        age: updated.patient.age || "",
        address: updated.patient.address || "",
        medicalHistory: (updated.patient.medicalHistory || []).join(", "),
      });

      setIsEditingPatient(false);
    } catch (err) {
      setError(err.message || "Failed to update patient profile info");
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-sm w-full text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-teal-600 mx-auto mb-4 border-t-transparent"></div>
          <p className="text-teal-600 font-semibold text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 border-l-4 border-red-500 max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-semibold text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-2xl shadow-xl p-8 border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Patient Profile</h1>
            <p className="text-teal-100/80 text-base sm:text-lg font-medium">
              Manage your personal credentials and medical records.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-colors shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Session
          </button>
        </div>
      </div>

      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Side Details Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-3xl font-extrabold mb-4 border border-teal-100 shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : "P"}
              </div>
              <h2 className="text-lg font-bold text-slate-800">{profile.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>
              
              <div className="w-full border-t border-slate-100 mt-6 pt-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Account Role</span>
                  <span className="bg-teal-50 text-teal-700 px-2 py-0.5 font-bold uppercase tracking-wider rounded-md border border-teal-100 text-[10px]">
                    {profile.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Registered Phone</span>
                  <span>{profile.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Col-Span 2): Detailed Profile Sections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Personal Information */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Personal Information
                </h3>
                {!isEditingPersonal && (
                  <button
                    onClick={editingPersonalInfo}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 border border-teal-200 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>

              {!isEditingPersonal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-semibold text-slate-800 mt-1 block">{profile.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-semibold text-slate-800 mt-1 block">{profile.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    <span className="text-sm font-semibold text-slate-800 mt-1 block">{profile.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Role Type</span>
                    <span className="text-sm font-semibold text-slate-800 mt-1 block capitalize">{profile.role}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={personalForm.name}
                        onChange={handlePersonalChange}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={personalForm.email}
                        onChange={handlePersonalChange}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={personalForm.phone}
                        onChange={handlePersonalChange}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                        placeholder="Phone"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Role Type</label>
                      <input
                        type="text"
                        name="role"
                        value={personalForm.role}
                        readOnly
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleSavePersonal}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingPersonal(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Patient Profile Information */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  Clinical & Medical Profile
                </h3>
                {!isEditingPatient && (
                  <button
                    onClick={editingPatientInfo}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 border border-teal-200 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>

              {!isEditingPatient ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gender</span>
                    <span className="text-sm font-semibold text-slate-800 mt-1 block capitalize">{patientProfile?.gender || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age</span>
                    <span className="text-sm font-semibold text-slate-800 mt-1 block">
                      {patientProfile?.age ? `${patientProfile.age} years` : "N/A"}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Address</span>
                    <span className="text-sm font-semibold text-slate-800 mt-1 block leading-relaxed">{patientProfile?.address || "N/A"}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medical History</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {patientProfile?.medicalHistory?.length > 0 ? (
                        patientProfile.medicalHistory.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-teal-50/50 text-teal-700 border border-teal-100 px-2.5 py-1 text-xs font-semibold rounded-lg"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400 italic">No medical history recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Gender</label>
                      <select
                        name="gender"
                        value={patientForm.gender}
                        onChange={handlePatientChange}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white transition-shadow"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={patientForm.age}
                        onChange={handlePatientChange}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                        placeholder="Age"
                        min="0"
                        max="150"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Current Address</label>
                      <textarea
                        name="address"
                        value={patientForm.address}
                        onChange={handlePatientChange}
                        rows={2}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                        placeholder="Address"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                        Medical History (comma separated)
                      </label>
                      <textarea
                        name="medicalHistory"
                        value={patientForm.medicalHistory}
                        onChange={handlePatientChange}
                        rows={2}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                        placeholder="Enter medical conditions separated by commas (e.g., Asthma, Diabetes)"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleSavePatient}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingPatient(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default PatientProfile;