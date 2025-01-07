const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const {isPatient, isAdmin, isDoctor} = require("../midelware/auth");
const {body} = require("express-validator");


router.get('/getpatients',isPatient, patientController.getPatients);
router.post('/createpatient',isAdmin, patientController.createPatient);
router.post('/updatepatient/:patientID',isPatient, patientController.updatePatient);
router.get('/getdoctorpatients',isDoctor, patientController.getDoctorPatients);
router.get('/getpatient/:patientId', isDoctor, patientController.getPatientDetails);

router.get('/provinces', patientController.getProvinces);

// Fetch districts by province code
router.get('/districts/:provinceCode', patientController.getDistrictsByProvince);

// Fetch all districts
router.get('/districts', patientController.getDistrictsByProvinces);

// Fetch wards by district code
router.get('/wards/:districtCode', patientController.getWardsByDistrict);

// Fetch all wards
router.get('/wards', patientController.getWardsByDistricts);

// Validation middleware can be added here
const validatePatientUpdate = [
    body('name').notEmpty().withMessage('Tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    // Add more validations as needed
];

router.get('/patientdetail/:patientId',isAdmin, patientController.getPatientAccountDetails);
router.get('/accountdetail',isPatient, patientController.getAccountDetails);
router.get('/listpatientaccount',isAdmin, patientController.listPatientAccounts);
router.put('/updatepatient/:patientId',isAdmin, patientController.updatePatientAccount);
router.delete('deletepatient/:patientId',isAdmin, patientController.deletePatientAccount);
router.get('/getappointmenthistory',isPatient, patientController.getAppointmentHistory);

// Patient profile routes
router.get('/profile',isPatient, patientController.getPatientProfile);
router.put('/profile/update',isPatient, patientController.updatePatientProfile);
router.put('/profile/change-password',isPatient, patientController.changePassword);
router.put('/profile/deactivate',isPatient, patientController.deactivateAccount);
router.put('/profile/activate',isPatient, patientController.activateAccount);

module.exports = router;
