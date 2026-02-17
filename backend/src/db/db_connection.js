const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI ||"mongodb+srv://vivek2303051051377_db_user:dw0oCjhedrZ0iLuA@cluster0.cfzitcz.mongodb.net/?appName=Cluster0");
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
