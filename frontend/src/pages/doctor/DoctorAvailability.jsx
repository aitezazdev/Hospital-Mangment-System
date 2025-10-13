import React, { useState } from "react";
import { useSelector } from "react-redux";
import { updateProfessionalInfo } from "../../apis/doctor";

const DoctorAvailability = () => {
  const doctorProfile = useSelector((state) => state.doctorProfile.profile);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState({
    weeklySchedule: {
      Monday: { isActive: false, slots: [] },
      Tuesday: { isActive: false, slots: [] },
      Wednesday: { isActive: false, slots: [] },
      Thursday: { isActive: false, slots: [] },
      Friday: { isActive: false, slots: [] },
      Saturday: { isActive: false, slots: [] },
      Sunday: { isActive: false, slots: [] },
    },
    daysOff: [],
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatTimeTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const editingAvailability = () => {
    const weeklySchedule = {
      Monday: { isActive: false, slots: [] },
      Tuesday: { isActive: false, slots: [] },
      Wednesday: { isActive: false, slots: [] },
      Thursday: { isActive: false, slots: [] },
      Friday: { isActive: false, slots: [] },
      Saturday: { isActive: false, slots: [] },
      Sunday: { isActive: false, slots: [] },
    };
    if (doctorProfile.availability) {
      doctorProfile.availability.forEach((slot) => {
        if (weeklySchedule[slot.day]) {
          weeklySchedule[slot.day].isActive = true;
          weeklySchedule[slot.day].slots.push({
            startTime: slot.startTime,
            endTime: slot.endTime,
            maxPatientsPerDay: slot.maxPatientsPerDay || 10,
          });
        }
      });
    }
    setAvailabilityForm({
      weeklySchedule,
      daysOff: doctorProfile.daysOff || [],
    });
    setIsEditing(true);
  };

  const toggleDayActive = (day) => {
    setAvailabilityForm((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          isActive: !prev.weeklySchedule[day].isActive,
          slots: !prev.weeklySchedule[day].isActive
            ? prev.weeklySchedule[day].slots.length === 0
              ? [
                  {
                    startTime: "09:00",
                    endTime: "17:00",
                    maxPatientsPerDay: 10,
                  },
                ]
              : prev.weeklySchedule[day].slots
            : prev.weeklySchedule[day].slots,
        },
      },
    }));
  };

  const addTimeSlot = (day) => {
    setAvailabilityForm((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          slots: [
            ...prev.weeklySchedule[day].slots,
            { startTime: "09:00", endTime: "17:00", maxPatientsPerDay: 10 },
          ],
        },
      },
    }));
  };

  const removeTimeSlot = (day, slotIndex) => {
    setAvailabilityForm((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          slots: prev.weeklySchedule[day].slots.filter(
            (_, index) => index !== slotIndex
          ),
        },
      },
    }));
  };

  const updateTimeSlot = (day, slotIndex, field, value) => {
    setAvailabilityForm((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          slots: prev.weeklySchedule[day].slots.map((slot, index) =>
            index === slotIndex ? { ...slot, [field]: value } : slot
          ),
        },
      },
    }));
  };

  const handleDaysOffChange = (day) => {
    const newDaysOff = availabilityForm.daysOff.includes(day)
      ? availabilityForm.daysOff.filter((d) => d !== day)
      : [...availabilityForm.daysOff, day];
    setAvailabilityForm({ ...availabilityForm, daysOff: newDaysOff });
  };

  const handleSaveAvailability = async () => {
    try {
      const availability = [];
      Object.entries(availabilityForm.weeklySchedule).forEach(
        ([day, dayData]) => {
          if (dayData.isActive) {
            dayData.slots.forEach((slot) => {
              availability.push({
                day,
                startTime: slot.startTime,
                endTime: slot.endTime,
                maxPatientsPerDay: slot.maxPatientsPerDay,
              });
            });
          }
        }
      );
      const updateData = { availability, daysOff: availabilityForm.daysOff };
      await updateProfessionalInfo(doctorProfile._id, updateData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update availability info");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-emerald-600 text-white rounded-xl shadow-md p-8 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Doctor Availability</h1>
            <p className="opacity-90">
              Manage your weekly schedule and availability
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => editingAvailability()}
              className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-sm transition-all">
              Edit Availability
            </button>
          )}
        </div>

        {doctorProfile ? (
          <div className="space-y-8">
            {!isEditing ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  {doctorProfile?.availability?.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Weekly Schedule
                      </h2>
                      <div className="grid gap-4">
                        {daysOfWeek.map((day) => {
                          const daySlots = doctorProfile.availability.filter(
                            (slot) => slot.day === day
                          );
                          const isDayOff = doctorProfile.daysOff?.includes(day);
                          return (
                            <div
                              key={day}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="font-medium text-gray-800 w-24">
                                {day}
                              </div>
                              <div className="flex-1 ml-4">
                                {isDayOff ? (
                                  <span className="text-red-600 text-sm">
                                    Day Off - Not Available
                                  </span>
                                ) : daySlots.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {daySlots.map((slot, index) => (
                                      <div
                                        key={index}
                                        className="bg-white border border-gray-200 px-3 py-1 rounded-md text-sm">
                                        {formatTimeTo12Hour(slot.startTime)} -{" "}
                                        {formatTimeTo12Hour(slot.endTime)}
                                        <span className="text-gray-500 ml-2">
                                          (Max {slot.maxPatientsPerDay})
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm italic">
                                    Not available
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No Schedule Set
                      </h3>
                      <p className="text-gray-600">
                        Click "Edit Availability" to set your weekly schedule.
                      </p>
                    </div>
                  )}
                  {doctorProfile?.daysOff?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Days Off
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {doctorProfile.daysOff.map((day, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Active Days</span>
                        <span>
                          {doctorProfile?.availability?.reduce((acc, s) => {
                            if (!acc.includes(s.day)) acc.push(s.day);
                            return acc;
                          }, [])?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Total Slots</span>
                        <span>{doctorProfile?.availability?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Days Off</span>
                        <span>{doctorProfile?.daysOff?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Edit Weekly Schedule
                  </h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveAvailability}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition">
                      Save Schedule
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition">
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`day-${day}`}
                            checked={
                              availabilityForm.weeklySchedule[day].isActive
                            }
                            onChange={() => toggleDayActive(day)}
                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                          <label
                            htmlFor={`day-${day}`}
                            className="text-lg font-medium text-gray-800">
                            {day}
                          </label>
                          {availabilityForm.daysOff.includes(day) && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                              Day Off
                            </span>
                          )}
                        </div>
                        {availabilityForm.weeklySchedule[day].isActive && (
                          <button
                            onClick={() => addTimeSlot(day)}
                            className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded hover:bg-emerald-200 transition">
                            Add Slot
                          </button>
                        )}
                      </div>
                      {availabilityForm.weeklySchedule[day].isActive && (
                        <div className="space-y-2 ml-8">
                          {availabilityForm.weeklySchedule[day].slots.length ===
                          0 ? (
                            <p className="text-gray-500 italic text-sm">
                              No time slots added
                            </p>
                          ) : (
                            availabilityForm.weeklySchedule[day].slots.map(
                              (slot, slotIndex) => (
                                <div
                                  key={slotIndex}
                                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                                  <input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) =>
                                      updateTimeSlot(
                                        day,
                                        slotIndex,
                                        "startTime",
                                        e.target.value
                                      )
                                    }
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                                  />
                                  <span className="text-gray-500">to</span>
                                  <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) =>
                                      updateTimeSlot(
                                        day,
                                        slotIndex,
                                        "endTime",
                                        e.target.value
                                      )
                                    }
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <label className="text-sm text-gray-600">
                                      Max patients:
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="50"
                                      value={slot.maxPatientsPerDay}
                                      onChange={(e) =>
                                        updateTimeSlot(
                                          day,
                                          slotIndex,
                                          "maxPatientsPerDay",
                                          parseInt(e.target.value)
                                        )
                                      }
                                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      removeTimeSlot(day, slotIndex)
                                    }
                                    className="text-red-500 hover:text-red-700 p-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Days Off (General)
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={availabilityForm.daysOff.includes(day)}
                          onChange={() => handleDaysOffChange(day)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {day}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Select days you're not available
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Profile Found
            </h3>
            <p className="text-gray-600">
              Unable to load your availability information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;
