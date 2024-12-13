const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db"); // MongoDB connection function



// Import Routecs
const authRoutes = require("./router/authroutes");
const appointmentRoutes = require("./router/appointmentroute");

const app = express();
const PORT = 6009;
app.use(express.json());
// Middleware
app.use(bodyParser.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/appointments", appointmentRoutes); // Appointment routes



// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
