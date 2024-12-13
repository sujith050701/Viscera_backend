const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    required: true 
},
practitioner:{
    type:String,
    required:true
},
branch: {
    type: String,
    required: true 
},
name: {
    type: String,
    required: true
},
email:{
    type: String,
    required: true 
},
mobile:{
    type: Number,
    required: true
},
date:{
    type: Date,
    required: true
},
status: {
    type: String,
    default: "scheduled",
  }

});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
