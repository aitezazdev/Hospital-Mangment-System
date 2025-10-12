import React, { useState } from "react";
import { FaUserMd, FaMapMarkerAlt } from "react-icons/fa";
import { RiGenderlessLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { createPatientProfile } from "../../apis/patient";

const PatientCreateProfile = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    address: "",
    medicalHistory: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" && value < 0) return;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (formData.age && (formData.age < 1 || formData.age > 120))
      newErrors.age = "Please enter a valid age";
    if (!formData.address) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const response = await createPatientProfile(formData);
      setMessage(response.message);
      navigate("/patient/dashboard");
    } catch (error) {
      setMessage(error.message || "Error submitting profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 my-0.5">
            Patient Profile
          </h2>
          <p className="text-gray-500 font-bold">
            Fill in your details to complete your profile.
          </p>
        </div>

        {message && (
          <div className="bg-red-100 text-red-600 border border-red-400 rounded p-2 mb-4 text-sm text-center">
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <div className="flex items-center border-b-2 border-emerald-400 focus-within:border-emerald-500 px-3 py-2">
              <RiGenderlessLine className="text-gray-400 text-lg mr-2" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full outline-none text-gray-700 bg-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="text-gray-600 px-3 font-bold block">Age</label>
            <div className="flex items-center border-b-2 border-emerald-400 focus-within:border-emerald-500 px-3 py-2">
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                className="w-full outline-none text-gray-700"
              />
            </div>
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          <div>
            <div className="flex items-center border-b-2 border-emerald-400 focus-within:border-emerald-500 px-3 py-2">
              <FaMapMarkerAlt className="text-gray-400 text-lg mr-2" />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full outline-none text-gray-700"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <div className="flex items-start border-b-2 border-emerald-400 focus-within:border-emerald-500 px-3 py-2">
              <FaUserMd className="text-gray-400 text-lg mr-2 mt-2" />
              <textarea
                name="medicalHistory"
                placeholder="Medical History (optional)"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="w-full outline-none text-gray-700 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold shadow-md ${
              loading && "bg-emerald-300"
            }`}
          >
            {loading ? "Submitting..." : "Submit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientCreateProfile;
