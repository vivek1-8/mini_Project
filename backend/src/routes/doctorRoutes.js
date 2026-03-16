const express = require("express");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const protect = require("../middleware/authMiddleware");
const doctorOnly = require("../middleware/doctorMiddleware");

const router = express.Router();

/* ================= DOCTOR PROTECTED ROUTES ================= */
// GET STATS
router.get("/stats", protect, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const allAppointments = await Appointment.find({ doctor: doctor._id });

    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    let upcomingCount = 0;
    let totalRevenue = 0;
    
    // Chart Data Arrays
    const weeklyChartData = Array(7).fill(0); // 0=Sun, 1=Mon...
    let monthlyCompleted = 0;
    let monthlyPending = 0;
    
    allAppointments.forEach(app => {
      const appDate = new Date(app.date);
      
      // Appointment counts by time period
      if (appDate >= today && appDate <= endOfDay) todayCount++;
      if (appDate >= startOfWeek && appDate <= endOfDay) {
         weekCount++;
         weeklyChartData[appDate.getDay()]++;
      }
      if (appDate >= startOfMonth && appDate <= endOfMonth) {
         monthCount++;
         if (app.status === 'completed') monthlyCompleted++;
         if (['pending', 'upcoming'].includes(app.status)) monthlyPending++;
      }
      
      // Upcoming count
      if (appDate >= today && ["upcoming", "pending"].includes(app.status)) {
         upcomingCount++;
      }

      // Revenue
      if (app.paymentStatus === "paid") {
         totalRevenue += app.paymentAmount;
      }
    });

    res.json({
      totalAppointments: allAppointments.length,
      todayPatients: todayCount,
      weeklyPatients: weekCount,
      monthlyPatients: monthCount,
      upcomingAppointments: upcomingCount,
      monthlyEarnings: totalRevenue,
      chartData: {
        weekly: weeklyChartData,
        monthly: {
           completed: monthlyCompleted,
           pending: monthlyPending
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL APPOINTMENTS (WITH FILTERS)
router.get("/appointments", protect, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const { name, date, status } = req.query;

    let query = { doctor: doctor._id };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    let appointments = await Appointment.find(query)
      .populate("patient", "name email phone")
      .sort({ date: -1, time: -1 });

    if (name) {
      const searchRegex = new RegExp(name, 'i');
      appointments = appointments.filter(app => searchRegex.test(app.patient?.name));
    }

    const formatted = appointments.map(a => ({
      id: a._id,
      patientName: a.patient?.name || 'Unknown',
      patientEmail: a.patient?.email || '',
      patientPhone: a.patient?.phone || '',
      date: new Date(a.date).toLocaleDateString(),
      time: a.time,
      status: a.status,
      reason: a.reason,
      paymentAmount: a.paymentAmount
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET TODAY'S APPOINTMENTS
router.get("/today-appointments", protect, doctorOnly, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctor._id,
      date: { $gte: today, $lt: endOfDay }
    }).populate("patient", "name email");

    const formatted = appointments.map(a => ({
      id: a._id,
      patientName: a.patient.name,
      doctorName: doctor.fullName,
      doctorSpecialization: doctor.specialization,
      date: new Date(a.date).toLocaleDateString(),
      time: a.time,
      status: a.status
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUBLIC: GET all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUBLIC: GET single doctor
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(404).json({ message: "Doctor not found" });
  }
});

module.exports = router;
