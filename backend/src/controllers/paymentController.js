const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Appointment = require("../models/Appointment");

/* ===========================================
   🟢 CREATE RAZORPAY ORDER
=========================================== */
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================================
   🟢 VERIFY PAYMENT
=========================================== */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      doctorId,
      date,
      time,
      amount,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Missing payment fields",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ||"M38EmdMJ3LvFJ9ddrTJ8ewup")
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

     /* ================= SAVE APPOINTMENT ================= */

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date), // FIXED
      paymentAmount: amount,
      paymentStatus: "paid",
      paymentMethod: "razorpay",
      status: "upcoming",
    });

    res.status(200).json({
      message: "Payment verified & appointment booked",
      appointment,
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
