import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfileByEmail, updatePersonalInfo } from "../../apis/user";
import { updateProfessionalInfo } from "../../apis/doctor";
import { logout } from "../../redux/slices/auth";
import { setDoctorProfile } from "../../redux/slices/doctorProfile";
import { LogOut } from "lucide-react";

const DoctorProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const doctorProfile = useSelector((state) => state.doctorProfile.profile);
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

  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [professionalForm, setProfessionalForm] = useState({
    specialization: "",
    experience: "",
    consultationFee: "",
    clinicAddress: "",
    daysOff: [],
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user?.email) {
          const profileData = await fetchUserProfileByEmail(user.email);
          setProfile(profileData.user);

          if (profileData.doctorProfile) {
            dispatch(setDoctorProfile(profileData.doctorProfile));
            setProfessionalForm({
              specialization: profileData.doctorProfile.specialization || "",
              experience: profileData.doctorProfile.experience || "",
              consultationFee: profileData.doctorProfile.consultationFee || "",
              clinicAddress: profileData.doctorProfile.clinicAddress || "",
              daysOff: profileData.doctorProfile.daysOff || [],
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

  const editingProfessionalInfo = () => {
    if (doctorProfile) {
      setProfessionalForm({
        specialization: doctorProfile.specialization || "",
        experience: doctorProfile.experience || "",
        consultationFee: doctorProfile.consultationFee || "",
        clinicAddress: doctorProfile.clinicAddress || "",
        daysOff: doctorProfile.daysOff || [],
      });
    }
    setIsEditingProfessional(true);
  };

  const handleProfessionalChange = (e) => {
    setProfessionalForm({
      ...professionalForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDaysOffChange = (day) => {
    const currentDays = [...professionalForm.daysOff];
    const index = currentDays.indexOf(day);
    if (index > -1) {
      currentDays.splice(index, 1);
    } else {
      currentDays.push(day);
    }
    setProfessionalForm({ ...professionalForm, daysOff: currentDays });
  };

  const handleSaveProfessional = async () => {
    try {
      const updated = await updateProfessionalInfo(profile._id, professionalForm);
      setProfile(updated.user);
      dispatch(setDoctorProfile(updated.doctor));
      setIsEditingProfessional(false);
    } catch (err) {
      setError(err.message || "Failed to update professional info");
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-sm w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-teal-600 mx-auto mb-4 border-t-transparent"></div>
          <p className="text-slate-500 text-xs font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border border-slate-100 border-l-4 border-red-500 max-w-md text-center shadow-sm">
          <p className="text-red-600 font-semibold text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your professional information and settings</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-750 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout Session
        </button>
      </div>

      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {}
          <div className="lg:col-span-2 space-y-6">
            
            {}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h2 className="text-base font-bold text-slate-800">
                  Personal Information
                </h2>
                {!isEditingPersonal && (
                  <button
                    onClick={editingPersonalInfo}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 border border-slate-200 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {!isEditingPersonal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-xs font-semibold text-slate-800 mt-1 block">{profile.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <span className="text-xs font-semibold text-slate-800 mt-1 block">{profile.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    <span className="text-xs font-semibold text-slate-800 mt-1 block">{profile.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Role</span>
                    <span className="text-xs font-semibold text-slate-800 mt-1 block capitalize">{profile.role}</span>
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={personalForm.email}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={personalForm.phone}
                        onChange={handlePersonalChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Account Role</label>
                      <input
                        type="text"
                        name="role"
                        value={personalForm.role}
                        readOnly
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleSavePersonal}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingPersonal(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h2 className="text-base font-bold text-slate-800">
                  Professional Information
                </h2>
                {!isEditingProfessional && doctorProfile && (
                  <button
                    onClick={editingProfessionalInfo}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 border border-slate-200 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {!isEditingProfessional ? (
                doctorProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialization</span>
                        <span className="text-xs font-semibold text-slate-800 mt-1 block">{doctorProfile.specialization}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                        <span className="text-xs font-semibold text-slate-800 mt-1 block">{doctorProfile.experience} years</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
                        <span className="text-xs font-semibold text-slate-800 mt-1 block">Rs {doctorProfile.consultationFee?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification Status</span>
                        <span className="mt-1 inline-block">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            doctorProfile.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : doctorProfile.status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {doctorProfile.status}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinic Address</span>
                      <span className="text-xs font-semibold text-slate-800 mt-1 block leading-relaxed">{doctorProfile.clinicAddress}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No professional records found</p>
                )
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Specialization</label>
                      <input
                        type="text"
                        name="specialization"
                        value={professionalForm.specialization}
                        onChange={handleProfessionalChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Specialization"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={professionalForm.experience}
                        onChange={handleProfessionalChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Experience in years"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Consultation Fee</label>
                      <input
                        type="number"
                        name="consultationFee"
                        value={professionalForm.consultationFee}
                        onChange={handleProfessionalChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Consultation Fee"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 block mb-1.5">Clinic Address</label>
                      <textarea
                        name="clinicAddress"
                        value={professionalForm.clinicAddress}
                        onChange={handleProfessionalChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Clinic Address"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <label className="text-xs font-bold text-slate-700 block mb-2">Days Off</label>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((day) => (
                        <label key={day} className="inline-flex items-center text-xs text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={professionalForm.daysOff.includes(day)}
                            onChange={() => handleDaysOffChange(day)}
                            className="mr-1.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleSaveProfessional}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingProfessional(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-slate-100 text-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "D"}
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Dr. {profile.name}
              </h3>
              {doctorProfile && (
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {doctorProfile.specialization || "Physician"}
                </p>
              )}

              <div className="w-full border-t border-slate-100 mt-6 pt-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Profile Status</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                    doctorProfile?.isApproved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {doctorProfile?.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Account Type</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[9px] font-bold uppercase tracking-wider">
                    Doctor
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Experience</span>
                  <span>{doctorProfile?.experience || 0} years</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Consultation Fee</span>
                  <span>Rs {doctorProfile?.consultationFee || 0}</span>
                </div>
              </div>
            </div>

            {}
            {doctorProfile?.daysOff && doctorProfile.daysOff.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Days Off
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {doctorProfile.daysOff.map((day, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded text-xs font-semibold"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
