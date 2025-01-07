const  pool = require('../config/connectdatabase');

// get all reviews
// Dashboard Overview Controller
exports.getDashboardOverview = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL GetDashboardOverview()');
        res.json(rows[0][0]);
    } catch (err) {
        console.error('Dashboard Overview Error:', err.message);
        res.status(500).send('Server error fetching dashboard overview');
    }
};

// Recent Appointments Controller
exports.getRecentAppointments = async (req, res) => {
    try {
        const { days = 30 } = req.query; // Default to last 30 days if not specified
        const [rows] = await pool.query('CALL GetRecentAppointments(?)', [days]);
        res.json(rows[0]);
    } catch (err) {
        console.error('Recent Appointments Error:', err.message);
        res.status(500).send('Server error fetching recent appointments');
    }
};

// Doctor Performance Metrics Controller
exports.getDoctorPerformanceMetrics = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL GetDoctorPerformanceMetrics()');
        res.json(rows[0]);
    } catch (err) {
        console.error('Doctor Performance Metrics Error:', err.message);
        res.status(500).send('Server error fetching doctor performance metrics');
    }
};

// Monthly Appointment Trends Controller
exports.getMonthlyAppointmentTrends = async (req, res) => {
    try {
        const months = parseInt(req.query.months, 10) || 6; // Default to 6 months if not specified

        // Validate months parameter
        if (isNaN(months) || months <= 0 || months > 12) {
            return res.status(400).json({
                message: 'Invalid number of months. Must be between 1 and 12.',
                error: 'INVALID_MONTHS_PARAMETER'
            });
        }

        const [rows] = await pool.query('CALL GetMonthlyAppointmentTrends(?)', [months]);

        // Check if rows are empty
        if (!rows || rows.length === 0 || rows[0].length === 0) {
            return res.status(404).json({
                message: 'No appointment trend data found',
                error: 'NO_DATA_FOUND'
            });
        }

        // Sort data chronologically
        const sortedData = rows[0].sort((a, b) => new Date(a.month) - new Date(b.month));

        res.json(sortedData);
    } catch (err) {
        console.error('Monthly Appointment Trends Error:', err.message);
        res.status(500).json({
            message: 'Server error fetching monthly appointment trends',
            error: err.message,
            details: err.stack
        });
    }
};


// Patient Demographic Analysis Controller
exports.getPatientDemographicAnalysis = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL GetPatientDemographicAnalysis()');
        res.json({
            genderDistribution: rows[0],
            ageDistribution: rows[1]
        });
    } catch (err) {
        console.error('Patient Demographic Analysis Error:', err.message);
        res.status(500).send('Server error fetching patient demographic analysis');
    }
};

// Top Services and Specialties Controller
exports.getTopServicesAndSpecialties = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL GetTopServicesAndSpecialties()');
        res.json({
            topServices: rows[0],
            topSpecialties: rows[1]
        });
    } catch (err) {
        console.error('Top Services and Specialties Error:', err.message);
        res.status(500).send('Server error fetching top services and specialties');
    }
};



// controllers/specialtyController.js
exports.manageSpecialty = async (req, res) => {
    try {
        const { action, specialty_id, specialty_name } = req.body;
        const [rows] = await pool.query('CALL ManageSpecialty(?, ?, ?)',
            [action, specialty_id, specialty_name]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('Specialty Management Error:', err.message);
        res.status(500).send('Server error in specialty management');
    }
};

// controllers/serviceController.js
exports.manageServicePackage = async (req, res) => {
    try {
        const { action, service_id, service_name, description, duration, fee } = req.body;
        const [rows] = await pool.query('CALL ManageServicePackage(?, ?, ?, ?, ?, ?)',
            [action, service_id, service_name, description, duration, fee]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('Service Package Management Error:', err.message);
        res.status(500).send('Server error in service package management');
    }
};

// controllers/appointmentController.js
exports.trackAppointments = async (req, res) => {
    try {
        const { start_date, end_date, status } = req.query;
        const [rows] = await pool.query('CALL TrackAppointments(?, ?, ?)',
            [start_date, end_date, status]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('Appointment Tracking Error:', err.message);
        res.status(500).send('Server error in appointment tracking');
    }
};

exports.analyzeAppointments = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const [rows] = await pool.query('CALL AnalyzeAppointments(?, ?)',
            [start_date, end_date]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('Appointment Analysis Error:', err.message);
        res.status(500).send('Server error in appointment analysis');
    }
};

// controllers/financeController.js
exports.calculateRevenue = async (req, res) => {
    try {
        const { start_date, end_date, grouping } = req.query;
        const [rows] = await pool.query('CALL CalculateRevenue(?, ?, ?)',
            [start_date, end_date, grouping]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('Revenue Calculation Error:', err.message);
        res.status(500).send('Server error in revenue calculation');
    }
};


exports.generateFinancialReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const [rows] = await pool.query('CALL GenerateFinancialReport(?, ?)',
            [start_date, end_date]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('Financial Report Generation Error:', err.message);
        res.status(500).send('Server error in financial report generation');
    }
};



