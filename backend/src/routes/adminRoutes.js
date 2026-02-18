const express = require("express");
const bcrypt = require("bcryptjs");

const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

/* 🔐 Protect all admin routes */
router.use(protect, adminOnly);

/* ================== ADD DOCTOR ================== */
router.post("/add-doctor", async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================== DAILY APPOINTMENTS ================== */
router.get("/daily-appointments", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      createdAt: { $gte: today },
    }).populate("doctor patient");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================== DAILY PAYMENT COLLECTION ================== */
router.get("/daily-payments", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      createdAt: { $gte: today },
      paymentStatus: "paid", // only count paid
    });

    const total = appointments.reduce(
      (sum, item) => sum + (item.paymentAmount || 0),
      0
    );

    res.json({ totalCollection: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===== ADMIN CREATES DOCTOR LOGIN ===== */
router.post("/create-doctor-account", async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingDoctor = await User.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const generatedPassword = Math.random().toString(36).slice(-8);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const doctorUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    res.status(201).json({
      message: "Doctor account created",
      doctorId: doctorUser._id,
      doctorEmail: email,
      doctorPassword: generatedPassword, // shown once
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
