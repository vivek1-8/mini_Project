const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Get patient appointments
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctor");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get stats
router.get("/stats", async (req, res) => {
  try {
    const upcoming = await Appointment.countDocuments({
      status: "upcoming",
    });

    const completed = await Appointment.countDocuments({
      status: "completed",
    });

    res.json({
      upcomingAppointments: upcoming,
      completedAppointments: completed,
      favoritesDoctors: 2,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
