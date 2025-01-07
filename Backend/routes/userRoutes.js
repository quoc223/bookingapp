const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const {isPatient, isAdmin,isDoctor,isAny} = require('../midelware/auth');
const {login} = require("../controllers/authController");
router.post('/register', authController.registerpatient);
router.post('/register/doctor', authController.registerdoctor);
router.post('/login/patient', (req, res) => login(req, res, 'PATIENT'));
router.post('/login/doctor', (req, res) => login(req, res, 'DOCTOR'));
router.post('/login/admin', (req, res) => login(req, res, 'ADMIN'));
router.post('/logout', authController.logout);
router.get('/getuserbyid/:account_id', authController.getUserById);
router.get('/getallusers',isAdmin, authController.getAllUser);
router.post('/updateuser',isAdmin,isDoctor,isPatient, authController.updateUser);
router.post('/deleteuser',isAdmin, authController.deleteUser);
router.get('/getuserbyrole',isAdmin, authController.getUserByRole);
router.get('/verify-token',isAny, authController.verifyToken);
router.get('/verify-access-token',isAny, authController.verifyAccessToken);
router.post('/refresh-token', authController.refreshToken);


module.exports = router;
