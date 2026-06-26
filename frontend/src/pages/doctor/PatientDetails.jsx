import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowLeft, Calendar, Sparkles, Activity } from "lucide-react";
import { getPatientByID } from "../../apis/patient";
import api from "../../apis/axios";
import toast from "react-hot-toast";

// Simple inline assistant icon component — must be defined BEFORE PatientDetails (const is not hoisted)
const BotIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AI summary states
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getPatientByID(id);
        setPatient(res.patient);
      } catch (err) {
        console.error("Error fetching patient details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleGenerateSummary = async () => {
    if (!patient) return;
    setLoadingSummary(true);
    // Only clear previous summary AFTER we have a new one — don't clear on request start

    const lastAppointmentReason = patient.appointmentHistory?.[0]?.reason || "No recent appointments";

    try {
      const response = await api.post("/ai/clinical-summary", {
        patientHistory: patient.medicalHistory || [],
        reason: lastAppointmentReason,
      });

      if (response.data.success) {
        setAiSummary(response.data.summary);
        toast.success("AI clinical summary generated successfully!");
      } else {
        toast.error("Failed to generate AI summary");
      }
    } catch (error) {
      console.error("Clinical summary generation error:", error);
      toast.error(error.response?.data?.message || "Could not generate clinical summary");
      setAiSummary("⚠️ Error generating summary. Make sure the Gemini API key is configured on the backend.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-8 gap-4">

        <div>
          <h1 className="text-3xl font-black mb-1">
            {patient.name}
          </h1>
          <p className="text-slate-300 text-sm">
            {calculateAge(patient.dateOfBirth)} yrs &bull; {patient.gender?.toUpperCase()}
          </p>
        
      </div>
        <Link
          to="/doctor/patients"
          className="flex items-center gap-2 text-sm bg-white hover:bg-slate-100 text-slate-900 font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Link>
      </div>

      {/* AI Clinical Summary Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/5 to-transparent rounded-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-black text-slate-900">AI Clinical Assistant</h2>
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={loadingSummary}
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md transition-all cursor-pointer ${
              loadingSummary && "opacity-75 cursor-not-allowed"
            }`}
          >
            {loadingSummary ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Summarizing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Generate AI Summary
              </>
            )}
          </button>
        </div>

        {aiSummary ? (
          <div className="bg-slate-950 text-slate-200 border border-slate-900 rounded-xl p-5 font-medium text-sm leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold uppercase text-xs tracking-wider">
              <BotIcon className="w-3.5 h-3.5" /> Gemini Clinical Summary
            </div>
            <p className="font-mono text-[13px]">{aiSummary}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">
            Click the button to scan history and summarize this patient's clinical state automatically.
          </p>
        )}
      </div>

      {/* Patient Information Panel */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-8">
        <h2 className="text-lg font-black mb-4 text-slate-900">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-slate-600">
            <p className="flex items-center gap-3">
              <Mail className="h-4.5 w-4.5 text-slate-400 shrink-0" /> {patient.email}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4.5 w-4.5 text-slate-400 shrink-0" /> {patient.phone}
            </p>
            {patient.address && (
              <p className="flex items-center gap-3">
                <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" /> {patient.address}
              </p>
            )}
          </div>
          <div className="text-slate-600 space-y-3">
            <p>Gender: <span className="font-bold text-slate-800 capitalize">{patient.gender}</span></p>
            <p>
              DOB:{" "}
              <span className="font-bold text-slate-800">
                {patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </p>
            <p>Total Visits: <span className="font-bold text-slate-800">{patient.totalVisits || 0}</span></p>
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-slate-100 mb-8">
        <h2 className="text-lg font-black mb-4 text-slate-900">Medical History</h2>
        {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {patient.medicalHistory.map((item, idx) => (
              <span
                key={idx}
                className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No medical history recorded for this patient.</p>
        )}
      </div>

      {/* Appointment History Panel */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-slate-100">
        <h2 className="text-lg font-black mb-4 text-slate-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" /> Appointment History
        </h2>
        {patient.appointmentHistory?.length > 0 ? (
          <div className="space-y-4">
            {patient.appointmentHistory.map((appt, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-xl p-5 border border-slate-150 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-800">
                    {new Date(appt.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`text-xs capitalize px-3.5 py-1.5 rounded-full font-bold shadow-sm ${getStatusColor(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                </div>
                <p className="text-sm text-slate-700 font-medium mb-1"><span className="text-slate-400 text-xs uppercase font-bold block mb-0.5">Reason</span> {appt.reason}</p>
                <p className="text-xs text-slate-400 font-semibold mt-2">
                  Scheduled Time: {appt.startTime} - {appt.endTime}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No appointments yet</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
