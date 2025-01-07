const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorContactController');
const {isPatient, isAdmin,isDoctor} = require('../midelware/auth');

router.get('/getdoctorcontacts',isAdmin, doctorController.getDoctorContacts);
router.post('/createdoctorcontact', doctorController.createContact);
router.get('/getdoctorcontactbyid/:contact_id',isAdmin, doctorController.getDoctorContactById);


module.exports = router;

