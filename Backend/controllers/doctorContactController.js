const  pool = require('../config/connectdatabase');

// create a new contact
exports.createContact = async (req, res) => {
    try {
        const { name,specialty_id, email,phone, message } = req.body;
        await pool.query('CALL CREATEDOCTORCONTACT(?,?,?,?,?)', [name, specialty_id, email, phone, message]);
        res.status(200).json({ message: 'Contact created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.getDoctorContacts = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL GETDOCTORCONTACT()');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.getDoctorContactById = async (req, res) => {
    const { contact_id } = req.params;

    try {
        const [rows] = await pool.query('CALL GETDOCTORCONTACTBYID(?)', [contact_id]);
        if (rows && rows[0]) {
            res.json(rows[0]); // Ensure the correct structure is returned
        } else {
            res.status(404).json({ message: 'Doctor contact not found' });
        }
    } catch (error) {
        console.error('Error fetching doctor contact:', error);
        res.status(500).json({ message: 'Error fetching doctor contact', error: error.message });
    }
}
