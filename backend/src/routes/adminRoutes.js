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
    const { fullName, email, specialization, location, experience, fee, image } = req.body;

    if (!email || !fullName) {
       return res.status(400).json({ message: "Email and Full Name are required" });
    }

    const existingDoctor = await User.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const doctorUser = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    const doctor = await Doctor.create({
      userId: doctorUser._id,
      fullName,
      specialization,
      location,
      experience,
      fee,
      image,
    });

    res.status(201).json({
      message: "Doctor Added Successfully",
      doctor,
      credentials: { email, password: generatedPassword }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================== DOCTOR MANAGEMENT ================== */
// GET ALL DOCTORS FOR ADMIN TABLE
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "email role");
    
    // Format response to include email and ID nicely
    const formattedDoctors = doctors.map((doc) => ({
      id: doc._id,
      userId: doc.userId?._id,
      fullName: doc.fullName,
      email: doc.userId?.email || "No Email",
      specialization: doc.specialization,
      fee: doc.fee,
      experience: doc.experience,
      available: doc.available, // true or false
      image: doc.image,
    }));

    res.json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE DOCTOR (including Toggle Available Status)
router.put("/update-doctor/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Update fields explicitly if present in body
    if (req.body.fullName) doctor.fullName = req.body.fullName;
    if (req.body.specialization) doctor.specialization = req.body.specialization;
    if (req.body.location) doctor.location = req.body.location;
    if (req.body.experience) doctor.experience = req.body.experience;
    if (req.body.fee) doctor.fee = req.body.fee;
    if (req.body.image) doctor.image = req.body.image;
    if (req.body.available !== undefined) doctor.available = req.body.available; // Allow boolean toggle

    await doctor.save();
    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE DOCTOR
router.delete("/delete-doctor/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Delete associated user auth account
    if (doctor.userId) {
      await User.findByIdAndDelete(doctor.userId);
    }
    
    // Delete doctor profile
    await Doctor.findByIdAndDelete(req.params.id);

    // Provide cleanup option for appointments if desired (Optional - skipped for safety)
    
    res.json({ message: "Doctor deleted successfully" });
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

/* ================== WEEKLY PAYMENT COLLECTION ================== */
router.get("/weekly-payments", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      createdAt: { $gte: startOfWeek, $lte: today },
      paymentStatus: "paid",
    });

    const weeklyChartData = Array(7).fill(0); // 0=Sun, 1=Mon...
    
    appointments.forEach(app => {
       const appDate = new Date(app.createdAt);
       weeklyChartData[appDate.getDay()] += app.paymentAmount;
    });

    const total = weeklyChartData.reduce((sum, val) => sum + val, 0);

    res.json({ 
       totalCollection: total,
       chartData: weeklyChartData 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================== MONTHLY PAYMENT COLLECTION ================== */
router.get("/monthly-payments", async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const allMonthlyAppointments = await Appointment.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    let completedRevenue = 0;
    let pendingPayments = 0; // count of unpaid appointments or pending

    allMonthlyAppointments.forEach(app => {
       if (app.paymentStatus === 'paid') {
          completedRevenue += app.paymentAmount;
       } else {
          pendingPayments += app.paymentAmount || 0;
       }
    });

    res.json({ 
       totalCollection: completedRevenue,
       completedRevenue,
       pendingPayments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================== PAYMENT HISTORY TABLE ================== */
router.get("/payment-history", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "fullName")
      .sort({ createdAt: -1 }); // newest first

    const formattedHistory = appointments.map(a => ({
      id: a._id,
      patientName: a.patient?.name || "Unknown",
      doctorName: a.doctor?.fullName || "Unassigned",
      date: new Date(a.date).toLocaleDateString(), // appointment date
      time: a.time,
      amount: a.paymentAmount || 0,
      status: a.paymentStatus || 'pending',
      method: 'Razorpay', // Assuming all paid are razorpay for now based on current flow
      appointmentStatus: a.status
    }));

    res.json(formattedHistory);
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
