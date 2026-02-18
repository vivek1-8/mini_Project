const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const specializations = [
      ...new Set(doctors.map((d) => d.specialization)),
    ];
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
