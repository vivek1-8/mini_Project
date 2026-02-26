const express = require("express");
const Appointment = require("../models/Appointment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= BOOK APPOINTMENT ================= */
router.post("/book", protect, async (req, res) => {
  try {
    const { doctorId, date, time, reason, fee } = req.body;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
      paymentAmount: fee,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= PATIENT APPOINTMENTS ================= */
router.get("/my-appointments", protect, async (req, res) => {
  const appointments = await Appointment.find({
    patient: req.user._id,
  }).populate("doctor");

  res.json(appointments);
});

module.exports = router;
