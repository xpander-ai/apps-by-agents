// DOM Elements
const travelForm = document.getElementById('travel-form');
const resultsSection = document.getElementById('results-section');
const editPlanBtn = document.getElementById('edit-plan');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const destinationDisplay = document.getElementById('destination-display');
const tripDates = document.getElementById('trip-dates');
const itineraryContainer = document.getElementById('itinerary-container');
const accommodationsContainer = document.getElementById('accommodations-container');
const tipsContainer = document.getElementById('tips-container');

// Data storage
let travelData = {};
let generatedPlan = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;
    
    // Load saved data from localStorage if available
    loadSavedData();
    
    // Event listeners
    travelForm.addEventListener('submit', handleFormSubmit);
    editPlanBtn.addEventListener('click', editPlan);
    
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
});

// Load saved data from localStorage
function loadSavedData() {
    const savedTravelData = localStorage.getItem('smartTravel_travelData');
    const savedGeneratedPlan = localStorage.getItem('smartTravel_generatedPlan');
    
    if (savedTravelData && savedGeneratedPlan) {
        travelData = JSON.parse(savedTravelData);
        generatedPlan = JSON.parse(savedGeneratedPlan);
        
        // Fill form with saved data
        document.getElementById('destination').value = travelData.destination;
        document.getElementById('start-date').value = travelData.startDate;
        document.getElementById('end-date').value = travelData.endDate;
        document.getElementById('adults').value = travelData.adults;
        document.getElementById('children').value = travelData.children;
        document.getElementById('transportation').value = travelData.transportation;
        document.getElementById('travel-style').value = travelData.travelStyle;
        
        // Display the generated plan
        displayResults();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    travelData = {
        destination: document.getElementById('destination').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        adults: parseInt(document.getElementById('adults').value),
        children: parseInt(document.getElementById('children').value),
        transportation: document.getElementById('transportation').value,
        travelStyle: document.getElementById('travel-style').value
    };
    
    // Generate travel plan
    generateTravelPlan();
    
    // Save data to localStorage
    localStorage.setItem('smartTravel_travelData', JSON.stringify(travelData));
    localStorage.setItem('smartTravel_generatedPlan', JSON.stringify(generatedPlan));
    
    // Display results
    displayResults();
}

// Generate travel plan based on user inputs
function generateTravelPlan() {
    // Calculate trip duration
    const startDate = new Date(travelData.startDate);
    const endDate = new Date(travelData.endDate);
    const tripDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate itinerary based on destination and preferences
    const itinerary = generateItinerary(tripDuration);
    
    // Generate accommodation recommendations
    const accommodations = generateAccommodations();
    
    // Generate local tips
    const tips = generateLocalTips();
    
    // Store the generated plan
    generatedPlan = {
        itinerary,
        accommodations,
        tips
    };
}

// Generate day-by-day itinerary
function generateItinerary(days) {
    const itinerary = [];
    const destination = travelData.destination;
    const travelStyle = travelData.travelStyle;
    
    // Destination-specific attractions and activities
    const attractions = getDestinationAttractions(destination, travelStyle);
    
    // Generate itinerary for each day
    for (let day = 1; day <= days; day++) {
        const dayDate = new Date(travelData.startDate);
        dayDate.setDate(dayDate.getDate() + day - 1);
        
        const dayActivities = [];
        
        // Morning activity
        dayActivities.push({
            time: '9:00 AM',
            activity: attractions.morning[day % attractions.morning.length],
            description: `Explore ${attractions.morning[day % attractions.morning.length]} and enjoy the local atmosphere.`
        });
        
        // Lunch
        dayActivities.push({
            time: '1:00 PM',
            activity: attractions.lunch[day % attractions.lunch.length],
            description: `Enjoy a delicious meal at ${attractions.lunch[day % attractions.lunch.length]}.`
        });
        
        // Afternoon activity
        dayActivities.push({
            time: '3:00 PM',
            activity: attractions.afternoon[day % attractions.afternoon.length],
            description: `Visit ${attractions.afternoon[day % attractions.afternoon.length]} and discover its unique features.`
        });
        
        // Evening activity
        dayActivities.push({
            time: '7:00 PM',
            activity: attractions.evening[day % attractions.evening.length],
            description: `Experience ${attractions.evening[day % attractions.evening.length]} for a memorable evening.`
        });
        
        itinerary.push({
            day,
            date: dayDate.toDateString(),
            activities: dayActivities
        });
    }
    
    return itinerary;
}

// Generate accommodation recommendations
function generateAccommodations() {
    const destination = travelData.destination;
    const travelStyle = travelData.travelStyle;
    
    // Get accommodations based on destination and travel style
    return getDestinationAccommodations(destination, travelStyle);
}

// Generate local tips
function generateLocalTips() {
    const destination = travelData.destination;
    
    // Get tips based on destination
    return getDestinationTips(destination);
}

// Display results
function displayResults() {
    // Update header information
    destinationDisplay.textContent = travelData.destination;
    
    const startDate = new Date(travelData.startDate).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    const endDate = new Date(travelData.endDate).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    tripDates.textContent = `${startDate} - ${endDate}`;
    
    // Render itinerary
    renderItinerary();
    
    // Render accommodations
    renderAccommodations();
    
    // Render tips
    renderTips();
    
    // Show results section
    travelForm.parentElement.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

// Render itinerary
function renderItinerary() {
    itineraryContainer.innerHTML = '';
    
    generatedPlan.itinerary.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        const dayHeader = document.createElement('h4');
        dayHeader.innerHTML = `<span>Day ${day.day}</span> <span>${day.date}</span>`;
        dayCard.appendChild(dayHeader);
        
        day.activities.forEach(activity => {
            const activityDiv = document.createElement('div');
            activityDiv.className = 'activity';
            
            activityDiv.innerHTML = `
                <p class="activity-time">${activity.time} - ${activity.activity}</p>
                <p>${activity.description}</p>
            `;
            
            dayCard.appendChild(activityDiv);
        });
        
        itineraryContainer.appendChild(dayCard);
    });
}

