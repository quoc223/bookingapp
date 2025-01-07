const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
router.get('/doctors/:doctorId/services', serviceController.getServicesByDoctorId);
module.exports = router;
