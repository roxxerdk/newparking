// In-memory database simulation
const parkingSpots = new Map();
const bookings = new Map();
const reviews = new Map();
const payments = new Map();

// Initialize with some mock data
parkingSpots.set('1', {
    id: '1',
    name: 'CMR IT parking slot',
    address: '#132, AECS Layout Cross, Bengaluru',
    location: { lat: 40.7128, lng: -74.0060 },
    price: 15,
    capacity: 50,
    availableSpots: 30,
    amenities: ['covered', 'security', 'ev'],
    rating: 4.5,
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=ETV3NJ%2fT&id=A19C2EE5D35C1372C1CE34779913FE9DF919CEFF&thid=OIP.ETV3NJ_T3VB1PnuhHqNq6gHaFj&mediaurl=https%3a%2f%2fimgk.timesnownews.com%2fstory%2f1200_x_900_9_7.png&exph=900&expw=1200&q=parking+slot+images&simid=608028342106542965&FORM=IRPRST&ck=E0688E5BC46FD10D872C2A46C2C67B15&selectedIndex=54&itb=0'
});

parkingSpots.set('2', {
    id: '2',
    name: 'Central Plaza Parking',
    address: '456 Market St, Central',
    location: { lat: 40.7589, lng: -73.9851 },
    price: 12,
    capacity: 75,
    availableSpots: 45,
    amenities: ['ev'],
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819dd313?auto=format&fit=crop&w=800&q=80'
});

// Database operations
module.exports = {
    // Parking Spots
    searchParkingSpots: (location, date, time) => {
        // In a real application, this would use geolocation and availability checks
        return Array.from(parkingSpots.values()).filter(spot => 
            spot.availableSpots > 0
        );
    },

    getParkingSpot: (id) => {
        return parkingSpots.get(id);
    },

    updateSpotAvailability: (id, change) => {
        const spot = parkingSpots.get(id);
        if (spot) {
            spot.availableSpots += change;
            parkingSpots.set(id, spot);
            return true;
        }
        return false;
    },

    // Bookings
    createBooking: (spotId, userId, startTime, endTime) => {
        const bookingId = Date.now().toString();
        const booking = {
            id: bookingId,
            spotId,
            userId,
            startTime,
            endTime,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        bookings.set(bookingId, booking);
        return booking;
    },

    getUserBookings: (userId) => {
        return Array.from(bookings.values()).filter(booking => 
            booking.userId === userId
        );
    },

    updateBookingStatus: (bookingId, status) => {
        const booking = bookings.get(bookingId);
        if (booking) {
            booking.status = status;
            bookings.set(bookingId, booking);
            return booking;
        }
        return null;
    },

    // Reviews
    createReview: (spotId, userId, rating, comment) => {
        const reviewId = Date.now().toString();
        const review = {
            id: reviewId,
            spotId,
            userId,
            rating,
            comment,
            createdAt: new Date().toISOString()
        };
        reviews.set(reviewId, review);

        // Update spot rating
        const spot = parkingSpots.get(spotId);
        if (spot) {
            const spotReviews = Array.from(reviews.values()).filter(r => r.spotId === spotId);
            const avgRating = spotReviews.reduce((sum, r) => sum + r.rating, 0) / spotReviews.length;
            spot.rating = Math.round(avgRating * 10) / 10;
            parkingSpots.set(spotId, spot);
        }

        return review;
    },

    getSpotReviews: (spotId) => {
        return Array.from(reviews.values()).filter(review => 
            review.spotId === spotId
        );
    },

    // Payments
    processPayment: (bookingId, paymentMethod, amount) => {
        const paymentId = Date.now().toString();
        const payment = {
            id: paymentId,
            bookingId,
            paymentMethod,
            amount,
            status: 'completed', // In real app, this would depend on payment gateway response
            timestamp: new Date().toISOString()
        };
        payments.set(paymentId, payment);

        // Update booking status
        const booking = bookings.get(bookingId);
        if (booking) {
            booking.status = 'confirmed';
            booking.paymentId = paymentId;
            bookings.set(bookingId, booking);
        }

        return payment;
    },

    getPayment: (paymentId) => {
        return payments.get(paymentId);
    }
};