// Render accommodations
function renderAccommodations() {
    accommodationsContainer.innerHTML = '';
    
    generatedPlan.accommodations.forEach(accommodation => {
        const accommodationCard = document.createElement('div');
        accommodationCard.className = 'accommodation-card';
        
        accommodationCard.innerHTML = `
            <div class="accommodation-img" style="background-image: url(${accommodation.image})"></div>
            <div class="accommodation-details">
                <h4 class="accommodation-name">${accommodation.name}</h4>
                <div class="accommodation-rating">${generateStars(accommodation.rating)}</div>
                <div class="accommodation-price">${accommodation.price}</div>
                <div class="accommodation-location">
                    <i class="fas fa-map-marker-alt"></i> ${accommodation.location}
                </div>
                <p>${accommodation.description}</p>
                <div class="accommodation-features">
                    ${accommodation.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            </div>
        `;
        
        accommodationsContainer.appendChild(accommodationCard);
    });
}

// Render tips
function renderTips() {
    tipsContainer.innerHTML = '';
    
    Object.entries(generatedPlan.tips).forEach(([category, tips]) => {
        const tipCategory = document.createElement('div');
        tipCategory.className = 'tip-category';
        
        tipCategory.innerHTML = `<h4>${category}</h4>`;
        
        tips.forEach(tip => {
            const tipItem = document.createElement('div');
            tipItem.className = 'tip-item';
            
            tipItem.innerHTML = `
                <div class="tip-icon"><i class="${tip.icon}"></i></div>
                <div class="tip-content">${tip.content}</div>
            `;
            
            tipCategory.appendChild(tipItem);
        });
        
        tipsContainer.appendChild(tipCategory);
    });
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Switch between tabs
function switchTab(tabId) {
    // Update active tab button
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update active tab content
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Edit plan
function editPlan() {
    travelForm.parentElement.classList.remove('hidden');
    resultsSection.classList.add('hidden');
}

// Destination-specific data functions
function getDestinationAttractions(destination, travelStyle) {
    // This would ideally come from an API, but for this example we'll use hardcoded data
    const defaultAttractions = {
        morning: [
            'Local Museum',
            'Historic Downtown',
            'Botanical Gardens',
            'Scenic Viewpoint',
            'Cultural Center'
        ],
        lunch: [
            'Café Central',
            'Market Food Hall',
            'Riverside Restaurant',
            'Local Bistro',
            'Street Food Market'
        ],
        afternoon: [
            'City Park',
            'Shopping District',
            'Art Gallery',
            'Historic Monument',
            'Local Workshop'
        ],
        evening: [
            'Sunset Cruise',
            'Local Theater',
            'Night Market',
            'Rooftop Bar',
            'Cultural Performance'
        ]
    };
    
    // Customize based on destination (simplified for demo)
    if (destination.toLowerCase().includes('paris')) {
        return {
            morning: [
                'Louvre Museum',
                'Eiffel Tower',
                'Notre-Dame Cathedral',
                'Montmartre',
                'Sainte-Chapelle'
            ],
            lunch: [
                'Café de Flore',
                'Le Comptoir du Relais',
                'Chez Janou',
                'L\'As du Fallafel',
                'Breizh Café'
            ],
            afternoon: [
                'Champs-Élysées',
                'Luxembourg Gardens',
                'Centre Pompidou',
                'Musée d\'Orsay',
                'Père Lachaise Cemetery'
            ],
            evening: [
                'Seine River Cruise',
                'Moulin Rouge',
                'Le Marais District',
                'Eiffel Tower Light Show',
                'Opera Garnier'
            ]
        };
    } else if (destination.toLowerCase().includes('new york')) {
        return {
            morning: [
                'Central Park',
                'Metropolitan Museum of Art',
                'Empire State Building',
                'Brooklyn Bridge',
                'High Line'
            ],
            lunch: [
                'Chelsea Market',
                'Katz\'s Delicatessen',
                'Shake Shack',
                'Grand Central Market',
                'Eataly'
            ],
            afternoon: [
                'Times Square',
                'SoHo Shopping',
                'Museum of Modern Art',
                'Statue of Liberty',
                'Greenwich Village'
            ],
            evening: [
                'Broadway Show',
                'Rooftop Bar Tour',
                'Little Italy Dinner',
                'Jazz Club in Harlem',
                'Sunset at One World Observatory'
            ]
        };
    }
    
    // Default attractions if destination not specifically handled
    return defaultAttractions;
}

function getDestinationAccommodations(destination, travelStyle) {
    // This would ideally come from an API, but for this example we'll use hardcoded data
    const defaultAccommodations = [
        {
            name: 'City Center Hotel',
            rating: 4.5,
            price: '$120 per night',
            location: 'Downtown',
            description: 'Comfortable hotel in the heart of the city with easy access to main attractions.',
            features: ['Free WiFi', 'Breakfast included', 'Fitness center'],
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
            name: 'Riverside Inn',
            rating: 4,
            price: '$95 per night',
            location: 'Riverside District',
            description: 'Charming inn with beautiful views and a peaceful atmosphere.',
            features: ['River view', 'Restaurant', 'Free parking'],
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
            name: 'Modern Apartments',
            rating: 4.2,
            price: '$150 per night',
            location: 'Arts District',
            description: 'Fully equipped apartments perfect for families or longer stays.',
            features: ['Kitchen', 'Washer/Dryer', 'Living area'],
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
    ];
    
    // Customize based on destination and travel style
    if (destination.toLowerCase().includes('paris')) {
        if (travelStyle === 'luxury') {
            return [
                {
                    name: 'Hôtel Plaza Athénée',
                    rating: 5,
                    price: '$850 per night',
                    location: 'Avenue Montaigne, 8th Arrondissement',
                    description: 'Iconic luxury hotel with stunning views of the Eiffel Tower and exceptional service.',
                    features: ['Michelin-star restaurant', 'Spa', 'Concierge service'],
                    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Le Meurice',
                    rating: 5,
                    price: '$780 per night',
                    location: 'Rue de Rivoli, 1st Arrondissement',
                    description: 'Palace hotel combining 18th-century elegance with modern comfort, facing the Tuileries Garden.',
                    features: ['Butler service', 'Fine dining', 'Luxury spa'],
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Four Seasons Hotel George V',
                    rating: 5,
                    price: '$950 per night',
                    location: 'Avenue George V, 8th Arrondissement',
                    description: 'Art-deco landmark offering spacious rooms and suites just steps from the Champs-Elysées.',
                    features: ['Three restaurants', 'Floral arrangements', 'Wine cellar'],
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }
            ];
        } else if (travelStyle === 'budget') {
            return [
                {
                    name: 'Hôtel Jeanne d\'Arc Le Marais',
                    rating: 3.5,
                    price: '$120 per night',
                    location: 'Le Marais, 4th Arrondissement',
                    description: 'Charming budget hotel in the heart of the historic Marais district.',
                    features: ['Free WiFi', 'Air conditioning', 'Close to metro'],
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Ibis Paris Bastille Opéra',
                    rating: 3,
                    price: '$95 per night',
                    location: 'Bastille, 11th Arrondissement',
                    description: 'Modern budget hotel near Bastille with easy access to major attractions.',
                    features: ['Breakfast available', '24-hour reception', 'Bar'],
                    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Generator Paris',
                    rating: 4,
                    price: '$80 per night',
                    location: 'Canal Saint-Martin, 10th Arrondissement',
                    description: 'Stylish hostel with private rooms and a rooftop terrace overlooking Montmartre.',
                    features: ['Shared kitchen', 'Social events', 'Budget-friendly'],
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }
            ];
        }
    }
    
    // Default accommodations if destination or travel style not specifically handled
    return defaultAccommodations;
}

function getDestinationTips(destination) {
    // This would ideally come from an API, but for this example we'll use hardcoded data
    const defaultTips = {
        'Cultural Etiquette': [
            {
                icon: 'fas fa-handshake',
                content: 'Greet locals with a smile and a friendly hello in the local language.'
            },
            {
                icon: 'fas fa-camera',
                content: 'Always ask permission before taking photos of people or private property.'
            },
            {
                icon: 'fas fa-volume-down',
                content: 'Keep your voice down in public spaces, especially on public transportation.'
            }
        ],
        'Getting Around': [
            {
                icon: 'fas fa-subway',
                content: 'Public transportation is usually the most efficient way to explore the city.'
            },
            {
                icon: 'fas fa-walking',
                content: 'Many attractions are within walking distance of each other in the city center.'
            },
            {
                icon: 'fas fa-taxi',
                content: 'Use official taxis or ride-sharing apps to ensure fair pricing.'
            }
        ],
        'Money Saving': [
            {
                icon: 'fas fa-ticket-alt',
                content: 'Look for city passes that include multiple attractions and public transportation.'
            },
            {
                icon: 'fas fa-utensils',
                content: 'Eat where the locals eat to find authentic food at better prices.'
            },
            {
                icon: 'fas fa-store',
                content: 'Shop at local markets for souvenirs rather than tourist shops.'
            }
        ]
    };
    
    // Customize based on destination
    if (destination.toLowerCase().includes('paris')) {
        return {
            'Cultural Etiquette': [
                {
                    icon: 'fas fa-handshake',
                    content: 'Always greet with "Bonjour" (or "Bonsoir" in the evening) before starting a conversation.'
                },
                {
                    icon: 'fas fa-volume-down',
                    content: 'Keep your voice down in public spaces. French people tend to speak more quietly in public.'
                },
                {
                    icon: 'fas fa-language',
                    content: 'Try to learn a few basic French phrases. Even a little effort is appreciated.'
                }
            ],
            'Getting Around': [
                {
                    icon: 'fas fa-subway',
                    content: 'The Paris Métro is extensive and efficient. Consider buying a carnet of 10 tickets for savings.'
                },
                {
                    icon: 'fas fa-bicycle',
                    content: 'Vélib\' is Paris\'s bike-sharing system and a great way to explore the city.'
                },
                {
                    icon: 'fas fa-walking',
                    content: 'Paris is a walkable city. Many attractions in central Paris are within walking distance.'
                }
            ],
            'Money Saving': [
                {
                    icon: 'fas fa-ticket-alt',
                    content: 'The Paris Museum Pass gives you access to over 50 museums and monuments.'
                },
                {
                    icon: 'fas fa-utensils',
                    content: 'Prix fixe lunch menus (formule) offer good value at many restaurants.'
                },
                {
                    icon: 'fas fa-wine-glass-alt',
                    content: 'Tap water (une carafe d\'eau) is free and safe to drink at restaurants.'
                }
            ],
            'Best Times': [
                {
                    icon: 'fas fa-clock',
                    content: 'Visit the Louvre on Wednesday or Friday evening when it\'s open late and less crowded.'
                },
                {
                    icon: 'fas fa-sun',
                    content: 'The best views from the Eiffel Tower are at sunset, but book tickets well in advance.'
                },
                {
                    icon: 'fas fa-umbrella',
                    content: 'Many shops and restaurants close in August when Parisians take their summer vacation.'
                }
            ]
        };
    } else if (destination.toLowerCase().includes('new york')) {
        return {
            'Cultural Etiquette': [
                {
                    icon: 'fas fa-walking',
                    content: 'Walk quickly and stay to the right on sidewalks and escalators.'
                },
                {
                    icon: 'fas fa-dollar-sign',
                    content: 'Tipping is expected: 15-20% at restaurants, $1-2 per drink at bars, $1-2 per bag for hotel porters.'
                },
                {
                    icon: 'fas fa-volume-up',
                    content: 'New Yorkers are more direct than rude. Don\'t take bluntness personally.'
                }
            ],
            'Getting Around': [
                {
                    icon: 'fas fa-subway',
                    content: 'The subway runs 24/7 and is the fastest way to get around. Buy a MetroCard for multiple rides.'
                },
                {
                    icon: 'fas fa-taxi',
                    content: 'Yellow cabs are plentiful but can be expensive during rush hour due to traffic.'
                },
                {
                    icon: 'fas fa-walking',
                    content: 'Manhattan is laid out in a grid system making it easy to navigate on foot.'
                }
            ],
            'Money Saving': [
                {
                    icon: 'fas fa-ticket-alt',
                    content: 'Many museums have "pay what you wish" days or free evening hours.'
                },
                {
                    icon: 'fas fa-hotdog',
                    content: 'Street food vendors offer delicious and affordable meals throughout the city.'
                },
                {
                    icon: 'fas fa-theater-masks',
                    content: 'TKTS booths sell same-day Broadway tickets at up to 50% off.'
                }
            ],
            'Safety Tips': [
                {
                    icon: 'fas fa-map',
                    content: 'Look confident even if you\'re lost. Step aside to check maps or phones.'
                },
                {
                    icon: 'fas fa-wallet',
                    content: 'Keep your wallet in your front pocket and be aware of your surroundings.'
                },
                {
                    icon: 'fas fa-subway',
                    content: 'Late at night, ride in subway cars with other passengers and near the conductor.'
                }
            ]
        };
    }
    
    // Default tips if destination not specifically handled
    return defaultTips;
}