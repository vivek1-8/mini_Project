const express = require("express");
const dotenv = require("dotenv");
// const connectDB = require("./db_connection");
const connectDB = require("./src/db/db_connection");
const authRoutes = require("./src/routes/authRoutes");

dotenv.config(); // env load

const app = express();

// MongoDB connect
connectDB();

// Middleware
app.use(express.json());
// routers calling
app.use("/api/auth", authRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
