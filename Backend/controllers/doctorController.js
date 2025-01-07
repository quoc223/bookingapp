const  pool = require('../config/connectdatabase');
// get all doctors
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;


exports.getDoctorProfile = async (req, res) => {
    const { doctor_id } = req.params;

    try {
        // Execute the stored procedure with the doctor_id
        const [rows] = await pool.query('CALL GetDoctorProfile(?)', [doctor_id]);

        // Check if the result exists
        if (rows && rows[0]) {
            res.json(rows[0]); // Return the doctor profile
        } else {
            // If no profile is found, return a 404 error
            res.status(404).json({ message: 'Doctor profile not found' });
        }
    } catch (error) {
        // Check if the error is from MySQL (custom error message)
        if (error.message.includes('Doctor ID does not exist')) {
            res.status(404).json({ message: 'Doctor profile not found' });
        } else {
            // Handle other errors
            console.error('Error fetching doctor profile:', error);
            res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
        }
    }
};
exports.getDoctorProfileCookies = async (req, res) => {
    try {
        // Extract doctor_id from the verified user data (ensure correct field name)
        const doctor_id  = req.user?.doctorId;

        // Ensure doctor_id is valid before proceeding
        if (!doctor_id) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }

        // Execute the stored procedure with the doctor_id
        const [rows] = await pool.query('CALL GetDoctorProfile(?)', [doctor_id]);

        // Check if a profile was returned
        if (rows && rows[0]) {
            return res.json(rows[0]); // Return the doctor profile
        } else {
            // If no profile is found, return a 404 error
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
    } catch (error) {
        // Handle any errors during the query execution
        console.error('Error fetching doctor profile:', error);

        // Check if the error is MySQL specific (assuming this based on procedure logic)
        if (error.code === 'ER_NO_SUCH_TABLE' || error.message.includes('Doctor ID does not exist')) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        // For other errors, send a generic 500 response
        return res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
    }
};

exports.GetDoctorBySpecialtiesByID = async (req, res) => {
    const { specialty_id } = req.params;

    try {
        const [rows] = await pool.query('CALL GetDoctorBySpecialtiesByID(?)', [specialty_id]);
        // Nếu có kết quả, trả về thông tin bác sĩ
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ message: 'No doctors found for this specialty.' });
        }
    } catch (error) {
        console.error('Error fetching doctor profile:', error);

        // Xử lý lỗi từ SIGNAL SQLSTATE trong stored procedure
        if (error.code === '45000') {  // Nếu là lỗi từ SIGNAL SQLSTATE
            res.status(400).json({ message: error.sqlMessage || 'Invalid specialty ID or Specialty ID does not exist.' });
        } else {
            res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
        }
    }
}
exports.getDoctorsExperiences = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL GetDoctorExperiences()');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
// UC1.1: Update Doctor Profile
exports.updateDoctorProfile = async (req, res) => {
    try {
        // Extract doctor_id from the verified token
        const  doctor_id  = req.user?.doctorId;

        // Extract the necessary fields from the request body
        const {
            name,
            email,
            phone,
            bio,
            years_of_experience,
            hospital_name,
            specialty_name,
        } = req.body;

        // Ensure all required fields are provided
        if (
            !name ||
            !email ||
            !phone ||
            !bio ||
            !years_of_experience ||
            !hospital_name ||
            !specialty_name
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Call the stored procedure to update the doctor's profile
        await pool.query(
            'CALL SP_UPDATE_DOCTOR_PROFILE(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                doctor_id,
                name,
                email,
                phone,
                bio,
                years_of_experience,
                hospital_name,
                specialty_name,
            ]
        );

        // Send a success response
        res.status(200).json({ message: 'Doctor profile updated successfully' });
    } catch (err) {
        console.error('Error updating doctor profile:', err.message);

        // Handle specific error messages raised by the procedure
        if (err.code === '45000') {
            return res.status(400).json({ message: err.sqlMessage });
        }

        // Handle generic server errors
        res.status(500).send('Server error');
    }
};


