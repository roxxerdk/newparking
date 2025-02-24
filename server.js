const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')); // Request logging

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// API Endpoints

// Search parking spots
app.get('/api/parking', (req, res) => {
    try {
        const { location, date, time } = req.query;
        
        if (!location || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        const spots = db.searchParkingSpots(location, date, time);
        res.json({
            success: true,
            data: spots
        });
    } catch (error) {
        next(error);
    }
});

// Get parking spot details
app.get('/api/parking/:id', (req, res) => {
    try {
        const spot = db.getParkingSpot(req.params.id);
        
        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Parking spot not found'
            });
        }

        res.json({
            success: true,
            data: spot
        });
    } catch (error) {
        next(error);
    }
});

// Create booking
app.post('/api/bookings', (req, res) => {
    try {
        const { spotId, userId, startTime, endTime } = req.body;

        if (!spotId || !userId || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Missing required booking information'
            });
        }

        const booking = db.createBooking(spotId, userId, startTime, endTime);
        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
});

// Get user bookings
app.get('/api/bookings/:userId', (req, res) => {
    try {
        const bookings = db.getUserBookings(req.params.userId);
        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
});

// Process payment
app.post('/api/payment', (req, res) => {
    try {
        const { bookingId, paymentMethod, amount } = req.body;

        if (!bookingId || !paymentMethod || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment information'
            });
        }

        const payment = db.processPayment(bookingId, paymentMethod, amount);
        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
});

// Submit review
app.post('/api/reviews', (req, res) => {
    try {
        const { spotId, userId, rating, comment } = req.body;

        if (!spotId || !userId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Missing review information'
            });
        }

        const review = db.createReview(spotId, userId, rating, comment);
        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
});

// Get parking spot reviews
app.get('/api/reviews/:spotId', (req, res) => {
    try {
        const reviews = db.getSpotReviews(req.params.spotId);
        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
});

// Error handling middleware should be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
