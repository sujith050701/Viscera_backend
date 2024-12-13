const express = require("express");
const router = express.Router();
const {createAppointment,getAppointment,getAppointmentsByUserId,deleteAppointment,deleteAllAppointment} = require("../controller/appointmentcontroller"); // Check exports here
const { authenticate } = require("../middleware/authmiddleware"); 

router.get("/get",  getAppointment); // Ensure getAppointments is defined

// ... existing code ...

router.post("/create", authenticate, createAppointment); // Ensure createAppointment is defined

// ... existing code ...a

router.get("/get/:_id", authenticate, getAppointmentsByUserId); // Ensure getAppointmentsByUserId is defined

// ... existing code ...

router.delete("/delete/all", deleteAllAppointment); // Ensure deleteAllAppointment is defined
router.delete("/delete/:_id",  deleteAppointment); // Ensure deleteAppointment is defined

module.exports = router;