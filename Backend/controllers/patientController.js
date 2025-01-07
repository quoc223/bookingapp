const  pool = require('../config/connectdatabase');
const bcrypt = require('bcryptjs');
// get all patients
const axios = require('axios');
exports.getPatients = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM patients');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.createPatient = async (req, res) => {
    try {
        const { name, date_of_birth, gender, address, email, phone, emergency_contact, emergency_phone, medical_history } = req.body;

        // Check for duplicate email or phone
        const [existingPatients] = await pool.query('SELECT * FROM patients WHERE email = ? OR phone = ?', [email, phone]);
        if (existingPatients.length > 0) {
            return res.status(400).json({ message: 'Email or phone already exists' });
        }
        await pool.query('CALL CreatePatient(?,?,?,?,?,?,?,?,?)', [name, date_of_birth, gender, address, email, phone, emergency_contact, emergency_phone, medical_history]);
        res.status(200).json({ message: 'Patient created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.updatePatient = async (req, res) => {
    try
    {
        const { patient_id,name, date_of_birth, gender, address, email, phone, emergency_contact, emergency_phone, medical_history} = req.body;
        await pool.query('CALL updatePatient(?,?,?,?,?,?,?,?,?,?)', [patient_id,name, date_of_birth, gender, address, email, phone, emergency_contact, emergency_phone, medical_history]);
        res.status(200).json({ message: 'Patient updated successfully' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.getDoctorPatients = async (req, res) => {
    try {


        // Modify to handle different ways of getting doctor_id
        const doctorId = req.user?.doctorId || req.user?.doctor_id || req.body.doctorId || req.query.doctorId;



        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Bác sĩ không hợp lệ hoặc không có ID bác sĩ'
            });
        }

        const [patients] = await pool.query('CALL GetDoctorPatients(?)', [doctorId]);
        res.json({
            success: true,
            data: patients[0] || [] // Trả về mảng rỗng nếu không tìm thấy bệnh nhân
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bệnh nhân:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách bệnh nhân',
            error: error.message
        });
    }
};


exports.getPatientDetails = async (req, res) => {
    try {
        const { patientId } = req.params;
        const doctorId = req.user?.doctorId;
        console.log('patientId:', patientId);  // In ra giá trị patientId
        console.log('doctorId:', doctorId);
        const [details] = await pool.query('CALL GetPatientDetails(?, ?)', [patientId, doctorId]);
        const [appointments] = await pool.query('CALL GetPatientAppointmentHistory(?, ?)', [patientId, doctorId]);

        res.json({
            success: true,
            patient: details[0]?.[0] || null, // Trả về null nếu không tìm thấy bệnh nhân
            appointments: appointments[0] || [] // Trả về mảng rỗng nếu không có lịch sử cuộc hẹn
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin bệnh nhân:', error.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin chi tiết bệnh nhân',
            error: error.message
        });
    }
};




// Fetch all provinces
exports.getProvinces = async (req, res) => {
    try {
        const response = await axios.get(process.env.PROVINCE);
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching provinces');
    }
};

// Fetch districts by province code
exports.getDistrictsByProvince = async (req, res) => {
    try {
        const { provinceCode } = req.params;

        // Fetch districts by province code
        const response = await axios.get(`${process.env.DISTRICT}/${provinceCode}`);
        res.json(response.data.districts);  // Return only the districts
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching districts');
    }
};

// Fetch all districts
exports.getDistrictsByProvinces = async (req, res) => {
    try {
        // Fetch all districts
        const response = await axios.get(process.env.DISTRICT);  // Call the API to get all districts
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching districts');
    }
};

// Fetch wards by district code
exports.getWardsByDistrict = async (req, res) => {
    try {
        const { districtCode } = req.params;

        // Fetch wards by district code
        const response = await axios.get(`https://provinces.open-api.vn/api/w/${districtCode}`, { withCredentials: true});

        console.log('Fetched Wards:', response.data);  // Log dữ liệu trả về

        // Kiểm tra xem dữ liệu có phải là một đối tượng và có chứa các thuộc tính cần thiết
        if (response.data && Array.isArray(response.data)) {
            // Nếu là mảng thì trả về mảng wards
            res.json(response.data);
        } else if (response.data && response.data.name) {
            // Nếu là đối tượng ward duy nhất, chuyển nó thành một mảng
            res.json([response.data]);
        } else {
            // Nếu không có dữ liệu hoặc không phải dạng mong đợi, trả về mảng rỗng
            res.json([]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching wards');
    }
};



// Fetch all wards
exports.getWardsByDistricts = async (req, res) => {
    try {
        // Fetch all wards
        const response = await axios.get(process.env.WARD, { withCredentials: true});
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching wards');
    }
};

exports.getPatientAccountDetails = async (req, res) => {
    try {
        const { patientId } = req.params;

        const [result] = await pool.query('CALL GetPatientAccountDetails(?)', [patientId]);

        if (result[0].length === 0) {
            return res.status(404).json({ message: 'Tài khoản bệnh nhân không tồn tại' });
        }

        res.status(200).json(result[0][0]);
    } catch (error) {
        console.error('Lỗi fetch data chi tiết:', error);
        res.status(500).json({ message: 'Lỗi fetch data bệnh nhân chi tiết' });
    }
};
exports.getAccountDetails = async (req, res) => {
    try {
        const { patientId } = req.user;

        const [result] = await pool.query('CALL GetPatientAccountDetails(?)', [patientId]);

        if (result[0].length === 0) {
            return res.status(404).json({ message: 'Tài khoản bệnh nhân không tồn tại' });
        }

        res.status(200).json(result[0][0]);
    } catch (error) {
        console.error('Lỗi fetch data chi tiết:', error);
        res.status(500).json({ message: 'Lỗi fetch data bệnh nhân chi tiết' });
    }
};
exports.listPatientAccounts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const searchTerm = req.query.searchTerm || '';

        const [result] = await pool.query('CALL ListPatientAccounts(?, ?, ?)', [
            page, pageSize, searchTerm
        ]);

        res.status(200).json({
            patients: result[0],
            pagination: result[1][0]
        });
    } catch (error) {
        console.error('Lỗi danh sách tài khoản bệnh nhân:', error);
        res.status(500).json({ message: 'Lỗi danh sách account' });
    }
};

exports.updatePatientAccount = async (req, res) => {
    try {

        const { patientId } = req.user;
        const {
            name,
            dateOfBirth,
            gender,
            address,
            email,
            phone,
            emergencyContact,
            emergencyPhone,
            medicalHistory,
            status
        } = req.body;

        await pool.query(
            'CALL UpdatePatientAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                patientId,
                name,
                dateOfBirth,
                gender,
                address,
                email,
                phone,
                emergencyContact,
                emergencyPhone,
                medicalHistory,
                status
            ]
        );

        res.status(200).json({ message: 'Cập nhật tài khoản bệnh nhân thành công' });
    } catch (error) {
        console.error('Lỗi cập nhật tài khoản bệnh nhân:', error);
        res.status(500).json({ message: 'Cập nhật tài khoản bệnh nhân thất bại' });
    }
};

exports.deletePatientAccount = async (req, res) => {
    try {
        const { patientId } = req.params;

        await pool.query('CALL DeletePatientAccount(?)', [patientId]);

        res.status(200).json({ message: 'Xóa tài khoản bệnh nhân thành công' });
    } catch (error) {
        console.error('Lỗi xóa tài khoản bệnh nhân:', error);
        res.status(500).json({ message: 'Xóa tài khoản bệnh nhân thất bại' });
    }
};
exports.getAppointmentHistory = async (req, res) => {
    try {
        const { patientId } = req.user; // Read patientId from the request parameters
        const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10

        // Check if patientId is provided
        if (!patientId) {
            return res.status(400).json({ message: "Patient ID is required." });
        }

        // Validate page and limit
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ message: "Invalid page or limit parameters." });
        }

        // Calculate OFFSET for pagination
        const offset = (pageNumber - 1) * pageSize;

        // Call the GetAppointmentHistory stored procedure with pagination
        const [result] = await pool.query("CALL GetAppointmentHistoryWithPagination(?, ?, ?)", [
            patientId,
            limit,
            offset,
        ]);

        // Extract data
        const appointments = result[0]; // Appointment records
        const totalRecords = result[1]?.[0]?.total || 0; // Total count of records

        // Check if there are records
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointment history found for the given patient." });
        }

        // Return paginated data
        res.status(200).json({
            success: true,
            appointments,
            pagination: {
                currentPage: pageNumber,
                pageSize,
                totalRecords,
                totalPages: Math.ceil(totalRecords / pageSize),
            },
        });
    } catch (error) {
        console.error("Error fetching appointment history:", error.message);
        res.status(500).json({ message: "Server error fetching appointment history" });
    }
};
// Get patient profile
exports.getPatientProfile = async (req, res) => {
    try {
        const {id} = req.user; // From JWT token

        // Call the GetPatientProfile stored procedure
        const [result] = await pool.query("CALL GetPatientProfile(?)", [id]);

        if (result[0].length === 0) {
            return res.status(404).json({ message: "Patient profile not found." });
        }

        res.status(200).json({
            success: true,
            profile: result[0][0]
        });
    } catch (error) {
        console.error("Error fetching patient profile:", error.message);
        res.status(500).json({ message: "Server error fetching patient profile" });
    }
};
const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Trả về định dạng yyyy-MM-dd
};
// Update patient profile
exports.updatePatientProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const {
            name,
            date_of_birth, // Lấy date_of_birth từ request body
            gender,
            address,
            email,
            phone,
            emergency_contact,
            emergency_phone,
            medical_history
        } = req.body;

        // Chuyển đổi date_of_birth sang định dạng yyyy-MM-dd
        const formattedDateOfBirth = formatDateForMySQL(date_of_birth);

        // Input validation
        if (!name || !date_of_birth || !gender || !address || !email || !phone) {
            return res.status(400).json({ message: "Required fields are missing." });
        }
        console.log("SQL Data:", {
            id, name, date_of_birth, gender, address, email, phone, emergency_contact, emergency_phone, medical_history
        });
        // Call the UpdatePatientProfile stored procedure
        await pool.query(
            "CALL UpdatePatientProfile(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                id,
                name,
                formattedDateOfBirth, // Truyền dạng yyyy-MM-dd
                gender,
                address,
                email,
                phone,
                emergency_contact,
                emergency_phone,
                medical_history
            ]
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        if (error.sqlState === '45000') {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error updating patient profile:", error.message);
        res.status(500).json({ message: "Server error updating patient profile" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.user; // Lấy ID user từ req.user
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Yêu cầu mật khẩu cũ và mật khẩu mới"
            });
        }

        // Lấy thông tin tài khoản hiện tại
        const [rows] = await pool.query(
            'SELECT password FROM accounts WHERE account_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy tài khoản"
            });
        }

        // Kiểm tra mật khẩu cũ
        const isValidPassword = await bcrypt.compare(oldPassword, rows[0].password);

        if (!isValidPassword) {
            return res.status(400).json({
                message: "Mật khẩu cũ không chính xác"
            });
        }

        // Hash mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới bằng procedure
        await pool.query('CALL ChangePatientPassword(?, ?)', [id, hashedNewPassword]);

        // Trả về kết quả thành công
        res.status(200).json({
            success: true,
            message: "Đổi mật khẩu thành công"
        });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({
            message: "Lỗi server khi đổi mật khẩu",
            error: error.message
        });
    }
};

// Deactivate account
exports.deactivateAccount = async (req, res) => {
    try {
        const {id} = req.user?.id;

        // Call the DeactivatePatientAccount stored procedure
        await pool.query("CALL DeactivatePatientAccount(?)", [id]);

        res.status(200).json({
            success: true,
            message: "Account deactivated successfully"
        });
    } catch (error) {
        console.error("Error deactivating account:", error.message);
        res.status(500).json({ message: "Server error deactivating account" });
    }
};

// Activate account
exports.activateAccount = async (req, res) => {
    try {
        const {id} = req.user?.id;

        // Call the ActivatePatientAccount stored procedure
        await pool.query("CALL ActivatePatientAccount(?)", [id]);

        res.status(200).json({
            success: true,
            message: "Account activated successfully"
        });
    } catch (error) {
        console.error("Error activating account:", error.message);
        res.status(500).json({ message: "Server error activating account" });
    }
};
