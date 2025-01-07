const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const {isPatient, isAdmin,isDoctor,validateAppointment} = require('../midelware/auth');
const {upload} = require("../config/cloudinary");


router.get('/getdoctorprofile/:doctor_id', doctorController.getDoctorProfile);
router.get('/getdoctorprofilecookies',isDoctor, doctorController.getDoctorProfileCookies);
router.get('/getdoctorspecialties/:specialty_id', doctorController.GetDoctorBySpecialtiesByID);
router.get('/getdoctorsexperiences', doctorController.getDoctorsExperiences);


// Profile Management
router.put('/profile',isDoctor,doctorController.updateDoctorProfile);

// Schedule Management
router.post('/work-hours',isDoctor,doctorController.setDoctorWorkHours);

router.post('/appointment-slots', isDoctor, doctorController.registerAppointmentSlots);

// Blog Management

// Reporting
router.get('/patient-statistics', isDoctor, doctorController.getDoctorPatientStatistics);

router.get('/revenue-report', isDoctor, doctorController.getDoctorRevenueReport);

router.post('/changestatus', isDoctor, doctorController.changeDoctorStatus);
router.post('/changedoctorstatuss', isAdmin, doctorController.changeDoctorStatuss);
router.post('/createprofiledoctor', isAdmin,upload.single('imageUrl'),doctorController.createDoctorAccount);

router.get('/getlistdoctors', isAdmin, doctorController.listDoctorAccounts);
router.get('/getpatientlistaccount', isAdmin, doctorController.listPatientAccounts);
router.post('/changeroleaccount', isAdmin, doctorController.changeUserRole);
router.get('/getdoctordetail/:doctorId', isAdmin, doctorController.getDoctorAccountDetails);
module.exports = router;


