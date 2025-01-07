const jwt = require('jsonwebtoken');

const  pool = require('../config/connectdatabase');
// get all appointments
exports.getAppointments = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM appointments');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.GetAppointmentCounts = async (req, res) => {
    const { doctor_id, appointment_date } = req.query;

    try {
        const [rows] = await pool.query('CALL GetAppointmentCounts(?, ?)', [doctor_id, appointment_date]);

        // Convert array of rows to object with time slots as keys
        const countsByTimeSlot = {};
        if (rows && rows[0]) {
            rows[0].forEach(row => {
                countsByTimeSlot[row.time_slot] = row.appointment_count;
            });
        }

        res.json(countsByTimeSlot);
    } catch (error) {
        console.error('Error fetching appointment counts:', error);
        res.status(500).json({
            message: 'Error fetching appointment counts',
            error: error.message
        });
    }
};
exports.createAppointment = async (req, res) => {
    try {
        const {
            name,
            date_of_birth,  // Changed from date_of_birth to match frontend
            gender,
            address,
            email,
            phone,
            emergency_contact,  // Changed from emergency_contact
            emergency_phone,    // Changed from emergency_phone
            medical_history,    // Changed from medical_history
            doctor_id,
            appointment_date,   // Changed from appointment_date
            notes
        } = req.body;
        const fee = 200000;
        // Get account_id from authenticated user session/token
        const account_id = req.user?.id || null;

        // Call the stored procedure with all required parameters
        await pool.query(
            'CALL CreateAppointment(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, @p_appointment_id)',
            [
                name,
                date_of_birth,
                gender,
                address,
                email,
                phone,
                fee,
                emergency_contact,
                emergency_phone,
                medical_history,
                doctor_id,
                appointment_date,
                notes,
                account_id
            ]
        );

        // Retrieve the generated appointment ID
        const [appointmentIdResult] = await pool.query('SELECT @p_appointment_id AS appointment_id');
        const appointmentId = appointmentIdResult[0].appointment_id;
        res.status(201).json({
            success: true,
            message: 'Đặt lịch khám thành công' , // Vietnamese success message
            appointmentId
        });

    } catch (error) {
        console.error('Lỗi khi đặt lịch khám:', error);

        // Handle specific error messages
        let errorMessage = 'Đã có lỗi xảy ra khi đặt lịch khám';

        if (error.message.includes('Invalid or non-patient account')) {
            errorMessage = 'Tài khoản không hợp lệ hoặc không phải là tài khoản bệnh nhân';
        } else if (error.message.includes('Appointment date cannot be in the past')) {
            errorMessage = 'Không thể đặt lịch khám trong quá khứ';
        } else if (error.message.includes('This appointment slot is already booked')) {
            errorMessage = 'Lịch khám này đã được đặt, vui lòng chọn giờ khác';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Lỗi hệ thống'
        });
    }
};
// Controller để thay đổi trạng thái của cuộc hẹn
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        // Kiểm tra đầu vào
        if (!appointmentId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu cung cấp appointmentId và status',
            });
        }

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ',
            });
        }

        // Gọi stored procedure để cập nhật trạng thái
        await pool.query('CALL UpdateAppointmentStatus(?, ?)', [appointmentId, status]);

        res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái cuộc hẹn:', error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái cuộc hẹn',
            error: error.message,
        });
    }
};


// Get Patients Summary (Percentage of New and Old Patients)
exports.getPatientsSummary = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(patient_id) AS total_patients,
                ROUND(COUNT(CASE WHEN DATEDIFF(CURRENT_DATE, created_at) <= 30 THEN 1 END) * 100.0 / COUNT(patient_id), 2) AS new_patients_percentage,
                ROUND(COUNT(CASE WHEN DATEDIFF(CURRENT_DATE, created_at) > 30 THEN 1 END) * 100.0 / COUNT(patient_id), 2) AS old_patients_percentage
            FROM patients
            WHERE YEAR(created_at) = YEAR(CURRENT_DATE) AND MONTH(created_at) = MONTH(CURRENT_DATE)
        `);
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Optional: Get All Appointments (if needed)
exports.getAllAppointments = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM appointments');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.GETDAILYPATIENTCOUNTFORCURRENTMONTHBYDOCTOR = async (req, res) => {
    try {
        // Expanded doctor ID extraction to match the pattern in getDoctorPatients
        const doctor_Id = req.user?.doctorId;

        if (!doctor_Id) {
            return res.status(400).json({
                success: false,
                msg: 'Doctor ID is required'
            });
        }

        // Call the stored procedure
        const [rows] = await pool.query('CALL GETDAILYPATIENTCOUNTFORCURRENTMONTHBYDOCTOR(?)', [doctor_Id]);

        // If the procedure has results, return them
        if (rows && rows.length > 0) {
            return res.json({
                success: true,
                data: rows[0]
            });
        }

        return res.status(404).json({
            success: false,
            msg: 'No data found for the given doctor'
        });
    } catch (err) {
        console.error('Error getting daily patient count:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};
// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
    try {
        const doctorId = req.user?.doctorId;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required'
            });
        }

        const [rows] = await pool.query('CALL GetAppointmentStats(?)', [doctorId]);

        return res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error in getAppointmentStats:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get next appointment details
exports.getNextAppointmentDetails = async (req, res) => {
    try {
        const doctorId = req.user?.doctorId;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required'
            });
        }

        const [rows] = await pool.query('CALL GetNextAppointmentDetails(?)', [doctorId]);

        if (!rows[0]) {
            return res.status(200).json({
                success: true,
                message: 'No upcoming appointments found',
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error in getNextAppointmentDetails:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
    try {
        const doctorId = req.user?.doctorId;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required'
            });
        }

        const [rows] = await pool.query('CALL GetPatientStats(?)', [doctorId]);

        return res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error in getPatientStats:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get today's appointments
exports.getTodayAppointments = async (req, res) => {
    try {
        const doctorId = req.user?.doctorId;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required',
            });
        }

        // Call the stored procedure
        const [results] = await pool.query('CALL GetTodayAppointments(?)', [doctorId]);

        // The actual data will be in `results[0]`
        return res.status(200).json({
            success: true,
            data: results[0],
        });
    } catch (error) {
        console.error('Error in getTodayAppointments:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get daily patient count for current month
exports.getDailyPatientCount = async (req, res) => {
    try {
        const doctorId = req.user?.doctorId;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required'
            });
        }

        const [rows] = await pool.query('CALL GetDailyPatientCountForCurrentMonth(?)', [doctorId]);

        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error in getDailyPatientCount:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Example route implementation


