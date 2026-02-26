const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

/* ================= CREATE ORDER ================= */
router.post("/create-order", protect, createOrder);

/* ================= VERIFY PAYMENT ================= */
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;
