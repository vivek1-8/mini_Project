const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    /* 📅 APPOINTMENT DATE */
    date: {
      type: Date,
      required: true,
    },

    /* ⏰ APPOINTMENT TIME */
    time: {
      type: String,
      required: true,
    },

    /* 📝 PATIENT REASON */
    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },

    /* 💰 PAYMENT DETAILS */
    paymentAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card"],
      default: "cash",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
