const express = require('express');
const router = express.Router();
const specialtiesController = require('../controllers/specialtiesController');

router.get('/getspecialties', specialtiesController.getSpecialities);

module.exports = router;
