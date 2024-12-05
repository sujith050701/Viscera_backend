const express = require('express');
const router = express.Router();
const {createAppointment, getAppointment, deleteAllAppointment , deleteAppointment} = require('../controller/appointment')

router.post('/crt', createAppointment);
router.get('/get',getAppointment)
router.delete('/deleteAll',deleteAllAppointment)
router.delete('/:id', deleteAppointment);

module.exports = router;