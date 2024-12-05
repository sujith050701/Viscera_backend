const Appointment = require('../Model/appointment_schema')

exports.createAppointment = async (req, res) => {
    try {
        const { service, practitioner, branch, name, email, mobile, date, time } = req.body;

        // Add email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format. Please provide a valid email address.',
            });
        }

        // Validate required fields
        if (!service || !name || !email || !mobile || !date ) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields. Please provide all necessary information.',
            });
        }

        // Validate mobile number format (assuming a 10-digit number)
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid mobile number format. Please provide a valid 10-digit number.',
            });
        }

        // Validate date format and ensure it is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight
        
        // Parse the date string (expecting DD-MM-YYYY format)
        const [day, month, year] = date.split('-');
        
        // Create the Date object with the correct order (year, month-1, day)
        const appointmentDate = new Date(year, month - 1, day);
        
        if (isNaN(appointmentDate.getTime()) || appointmentDate < today) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date. Please provide a future date in DD-MM-YYYY format.',
            });
        }
        
        // Format the date to YYYY-MM-DD for consistent storage
        const formattedDate = appointmentDate.toISOString().split('T')[0];
    
        const appointmentData = {
            service,
            practitioner,
            branch,
            name,
            email,
            mobile,
            date: formattedDate,
            time,
        };

        const appointment = await Appointment.create(appointmentData);

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully.',
            data: appointment,
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while creating the appointment.',
            error: error.message,
        });
    }
};

exports.getAppointment = async (req, res) => {
        try {
            const getapp =await Appointment.find()
            res.status(200).json(getapp)
        } catch (error) {
                res.status(400).send(error)   
        }

}



exports.deleteAllAppointment = async(req,res) => {
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
        const { id } = req.params;
        
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        
        if (!deletedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully',
            data: deletedAppointment
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the appointment',
            error: error.message
        });
    }
};