const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// GET all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single doctor
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(404).json({ message: "Doctor not found" });
  }
});

module.exports = router;
