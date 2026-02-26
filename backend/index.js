const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/db/db_connection");
const authRoutes = require("./src/routes/authRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const specializationRoutes = require("./src/routes/specializationRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const createSuperAdmin = require("./src/utils/createAdmin");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");




dotenv.config();

const app = express();

connectDB().then(async () => {
  await createSuperAdmin();
});

// ✅ CORS FIX
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/specializations", specializationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes); 
app.use("/api/payment", paymentRoutes);




app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
