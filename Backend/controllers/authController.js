const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  pool = require('../config/connectdatabase');
const { format } = require('date-fns');
const axios = require('axios');
const moment = require("moment");
// Register a new user
exports.registerpatient = async (req, res) => {
    const { username, password, email } = req.body;

    // Kiểm tra đầu vào
    if (!username || !password || !email) {
        return res.status(400).json({ msg: 'Tất cả các thông tin chưa được điền' });
    }

    try {
        // Kiểm tra tài khoản đã tồn tại
        const [rows] = await pool.query('SELECT * FROM accounts WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Gọi procedure CREATEACCOUNT với role cố định là 'PATIENT'
        await pool.query('CALL CREATEACCOUNT(?, ?, ?, ?)', [username, hashedPassword, email, 'PATIENT']);

        res.status(201).json({ message: 'Tài khoản bệnh nhân tạo thành công' });
    } catch (err) {
        console.error('Error registering patient:', err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

exports.registerdoctor = async (req, res) => {
    const { username, password, email } = req.body;

    // Kiểm tra đầu vào
    if (!username || !password || !email) {
        return res.status(400).json({ msg: 'Tất cả các thông tin chưa được điền' });
    }

    try {
        // Kiểm tra tài khoản đã tồn tại
        const [rows] = await pool.query('SELECT * FROM accounts WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Gọi procedure CREATEACCOUNT với role cố định là 'PATIENT'
        await pool.query('CALL CREATEACCOUNT(?, ?, ?, ?)', [username, hashedPassword, email, 'DOCTOR']);

        res.status(201).json({ message: 'Tài khoản bệnh nhân tạo thành công' });
    } catch (err) {
        console.error('Error registering patient:', err.message);
        res.status(500).send('Lỗi máy chủ');
    }
};


exports.login = async (req, res, role) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Yêu cầu email và password' });
        }

        // Tìm người dùng dựa trên email và role
        const [rows] = await pool.query(
            'SELECT * FROM accounts WHERE email = ? AND role = ?',
            [email, role]
        );

        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const lastLogin = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

                // Cập nhật last_login
                await pool.query('UPDATE accounts SET last_login = ? WHERE account_id = ?', [
                    lastLogin,
                    user.account_id,
                ]);

                let doctorId = null;
                let patientId = null;

                if (user.role === 'DOCTOR') {
                    const [doctorRows] = await pool.query(
                        'SELECT doctor_id FROM doctors WHERE account_id = ?',
                        [user.account_id]
                    );
                    if (doctorRows.length > 0) {
                        doctorId = doctorRows[0].doctor_id;
                    }
                } else if (user.role === 'PATIENT') {
                    const [patientRows] = await pool.query(
                        'SELECT patient_id FROM patients WHERE account_id = ?',
                        [user.account_id]
                    );
                    if (patientRows.length > 0) {
                        patientId = patientRows[0].patient_id;
                    }
                }

                // Tạo Access Token
                const accessToken = jwt.sign(
                    {
                        id: user.account_id,
                        email: user.email,
                        role: user.role,
                        doctorId: doctorId,
                        patientId: patientId
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );

                let refreshToken;
                // Kiểm tra refresh token hiện có
                const [checker] = await pool.query('CALL CheckRefreshToken(?)', [user.account_id]);

                if (checker[0].length === 0) {
                    // Tạo Refresh Token mới nếu chưa có
                    refreshToken = jwt.sign(
                        {
                            id: user.account_id,
                            email: user.email,
                            role: user.role,
                            doctorId: doctorId,
                            patientId: patientId
                        },
                        process.env.JWT_SECRET,
                        {expiresIn: '7d'}
                    );
                    const expiresInToken = moment().utc().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');

                    await pool.query(
                        'CALL CREATE_REFRESH_TOKEN(?, ?, ?)',
                        [user.account_id, refreshToken, expiresInToken]
                    );
                } else {
                    // Sử dụng refresh token hiện có
                    refreshToken = checker[0][0].refresh_token;
                }

                // Set cookie cho Access Token
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 3600000 * 24,
                });

                // Trả về response với đầy đủ thông tin
                return res.json({
                    message: 'Đăng nhập thành công',
                    user: {
                        id: user.account_id,
                        email: user.email,
                        role: user.role,
                        doctorId: doctorId,
                        patientId: patientId
                    },
                    accessToken,
                    refreshToken
                });
            } else {
                return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
            }
        } else {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh Token không hợp lệ' });
        }

        // Kiểm tra Refresh Token và join với bảng accounts để lấy thông tin user
        const [rows] = await pool.query(
            `SELECT rt.*, a.email, a.role 
             FROM refreshtokens rt 
             JOIN accounts a ON rt.account_id = a.account_id 
             WHERE rt.refresh_token = ?`,
            [refreshToken]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'Refresh Token không hợp lệ' });
        }

        const user = rows[0];

        // Verify refresh token
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

            // Tạo access token mới
            const accessToken = jwt.sign(
                {
                    id: user.account_id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            // Trả về access token mới
            return res.json({
                isAuthenticated: false,
                accessToken
            });

        } catch (err) {
            // Nếu refresh token hết hạn, xóa nó khỏi database
            await pool.query('DELETE FROM refreshtokens WHERE refresh_token = ?', [refreshToken]);
            return res.status(403).json({ message: 'Refresh Token hết hạn hoặc không hợp lệ' });
        }
    } catch (error) {
        console.error('Refresh Token Error:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// exports.facebookLogin = async (req, res) => {
//     const {accessToken} = req.body;
//     if (!accessToken) {
//         return res.status(400).json({message: 'Missing access token'});
//     }
//     const response = await axios.get(`https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`);
//     const {id, name, email} = response.data;
//     if (!id || !name || !email) {
//         return res.status(400).json({message: 'Invalid access token'});
//     }
// }


exports.logout = async (req, res) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
};
// In your authController
exports.verifyToken = async (req, res) => {
    try {
        // If the request reaches here, the token is valid
        return res.json({
            isAuthenticated: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
                doctorId: req.user.doctorId, // Lấy doctorId từ token (nếu có)
                patientId: req.user.patientId // Lấy patientId từ token (nếu có)
            }
        });
    } catch (error) {
        return res.status(401).json({
            isAuthenticated: false,
            message: 'Invalid token'
        });
    }
};
exports.verifyAccessToken = async (req, res) => {
    try {
        const accessToken =
            req.cookies.accessToken ||
            req.headers['authorization']?.split(' ')[1] ||
            req.body.token;

        if (!accessToken) {
            return res.status(403).json({
                message: 'Token is missing',
                details: 'No token found in cookies, headers, or request body'
            });
        }

        // Decode và trả về thông tin
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        // Trả về thông tin đã decode
        return res.json({
            message: 'Token hợp lệ',
            isAuthenticated: true,
            user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                doctorId: decoded.doctorId,
                patientId: decoded.patientId
            },
            exp: decoded.exp,
            iat: decoded.iat
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token đã hết hạn',
                error: 'expired'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token không hợp lệ',
                error: 'invalid'
            });
        }

        console.error('Token verification error:', error);
        return res.status(401).json({
            message: 'Token không hợp lệ hoặc đã hết hạn',
            error: error.message
        });
    }
};

// Get user data
exports.getAllUser = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM accounts');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getUserById = async (req, res) => {
    try {
        const { account_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM accounts WHERE account_id = ?', [account_id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.updateUser = async (req, res) => {
    try {
        const { userid } = req.params;
        const { username, email, password } = req.body;
        await pool.query('UPDATE accounts SET username = ?, email = ?, password=? WHERE account_id = ?', [username, email,password, userid]);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.deleteUser = async (req, res) => {
    try {
        const { userid } = req.params;
        await pool.query('DELETE FROM accounts WHERE accounts.account_id = ?', [userid]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
exports.getUserByRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await pool.query('SELECT * FROM accounts where role = ?', [role]);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
