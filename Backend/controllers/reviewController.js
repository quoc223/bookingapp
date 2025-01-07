const  pool = require('../config/connectdatabase');
exports.getReviewsWithResponses = async (req, res) => {
    try {
        const doctor_id = req.user.id; // Assuming authenticated doctor

        // Call procedure to get reviews with responses
        const [results] = await pool.query('CALL GetReviewsWithResponses(?)', [doctor_id]);

        // Parse doctor_responses JSON
        const reviewsWithParsedResponses = results.map(review => ({
            ...review,
            doctor_responses: review.doctor_responses
                ? JSON.parse(review.doctor_responses)
                : []
        }));

        res.status(200).json({
            reviews: reviewsWithParsedResponses
        });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Server error while fetching reviews' });
    }
};
// Get reviews for a specific doctor
exports.getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const [reviews] = await pool.query(
            'CALL GetDoctorReviews(?)',
            [doctorId]
        );

        res.json(reviews[0]);
    } catch (err) {
        console.error('Get Doctor Reviews Error:', err.message);
        res.status(500).send('Server error fetching doctor reviews');
    }
};

exports.createReview = async (req, res) => {
    try {
        const {
            rating,
            comment,
            reviewType
        } = req.body;

        // Get reviewer's ID and role from the auth token
        const reviewerId = req.user?.id || null;
        const reviewedId = req.user?.id || null;
        const reviewerRole = req.user?.role || null;

        // Validate review type matches reviewer's role
        if ((reviewType === 'PATIENT_TO_DOCTOR' && reviewerRole !== 'PATIENT') ||
            (reviewType === 'DOCTOR_TO_PATIENT' && reviewerRole !== 'DOCTOR')) {
            return res.status(403).json({ message: 'Invalid review type for user role' });
        }

        const [rows] = await pool.query(
            'CALL CreateReview(?, ?, ?, ?, ?)',
            [reviewerId, reviewedId, rating, comment, reviewType]
        );

// Ensure the procedure returns the review ID in the expected format
        const reviewId = rows[0]?.[0]?.review_id;

        if (!reviewId) {
            return res.status(500).json({ message: 'Failed to retrieve review ID' });
        }

        res.status(201).json({
            message: 'Review created successfully',
            reviewId: reviewId
        });
    } catch (err) {
        console.error('Create Review Error:', err);
        res.status(500).json({
            message: 'Server error creating review',
            error: err.message
        });
    }
};

exports.getReviewsWithDetails = async (req, res) => {
    try {
        const { doctorId, reviewType } = req.query;

        const [rows] = await pool.query(
            'CALL GetReviewsWithDetails(?, ?)',
            [doctorId, reviewType]
        );

        res.json(rows[0] || []);
    } catch (err) {
        console.error('Get Reviews Error:', err);
        res.status(500).json({
            message: 'Server error fetching reviews',
            error: err.message
        });
    }
};

exports.calculateAverageRating = async (req, res) => {
    try {
        const { doctorId, ratingType } = req.query;
        const [doctorResult] = await pool.query(
            'SELECT account_id FROM doctors WHERE doctor_id = ?',
            [doctorId]
        );
        const accountId =  doctorResult[0].account_id;

        const [rows] = await pool.query(
            'CALL CalculateAverageRating(?, ?)',
            [accountId, ratingType]
        );

        res.json(rows[0][0]);
    } catch (err) {
        console.error('Calculate Rating Error:', err);
        res.status(500).json({
            message: 'Server error calculating rating',
            error: err.message
        });
    }
};
