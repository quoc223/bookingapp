const  pool = require('../config/connectdatabase');
// get all specialities
exports.getSpecialities = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM specialties');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
