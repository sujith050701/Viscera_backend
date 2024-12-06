const express = require('express')
const mongoose = require('mongoose')
const app = express()
const user = require('./Router/appointmentroute')
app.use(express.json()) 
const port = 4001
const cors = require('cors')
app.use(cors())

app.use('/appointment',user)
    
app.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
})

mongoose.connect('mongodb+srv://rsujith776:Sujith2005@cluster0.j97lo.mongodb.net/clinic?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected successfully'))
.catch((error) => console.error('MongoDB connection error:', error));