// UC2.1: Set Doctor Work Hours
exports.setDoctorWorkHours = async (req, res) => {
    try {
        const  doctor_id  = req.user?.doctorId; // Extract doctor_id from verified token
        const {
            day_of_week,
            start_time,
            end_time,
            is_available
        } = req.body;

        await pool.query('CALL SP_SET_DOCTOR_WORK_HOURS(?, ?, ?, ?, ?)', [
            doctor_id,
            day_of_week,
            start_time,
            end_time,
            is_available
        ]);

        res.status(200).json({ message: 'Doctor work hours set successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// UC2.2: Register Appointment Slots
exports.registerAppointmentSlots = async (req, res) => {
    try {
        const  doctor_id  = req.user?.doctorId; // Extract doctor_id from verified token
        const {
            start_datetime,
            end_datetime,
            slot_duration
        } = req.body;

        await pool.query('CALL SP_REGISTER_APPOINTMENT_SLOTS(?, ?, ?, ?)', [
            doctor_id,
            start_datetime,
            end_datetime,
            slot_duration
        ]);

        res.status(200).json({ message: 'Appointment slots registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// UC5.1: Create Blog Post
// UC6.1: Get Doctor Patient Statistics
exports.getDoctorPatientStatistics = async (req, res) => {
    try {
        const  doctor_id  = req.user?.doctorId; // Extract doctor_id from verified token
        const {
            start_date,
            end_date
        } = req.query;

        const [results] = await pool.query('CALL SP_GET_DOCTOR_PATIENT_STATISTICS(?, ?, ?)', [
            doctor_id,
            start_date,
            end_date
        ]);

        res.status(200).json(results[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// UC6.2: Get Doctor Revenue Report
exports.getDoctorRevenueReport = async (req, res) => {
    try {
        const  doctor_id  = req.user?.doctorId; // Extract doctor_id from verified token
        const {
            start_date,
            end_date
        } = req.query;

        const [results] = await pool.query('CALL SP_GET_DOCTOR_REVENUE_REPORT(?, ?, ?)', [
            doctor_id,
            start_date,
            end_date
        ]);

        res.status(200).json(results[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.changeDoctorStatus = async (req, res) => {
    const doctor_id  = req.user?.doctorId;

    try {
        await pool.query('CALL SP_TOGGLE_DOCTOR_STATUS(?)', [doctor_id]);
        res.status(200).json({ message: 'Status toggled successfully' });
    } catch (error) {
        console.error('Error toggling doctor status:', error);
        res.status(500).json({ error: 'Failed to toggle status' });
    }
}
exports.changeDoctorStatuss = async (req, res) => {
    const doctor_id = req.body.doctorId;

    if (!doctor_id) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }
    try {
        // Call the stored procedure to toggle the doctor's status
        await pool.query('CALL ChangeStatusAccountDoctors(?)', [doctor_id]);
        // Respond with a success message
        res.status(200).json({ message: 'Doctor status toggled successfully' });
    } catch (error) {
        console.error('Error toggling doctor status:', error);
        // Check for specific SQL errors
        if (error.sqlState === '45000') {
            return res.status(400).json({ error: error.sqlMessage });
        }
        // Respond with a generic server error
        res.status(500).json({ error: 'Failed to toggle doctor status' });
    }
};

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
    secure: true,
});

// Utility function to upload image from URL
const uploadImageFromUrl = async (image) => {
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: 'doctor',
            transformation: [{ width: 500, height: 500, crop: 'limit' }],
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary URL upload error:', error);
        throw new Error('Image upload from URL failed');
    }
};

// Utility function to upload local file
const uploadLocalImage = async (file) => {
    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'doctor',
            transformation: [{ width: 500, height: 500, crop: 'limit' }],
        });

        // Remove local file after upload
        await fs.unlink(file.path);

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary local file upload error:', error);
        throw new Error('Local image upload failed');
    }
};

// Validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.createDoctorAccount = async (req, res) => {
        try {
            // Log incoming request for debugging
            console.log('Request Body:', req.body);
            console.log('Request File:', req.file);

            // Destructure request body
            const {
                username,
                password,
                email,
                name,
                specialtyName,
                hospitalName,
                phone,
                bio,
                yearsOfExperience
            } = req.body;

            // Validate required fields
            if (!username || !password || !email || !name) {
                return res.status(400).json({
                    message: 'Missing required fields'
                });
            }

            // Validate email format
            if (!validateEmail(email)) {
                return res.status(400).json({
                    message: 'Invalid email format'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            let uploadedImageUrl = null;

            if (req.file) {
                try {
                    uploadedImageUrl = await uploadLocalImage(req.file);
                } catch (uploadError) {
                    console.error('Cloudinary upload error:', uploadError);
                    return res.status(400).json({
                        message: 'Image upload failed',
                        error: uploadError.message
                    });
                }
            } else if (req.body.imageUrl) {
                try {
                    uploadedImageUrl = await uploadImageFromUrl(req.body.imageUrl);
                } catch (uploadError) {
                    console.error('Cloudinary upload error:', uploadError);
                    return res.status(400).json({
                        message: 'Image upload failed',
                        error: uploadError.message
                    });
                }
            } else {
                // No image provided, set uploadedImageUrl to null
                uploadedImageUrl = null;
            }

            // Call stored procedure to create doctor account
            const [result] = await pool.query(
                'CALL SP_CREATE_DOCTOR_ACCOUNT(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    username,
                    hashedPassword,
                    email,
                    name,
                    specialtyName || null,
                    hospitalName || null,
                    phone || null,
                    bio || null,
                    parseInt(yearsOfExperience) || null,
                    uploadedImageUrl
                ]
            );

            // Extract account and doctor IDs
            const { account_id, doctor_id } = result[0][0];

            // Successful response
            res.status(201).json({
                message: 'Doctor account created successfully!',
                accountId: account_id,
                doctorId: doctor_id,
                imageUrl: uploadedImageUrl
            });

        } catch (error) {
            console.error('Error creating doctor account:', error);

            // Handle specific error types
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Username or email already exists'
                });
            }

            // Handle database-specific errors
            if (error.sqlState === '45000') {
                return res.status(400).json({
                    message: error.sqlMessage || 'Account creation failed'
                });
            }

            // Handle Cloudinary upload errors
            if (error.message.includes('upload failed')) {
                return res.status(400).json({
                    message: 'Image upload failed',
                    error: error.message
                });
            }

            // Generic server error
            res.status(500).json({
                message: 'Server error during account creation',
                errorDetails: error.message
            });
        }
    };
// List Patient Accounts
exports.listPatientAccounts = async (req, res) => {
    const { page = 1, pageSize = 10, searchTerm = '' } = req.query;

    try {
        // Execute stored procedure ListPatientAccounts
        const [patients, pagination] = await pool.query('CALL ListPatientAccounts(?, ?, ?)', [
            parseInt(page),
            parseInt(pageSize),
            searchTerm
        ]);

        res.status(200).json({
            patients: patients[0], // List of patients
            totalPages: pagination[0].total_pages,
            totalRecords: pagination[0].total_records,
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching patient accounts:', error);
        res.status(500).json({
            message: 'Failed to retrieve patient accounts',
            error: error.message
        });
    }
};
exports.listDoctorAccounts = async (req, res) => {
    const { page = 1, pageSize = 10, searchTerm = '' } = req.query;

    try {
        // Thực thi stored procedure ListDoctorAccounts
        const [doctors, pagination] = await pool.query('CALL ListDoctorAccounts(?, ?, ?)', [
            parseInt(page),
            parseInt(pageSize),
            searchTerm
        ]);

        res.status(200).json({
            doctors: doctors[0], // Kết quả danh sách bác sĩ
            totalPages: pagination[0].total_pages,
            totalRecords: pagination[0].total_records,
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching doctor accounts:', error);
        res.status(500).json({
            message: 'Failed to retrieve doctor accounts',
            error: error.message
        });
    }
};
exports.changeUserRole = async (req, res) => {
    const { accountId, newRole } = req.body;

    try {
        // Execute stored procedure ChangeUserRole
        await pool.query('CALL ChangeUserRole(?, ?)', [accountId, newRole]);

        res.status(200).json({
            message: 'User role updated successfully',
            accountId,
            newRole
        });
    } catch (error) {
        console.error('Error changing user role:', error);
        res.status(500).json({
            message: 'Failed to change user role',
            error: error.message
        });
    }
};
exports.getDoctorAccountDetails = async (req, res) => {
    const { doctorId } = req.params;

    try {
        // Thực thi stored procedure GetDoctorAccountDetails
        const [details] = await pool.query('CALL GetDoctorAccountDetails(?)', [doctorId]);

        if (details[0].length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(details[0][0]); // Trả về chi tiết bác sĩ
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({
            message: 'Failed to retrieve doctor details',
            error: error.message
        });
    }
};
