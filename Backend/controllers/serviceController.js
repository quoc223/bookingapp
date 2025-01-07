const  pool = require('../config/connectdatabase');

// get all reviews
exports.getReviews = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM services');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.getServicesByDoctorId = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const [rows] = await pool.query('CALL GetServiceByDoctorID(?)', [doctorId]);
        if (rows && rows[0]) {
            res.json(rows[0]); // Ensure the correct structure is returned
        } else {
            res.status(404).json({ message: 'Doctor profile not found' });
        }
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
    }
};
