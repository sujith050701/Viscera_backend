
const Appointment = require("../model/appointment_schema");

const twilio = require('twilio');

// Twilio configuration
const accountSid = 'ACfdb846fd6773bd3df58d640adf8e9873'; // Replace with your Twilio Account SID
const authToken = 'ebd3ba39c2b1293f41d76fbbf85a2acc';  // Replace with your Twilio Auth Token
const twilioWhatsAppNumber = 'whatsapp:+14155238886';
// Replace with your Twilio WhatsApp number

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Path to your Appointment model
const User = require('../model/user_schema');  // Path to your User model

const mongoose = require("mongoose");

exports.getAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // or any other query logic for fetching appointments
    res.status(200).json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving appointments',
      error: error.message
    });
  }
};





exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the token
    console.log(`Fetching appointments for user ID: ${userId}`); // Debugging log

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).send({ message: "User not found" });
    }

    // Fetch appointments by user ID
    const appointments = await Appointment.find({ user_id: userId })
      .populate("service", "name specialization");

    // Check if any appointments were found
    if (!appointments.length) {
      console.log(`No appointments found for user ID: ${userId}`); // Debugging log
      return res.status(404).send({ message: "No appointments found for this user" });
    }

    return res.status(200).send({
      success: true,
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error); // Debugging log
    res.status(500).send({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};


exports.createAppointment = async (req, res) => {
  try {
    const user_id = req.user.id; // User ID from the token
    const { mobile, service, practitioner, branch, name, email, date } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [day, month, year] = date.split('-');
    const appointmentDate = new Date(year, month - 1, day);

    if (isNaN(appointmentDate.getTime()) || appointmentDate < today) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    // Normalize the date to YYYY-MM-DD format
    const formattedDate = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, '0')}-${String(appointmentDate.getDate()).padStart(2, '0')}`;

    const appointment = await Appointment.create({
      user_id,
      mobile,
      service,
      practitioner,
      branch,
      name,
      email,
      date: formattedDate,
      status: "scheduled",
    });

    const whatsappMessage = `Hello ${name}, your appointment for ${service} has been successfully booked for ${formattedDate}. Thank you!`;

    try {
      await client.messages.create({
        from: twilioWhatsAppNumber,
        to: `whatsapp:+91${mobile}`,
        body: whatsappMessage,
      });
    } catch (twilioError) {
      console.error('Error sending WhatsApp message:', twilioError);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ success: false, message: 'Error scheduling appointment', error: error.message });
  }
};


exports.deleteAllAppointment = async (req, res) => {
  try {
    const deleteapp = await Appointment.deleteMany()
    res.status(200).json({
      success: true,
      message: 'All appointments deleted successfully',
      data: deleteapp
    });
  } catch (error) {
    console.error('Error deleting appointments:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting appointments',
      error: error.message
    });
  }
}


exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params._id; // This should be the appointment's ID
    console.log(`Deleting appointment with ID: ${appointmentId}`); // Debugging log

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID not provided' });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId); // Use the appointment _id to delete

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: deletedAppointment,
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the appointment',
      error: error.message,
    });
  }
};
