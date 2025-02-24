// DOM Elements
const searchForm = document.getElementById('searchForm');
const filterForm = document.getElementById('filterForm');
const resultsGrid = document.getElementById('resultsGrid');
const featuredSpots = document.getElementById('featuredSpots');

// Mock Data (In real application, this would come from an API)
const mockParkingSpots = [
    {
        id: 1,
        name: "Downtown Secure Parking",
        address: "123 Main St, Downtown",
        price: 15,
        distance: 0.5,
        rating: 4.5,
        amenities: ["covered", "security"],
        image: "https://images.unsplash.com/photo-1590674899484-13da0d1b58c5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Central Plaza Parking",
        address: "456 Market St, Central",
        price: 12,
        distance: 1.2,
        rating: 4.2,
        amenities: ["ev"],
        image: "https://images.unsplash.com/photo-1573348722427-f1d6819dd313?auto=format&fit=crop&w=800&q=80"
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeFeaturedSpots();
    setupEventListeners();
    // Set today's date as minimum for date input
    document.getElementById('date').min = new Date().toISOString().split('T')[0];
});

function setupEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
    filterForm.addEventListener('change', handleFilterChange);
}

// Search Handler
async function handleSearch(e) {
    e.preventDefault();
    
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    try {
        showLoading();
        // In a real application, this would be an API call
        const results = await mockSearchAPI(location, date, time);
        displaySearchResults(results);
    } catch (error) {
        showError('An error occurred while searching. Please try again.');
    } finally {
        hideLoading();
    }
}

// Filter Handler
function handleFilterChange() {
    const priceRange = document.getElementById('priceRange').value;
    const distance = document.getElementById('distance').value;
    const covered = document.getElementById('covered').checked;
    const ev = document.getElementById('ev').checked;
    const security = document.getElementById('security').checked;

    const filteredResults = mockParkingSpots.filter(spot => {
        const meetsPrice = spot.price <= priceRange;
        const meetsDistance = spot.distance <= distance;
        const meetsAmenities = (!covered || spot.amenities.includes('covered')) &&
                              (!ev || spot.amenities.includes('ev')) &&
                              (!security || spot.amenities.includes('security'));
        
        return meetsPrice && meetsDistance && meetsAmenities;
    });

    displaySearchResults(filteredResults);
}

// Display Functions
function displaySearchResults(spots) {
    resultsGrid.innerHTML = spots.map(spot => `
        <div class="col-md-6 col-lg-4">
            <div class="parking-spot-card card">
                <img src="${spot.image}" alt="${spot.name}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${spot.name}</h5>
                    <p class="card-text">${spot.address}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">$${spot.price}/hr</span>
                        <span class="badge bg-primary">${spot.distance}km away</span>
                    </div>
                    <div class="mt-3">
                        ${displayRating(spot.rating)}
                    </div>
                    <div class="mt-3">
                        ${displayAmenities(spot.amenities)}
                    </div>
                    <button class="btn btn-primary w-100 mt-3" onclick="handleBooking(${spot.id})">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function initializeFeaturedSpots() {
    featuredSpots.innerHTML = mockParkingSpots.slice(0, 3).map(spot => `
        <div class="col-md-4">
            <div class="featured-spot">
                <img src="${spot.image}" alt="${spot.name}">
                <span class="featured-badge">Featured</span>
                <div class="card-body">
                    <h5>${spot.name}</h5>
                    <p class="price">$${spot.price}/hr</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function displayRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return `
        <div class="rating">
            ${'★'.repeat(fullStars)}
            ${hasHalfStar ? '½' : ''}
            ${'☆'.repeat(emptyStars)}
            <span class="ms-2">${rating}</span>
        </div>
    `;
}

function displayAmenities(amenities) {
    const amenityIcons = {
        covered: '🏢 Covered',
        ev: '⚡ EV Charging',
        security: '🔒 24/7 Security'
    };

    return `
        <div class="amenities">
            ${amenities.map(amenity => `
                <span class="badge bg-secondary me-1">
                    ${amenityIcons[amenity]}
                </span>
            `).join('')}
        </div>
    `;
}

function showLoading() {
    resultsGrid.classList.add('loading');
}

function hideLoading() {
    resultsGrid.classList.remove('loading');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    resultsGrid.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Mock API Function (In real application, this would be replaced with actual API calls)
async function mockSearchAPI(location, date, time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockParkingSpots);
        }, 1000);
    });
}

// Booking Handler (To be implemented)
function handleBooking(spotId) {
    // Show booking modal or navigate to booking page
    alert(`Booking functionality coming soon! Spot ID: ${spotId}`);
}

// Initialize price range value display
const priceRange = document.getElementById('priceRange');
if (priceRange) {
    const priceDisplay = document.createElement('span');
    priceDisplay.className = 'ms-2';
    priceRange.parentNode.appendChild(priceDisplay);
    
    const updatePriceDisplay = () => {
        priceDisplay.textContent = `$${priceRange.value}`;
    };
    
    priceRange.addEventListener('input', updatePriceDisplay);
    updatePriceDisplay();
}
