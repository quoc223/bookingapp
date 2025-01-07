const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const pool = require('../config/connectdatabase');
const authorizeRole = (requiredRoles = []) => {
    return (req, res, next) => {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ message: 'Token is missing' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Nếu là ADMIN thì luôn được truy cập
            if (decoded.role === 'ADMIN') {
                req.user = decoded;
                return next();
            }

            // Nếu có danh sách vai trò được phép và vai trò hiện tại không nằm trong đó
            if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
                return res.status(403).json({
                    message: `Access denied. Allowed roles: ${requiredRoles.join(', ')}`
                });
            }

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

// Sử dụng
const isPatient = authorizeRole(['PATIENT']);
const isDoctor = authorizeRole(['DOCTOR']);
const isAdmin = authorizeRole(['ADMIN']);
const isAnyUser = authorizeRole(['PATIENT', 'DOCTOR']);
const isAny = authorizeRole();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log('Received Token:', token);

    if (!token) {
        return res.status(401).json({
            isAuthenticated: false,
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error);
        // Rest of the error handling code
    }
};
// Middleware to verify patient authentication


const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null; // Không có token thì gán null
        return next(); // Cho phép tiếp tục mà không trả lỗi
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null; // Token không hợp lệ hoặc hết hạn, gán null
        } else {
            req.user = user; // Token hợp lệ, gán thông tin người dùng
        }
        next();
    });
};


const validateAppointment = [
    // Validate name
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    // Validate dateOfBirth
    body("date_of_birth")
        .notEmpty()
        .withMessage("Date of birth is required")
        .isISO8601()
        .withMessage("Date of birth must be a valid ISO date")
        .custom((value) => {
            const date = new Date(value);
            const now = new Date();
            if (date > now) {
                throw new Error("Date of birth cannot be in the future");
            }
            return true;
        }),

    // Validate gender
    body("gender")
        .trim()
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["Male", "Female"])
        .withMessage("Gender must be Male or Female"),

    // Validate address
    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ max: 255 })
        .withMessage("Address must not exceed 255 characters"),

    // Validate email
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be valid")
        .normalizeEmail(),

    // Validate phone
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^(0[2-9])(\d{8,9})$/)
        .withMessage("Must be a valid Vietnamese phone number (10-11 digits starting with 02-09)"),

    // Validate emergency contact
    body("emergency_contact")
        .trim()
        .notEmpty()
        .withMessage("Emergency contact is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Emergency contact must be between 2 and 100 characters"),

    // Validate emergency phone
    body("emergency_phone")
        .trim()
        .notEmpty()
        .withMessage("Emergency phone is required")
        .matches(/^(0[2-9])(\d{8,9})$/)
        .withMessage("Must be a valid Vietnamese phone number (10-11 digits starting with 02-09)")
        .custom((value, { req }) => {
            // Check if emergency phone is the same as the main phone
            if (value === req.body.phone) {
                throw new Error("Emergency phone must be different from primary phone");
            }
            return true;
        }),

    // Validate medical history (optional)
    body("medical_history")
        .optional()
        .isString()
        .isLength({ max: 1000 })
        .withMessage("Medical history must not exceed 1000 characters"),

    // Validate doctor ID
    body("doctor_id")
        .notEmpty()
        .withMessage("Doctor ID is required")
        .isInt({ min: 1 })
        .withMessage("Doctor ID must be a valid positive integer"),

    // Validate appointmentDate
    body("appointment_date") // Ensure name matches frontend field (camelCase)
        .notEmpty()
        .withMessage("Appointment date is required")
        .isISO8601()
        .withMessage("Appointment date must be a valid ISO date")
        .custom((value) => {
            const date = new Date(value);
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Set current time to start of the day
            if (date < now) {
                throw new Error("Appointment date cannot be in the past");
            }
            return true;
        }),

    // Validate notes (optional)
    body("notes")
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage("Notes must not exceed 500 characters"),

    // Validate result middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    },
];



module.exports = { isPatient, isAdmin, isDoctor,isAny,isAnyUser,optionalAuth,authenticateToken, validateAppointment };
