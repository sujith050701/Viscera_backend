const timespan = require('jsonwebtoken/lib/timespan')
const mongoose = require('mongoose')

const userScehma = mongoose.Schema({
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
    
}, { timestamps: true })

const User = mongoose.model('User', userScehma)

module.exports = User
