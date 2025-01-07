const express = require('express');
const router = express.Router();
const { validateAppointment,isAdmin,isDoctor,isPatient } = require('../midelware/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/appointment', validateAppointment,isPatient, appointmentController.createAppointment);
router.get('/getappointmentcounts', appointmentController.GetAppointmentCounts);
router.post('/updatestatusappointment',isDoctor, appointmentController.updateAppointmentStatus);

// Doctor dashboard routes
router.get('/stats/appointments', isDoctor, appointmentController.getAppointmentStats);
router.get('/next-appointment', isDoctor, appointmentController.getNextAppointmentDetails);
router.get('/stats/patients', isDoctor, appointmentController.getPatientStats);
router.get('/appointments/today', isDoctor, appointmentController.getTodayAppointments);
router.get('/stats/daily-patients', isDoctor, appointmentController.getDailyPatientCount);
router.get('/patients-summary', isDoctor, appointmentController.getPatientsSummary);

router.get('/getdailypatient', isDoctor, appointmentController.GETDAILYPATIENTCOUNTFORCURRENTMONTHBYDOCTOR);

module.exports = router;
