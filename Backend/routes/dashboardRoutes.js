const express = require('express');
const router = express.Router();
const {isAdmin} = require("../midelware/auth");
const dashboardController = require("../controllers/dashboardController");

router.get('/overview',
    isAdmin, // Protect route to admin users only
    dashboardController.getDashboardOverview
);
// Recent Appointments Route
router.get('/recent-appointments',
    isAdmin,
    dashboardController.getRecentAppointments
);
// Doctor Performance Metrics Route
router.get('/doctor-performance',
    isAdmin,
    dashboardController.getDoctorPerformanceMetrics
);
// Monthly Appointment Trends Route
router.get('/appointment-trends/:months',
    isAdmin,
    dashboardController.getMonthlyAppointmentTrends
);
// Patient Demographic Analysis Route
router.get('/patient-demographics',
    isAdmin,
    dashboardController.getPatientDemographicAnalysis
);
// Top Services and Specialties Route
router.get('/top-services-specialties',
    isAdmin,
    dashboardController.getTopServicesAndSpecialties
);
router.post('/specialty',
    isAdmin,
    dashboardController.manageSpecialty
);


router.post('/service-package',
    isAdmin,
    dashboardController.manageServicePackage
);

// routes/appointmentRoutes.js

router.get('/appointments/track',
    isAdmin,
    dashboardController.trackAppointments
);

router.get('/appointments/analyze',
    isAdmin,
    dashboardController.analyzeAppointments
);


router.get('/finance/revenue',
    isAdmin,
    dashboardController.calculateRevenue
);

router.get('/finance/report',
    isAdmin,
    dashboardController.generateFinancialReport
);
module.exports = router;
