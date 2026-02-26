const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_CbnfJtVumEy6z5",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "M38EmdMJ3LvFJ9ddrTJ8ewup",
});

module.exports = razorpay;
