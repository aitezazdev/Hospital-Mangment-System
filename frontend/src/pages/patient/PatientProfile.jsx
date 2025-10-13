import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfileByEmail, updatePersonalInfo } from "../../apis/user";
import { updateProfessionalInfo } from "../../apis/patient";
import { logout } from "../../redux/slices/auth";
import { setPatientProfile } from "../../redux/slices/patientProfile";

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
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/signin");
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
        medicalHistory: patientProfile.medicalHistory || [],
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-emerald-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-emerald-600 text-white rounded-xl shadow-lg p-8 mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Profile</h1>
            <p className="text-emerald-100 text-sm">
              Manage your personal and medical details
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-400 text-white hover:bg-red-500 cursor-pointer font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-md">
            Logout
          </button>
        </div>

        {profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {!isEditingPersonal ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Personal Information
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Name:</strong> {profile.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {profile.phone}
                    </p>
                    <p>
                      <strong>Role:</strong> {profile.role}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Edit Personal Information
                  </h2>
                  <input
                    type="text"
                    name="name"
                    value={personalForm.name}
                    onChange={handlePersonalChange}
                    className="w-full mb-4 px-3 py-2 border rounded-lg"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={personalForm.email}
                    onChange={handlePersonalChange}
                    className="w-full mb-4 px-3 py-2 border rounded-lg"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={personalForm.phone}
                    onChange={handlePersonalChange}
                    className="w-full mb-4 px-3 py-2 border rounded-lg"
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    name="role"
                    value={personalForm.role}
                    readOnly
                    className="w-full mb-4 px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={handleSavePersonal}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingPersonal(false)}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!isEditingPatient ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Patient Information
                  </h2>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Gender:</strong> {patientProfile?.gender || "N/A"}
                    </p>
                    <p>
                      <strong>Age:</strong> {patientProfile?.age || "N/A"} years
                    </p>
                    <p>
                      <strong>Address:</strong> {patientProfile?.address || "N/A"}
                    </p>
                    <p>
                      <strong>Medical History:</strong>{" "}
                      {patientProfile?.medicalHistory?.length > 0
                        ? patientProfile.medicalHistory.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Edit Patient Information
                  </h2>
                  <select
                    name="gender"
                    value={patientForm.gender}
                    onChange={handlePatientChange}
                    className="w-full mb-4 px-3 py-2 border rounded-lg">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <input
                    type="number"
                    name="age"
                    value={patientForm.age}
                    onChange={handlePatientChange}
                    className="w-full mb-4 px-3 py-2 border rounded-lg"
                    placeholder="Age"
                    min="0"
                    max="150"
                  />
                  <textarea
                    name="address"
                    value={patientForm.address}
                    onChange={handlePatientChange}
                    className="w-full mb-4 px-3 py-2 border rounded-lg"
                    placeholder="Address"
                  />
                  <textarea
                    name="medicalHistory"
                    value={patientForm.medicalHistory}
                    onChange={handlePatientChange}
                    className="w-full mb-4 px-3 py-2 border rounded-lg"
                    placeholder="Enter medical history (comma separated)"
                  />
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={handleSavePatient}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingPatient(false)}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-emerald-700">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {profile.name}
                </h3>
                <p className="text-gray-600 mb-4">{patientProfile?.gender || "Not specified"}</p>
                <p className="text-sm text-gray-500">
                  Member Since
                  <span className="font-semibold"> {new Date(profile.createdAt).toLocaleDateString("en-GB")}</span>
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Profile Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => editingPersonalInfo()}
                    className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md">
                    Edit Personal Info
                  </button>
                  <button
                    onClick={() => editingPatientInfo()}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md">
                    Edit Patient Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No profile found</p>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;