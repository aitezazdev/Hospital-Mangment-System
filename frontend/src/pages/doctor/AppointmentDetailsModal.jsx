import React, { useState, useEffect } from "react";
import { Modal, Button, Descriptions, Input, message } from "antd";
import api from "../../apis/axios";
import { prescribeMedicines } from "../../apis/appointment";
import { Sparkles } from "lucide-react";

const AppointmentDetailsModal = ({
  visible,
  onClose,
  appointment,
  mode = "doctor",
  onApprove,
  onCancel,
  onComplete,
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (appointment) {
      setMedicines(appointment.prescriptionMedicines || "");
      setNotes(appointment.prescriptionNotes || "");
      setIsEditing(false);
    }
  }, [appointment, visible]);

  if (!appointment) return null;

  const handleAiRecommend = async () => {
    setAiLoading(true);
    try {
      const historyStr = appointment.patient?.medicalHistory?.join(", ") || "";
      const res = await api.post("/ai/recommend-medicines", {
        symptoms: appointment.reason,
        history: historyStr,
      });
      if (res.data?.success) {
        setMedicines(res.data.recommendation);
        message.success("AI suggested prescription generated!");
      }
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to generate AI recommendations"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSavePrescription = async () => {
    setSaving(true);
    try {
      const res = await prescribeMedicines(appointment._id, {
        prescriptionMedicines: medicines,
        prescriptionNotes: notes,
      });
      if (res?.success) {
        message.success("Prescription saved successfully");
        appointment.prescriptionMedicines = medicines;
        appointment.prescriptionNotes = notes;
        setIsEditing(false);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      message.error(err.message || "Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <h2 className="text-xl font-bold text-teal-700">
          Appointment Details
        </h2>
      }
    >
      <Descriptions
        bordered
        column={1}
        size="small"
        className="rounded-lg overflow-hidden"
        styles={{
          label: { fontWeight: 600, color: "#0f766e" },
        }}
      >
        {(mode === "doctor" || mode === "admin") && (
          <>
            <Descriptions.Item label="Patient">
              {appointment.patient?.user?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {appointment.patient?.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {appointment.patient?.user?.phone}
            </Descriptions.Item>
          </>
        )}

        {(mode === "patient" || mode === "admin") && (
          <>
            <Descriptions.Item label="Doctor">
              {appointment.doctor?.user?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Specialization">
              {appointment.doctor?.specialization || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Experience">
              {appointment.doctor?.experience
                ? `${appointment.doctor.experience} years`
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Fees">
              {appointment.doctor?.consultationFee
                ? `Rs. ${appointment.doctor.consultationFee}`
                : "Not specified"}
            </Descriptions.Item>
          </>
        )}

        <Descriptions.Item label="Reason">
          {appointment.reason}
        </Descriptions.Item>
        <Descriptions.Item label="Booking Date Requested">
          {new Date(appointment.date).toDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Slot">
          {appointment.startTime} - {appointment.endTime}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              appointment.status === "pending"
                ? "bg-orange-100 text-orange-700 border-orange-300"
                : appointment.status === "confirmed"
                ? "bg-green-100 text-green-700 border-green-300"
                : appointment.status === "completed"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {appointment.status}
          </span>
        </Descriptions.Item>
      </Descriptions>

      {/* Prescription management section */}
      {isEditing ? (
        <div className="mt-6 border-t border-slate-100 pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-teal-700">Write Prescription</h3>
            <Button
              type="dashed"
              size="small"
              loading={aiLoading}
              onClick={handleAiRecommend}
              className="text-xs flex items-center gap-1.5 border-teal-500 text-teal-700 hover:text-teal-800"
            >
              <Sparkles className="w-3.5 h-3.5" /> Suggest with AI
            </Button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Prescribed Medicines
            </label>
            <Input.TextArea
              rows={4}
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              placeholder="Enter medicines (e.g. Paracetamol 500mg - 1 tablet twice daily)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Instructions & Clinical Notes
            </label>
            <Input.TextArea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical tips (e.g. Avoid cold drinks, take plenty of bed rest)"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={saving}
              onClick={handleSavePrescription}
              className="bg-teal-600 border-none hover:bg-teal-700"
            >
              Save Prescription
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-teal-700">Prescription</h3>
            {mode === "doctor" &&
              (appointment.status === "confirmed" ||
                appointment.status === "completed") && (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => setIsEditing(true)}
                  className="bg-teal-600 border-none hover:bg-teal-700 font-semibold"
                >
                  Write / Edit
                </Button>
              )}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recommended Medicines
              </p>
              <p className="text-sm text-slate-800 font-semibold whitespace-pre-line mt-1">
                {appointment.prescriptionMedicines || "No medicines prescribed yet."}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instructions & Notes
              </p>
              <p className="text-sm text-slate-800 font-semibold whitespace-pre-line mt-1">
                {appointment.prescriptionNotes || "No additional instructions provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {mode === "doctor" && !isEditing && (
        <div className="flex justify-end gap-2 mt-6">
          {appointment.status === "pending" && (
            <Button
              type="primary"
              className="bg-teal-600 hover:bg-teal-700 border-none"
              onClick={() => {
                onApprove(appointment._id);
                onClose();
              }}
            >
              Approve
            </Button>
          )}
          {(appointment.status === "pending" ||
            appointment.status === "confirmed") && (
            <Button
              danger
              className="bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={() => {
                onCancel(appointment._id);
                onClose();
              }}
            >
              Cancel
            </Button>
          )}
          {appointment.status === "confirmed" && (
            <Button
              type="default"
              className="bg-blue-500 hover:bg-blue-600 text-white border-none font-semibold"
              onClick={() => {
                onComplete(appointment._id);
                onClose();
              }}
            >
              Mark Completed
            </Button>
          )}
          {appointment.status === "cancelled" && (
            <Button
              type="primary"
              className="bg-teal-600 hover:bg-teal-700 border-none"
              onClick={() => {
                onApprove(appointment._id);
                onClose();
              }}
            >
              Re-Approve
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AppointmentDetailsModal;
