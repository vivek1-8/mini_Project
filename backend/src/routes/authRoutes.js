const express = require("express");
const router = express.Router();

// Import Controllers
const {
  registerUser,
  loginUser
} = require("../controllers/authController");

/*
===========================
        AUTH ROUTES
===========================
*/

// 👉 Register Route
// URL: POST http://localhost:5000/api/auth/register
router.post("/register", registerUser);

// 👉 Login Route
// URL: POST http://localhost:5000/api/auth/login
router.post("/login", loginUser);


/*
===========================
   TEST ROUTE (Optional)
===========================
*/

// Test route to check if auth routes working
router.get("/test", (req, res) => {
  res.send("Auth routes working 🚀");
});

module.exports = router;
