import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";

// approve doctor
export const approveDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.isApproved) {
      return res.status(400).json({ message: "Doctor is already approved" });
    }

    doctor.isApproved = true;
    doctor.status = "approved";
    await doctor.save();

    sendEmail({
      to: doctor.user.email,
      subject: "Doctor Profile Approved",
      html: `
        <h2>Hello Dr. ${doctor.user.name},</h2>
        <p>Your profile has been <b>approved</b> by the admin and is now live on our platform.</p>
        <p>Patients can now view your profile and book appointments with you.</p>
        <p>Regards,<br/>Healthcare Platform Team</p>
      `,
    })
      .then(() => {
        console.log("Appointment email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending appointment email:", error);
      });

    res.status(200).json({
      message: "Doctor approved successfully and slots created for 30 days",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// not approve doctor
export const notApproveDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId).populate("user");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("Rejecting Doctor:", doctorId, doctor);

    if (doctor.isApproved === false && doctor.status === "rejected") {
      return res
        .status(400)
        .json({ message: "Doctor is already dis-approved" });
    }

    doctor.isApproved = false;
    doctor.status = "rejected";
    await doctor.save();

    sendEmail({
      to: doctor.user.email,
      subject: "Doctor Profile Rejected",
      html: `
        <h2>Hello Dr. ${doctor.user.name},</h2>
        <p>We regret to inform you that your profile has been <b>rejected</b> by the admin.</p>
        <p>If you believe this is a mistake or wish to reapply, please update your profile and submit again.</p>
        <p>Regards,<br/>Healthcare Platform Team</p>
      `,
    })
      .then(() => {
        console.log("Appointment email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending appointment email:", error);
      });

    res.status(200).json({
      message: "Doctor dis-approved successfully",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// not approved doctors list
export const getNotApprovedDoctors = async (_req, res, next) => {
  try {
    const doctors = await Doctor.find({ isApproved: false }).populate("user");
    res.status(200).json({
      message: "Not approved doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// get total doctors, patients, appointments list
export const fullList = async (_req, res, next) => {
  try {
    const doctors = await Doctor.find().populate("user");

    const patients = await Patient.find().populate("user");

    const appointments = await Appointment.find()
      .populate({
        path: "doctor",
        populate: { path: "user" },
      })
      .populate({
        path: "patient",
        populate: { path: "user" },
      });

    const totalDoctors = doctors.length;
    const pendingDoctors = doctors.filter(
      (doc) => doc.status === "pending"
    ).length;

    const totalPatients = patients.length;

    const totalAppointments = appointments.length;
    const appointmentStats = {
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    };

    return res.status(200).json({
      success: true,
      doctors,
      patients,
      appointments,
      stats: {
        totalDoctors,
        pendingDoctors,
        totalPatients,
        totalAppointments,
        appointmentStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get all appointments
export const allAppointmentsForAdmin = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "patient",
        populate: { path: "user", select: "name email phone" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email phone" },
      });

    if (!appointments || appointments.length <= 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// all doctors
export const allDoctors = async (_req, res, next) => {
  try {
    const doctors = await Doctor.find().populate("user", "name email phone");
    if (!doctors || doctors.length <= 0) {
      return res.status(404).json({ message: "No doctors found" });
    }
    res.status(200).json(
      {
        success: true,
        doctors,
      },
      { message: "Doctors found successfully" }
    );
  } catch (error) {
    next(error);
  }
};

// all patients
export const allPatients = async (_req, res, next) => {
  try {
    const patients = await Patient.find().populate("user", "name email phone");
    if (!patients || patients.length <= 0) {
      return res.status(404).json({ message: "No patients found" });
    }
    res.status(200).json(
      {
        success: true,
        patients,
      },
      { message: "patients found successfully" }
    );
  } catch (error) {
    next(error);
  }
};

// edit / update profile
export const editProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "name, email or phone number are required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
