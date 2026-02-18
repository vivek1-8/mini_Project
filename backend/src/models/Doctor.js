const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    location: String,
    rating: {
      type: Number,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    experience: Number,
    fee: Number,
    image: String,
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
