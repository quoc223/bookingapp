// reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const {isPatient, isAnyUser,isDoctor} = require('../midelware/auth');

// Create a new review
router.post('/create',
    isAnyUser,
    reviewController.createReview
);

// Get reviews with details
router.get('/details',
    reviewController.getReviewsWithDetails
);

// Calculate average rating
router.get('/average-rating',
    reviewController.calculateAverageRating
);

module.exports = router;
