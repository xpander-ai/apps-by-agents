// SmartTravel App JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const travelForm = document.getElementById('travel-form');
    const resultsSection = document.getElementById('results-section');
    const editPlanBtn = document.getElementById('edit-plan');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Initialize the app
    initApp();
    
    // Event Listeners
    travelForm.addEventListener('submit', handleFormSubmit);
    editPlanBtn.addEventListener('click', editPlan);
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Functions
    function initApp() {
        // Set today as the minimum date for start date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('start-date').min = today;
        document.getElementById('end-date').min = today;
        
        // Load saved travel plan if exists
        loadSavedPlan();
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            destination: document.getElementById('destination').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            adults: parseInt(document.getElementById('adults').value),
            children: parseInt(document.getElementById('children').value),
            transportation: document.getElementById('transportation').value,
            travelStyle: document.getElementById('travel-style').value
        };
        
        // Validate dates
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        
        if (end < start) {
            alert('End date cannot be before start date');
            return;
        }
        
        // Save to localStorage
        saveTravelPlan(formData);
        
        // Generate and display travel plan
        generateTravelPlan(formData);
        
        // Show results section
        travelForm.closest('.travel-form-section').classList.add('hidden');
        resultsSection.classList.remove('hidden');
    }
    
    function editPlan() {
        // Hide results and show form
        resultsSection.classList.add('hidden');
        travelForm.closest('.travel-form-section').classList.remove('hidden');
    }
    
    function switchTab(tabId) {
        // Update active tab button
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // Show selected tab content
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }
    
    function saveTravelPlan(formData) {
        localStorage.setItem('smartTravelPlan', JSON.stringify(formData));
    }
    
    function loadSavedPlan() {
        const savedPlan = localStorage.getItem('smartTravelPlan');
        
        if (savedPlan) {
            const formData = JSON.parse(savedPlan);
            
            // Fill form with saved data
            document.getElementById('destination').value = formData.destination;
            document.getElementById('start-date').value = formData.startDate;
            document.getElementById('end-date').value = formData.endDate;
            document.getElementById('adults').value = formData.adults;
            document.getElementById('children').value = formData.children;
            document.getElementById('transportation').value = formData.transportation;
            document.getElementById('travel-style').value = formData.travelStyle;
            
            // Generate travel plan
            generateTravelPlan(formData);
            
            // Show results section
            travelForm.closest('.travel-form-section').classList.add('hidden');
            resultsSection.classList.remove('hidden');
        }
    }
    
    function generateTravelPlan(formData) {
        // Update result header
        document.getElementById('result-destination').textContent = formData.destination;
        
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const options = { month: 'short', day: 'numeric' };
        
        document.getElementById('result-dates').textContent = 
            `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
        
        const travelers = formData.adults + (formData.adults > 1 ? ' adults' : ' adult') + 
                         (formData.children > 0 ? `, ${formData.children} ${formData.children > 1 ? 'children' : 'child'}` : '');
        
        document.getElementById('result-travelers').textContent = travelers;
        
        // Format travel style for display
        let travelStyleText = '';
        switch(formData.travelStyle) {
            case 'budget': travelStyleText = 'Budget-Friendly'; break;
            case 'luxury': travelStyleText = 'Luxury'; break;
            case 'nature': travelStyleText = 'Nature & Outdoors'; break;
            case 'city': travelStyleText = 'City Explorer'; break;
            case 'culture': travelStyleText = 'Cultural Experience'; break;
            case 'family': travelStyleText = 'Family-Friendly'; break;
            default: travelStyleText = formData.travelStyle;
        }
        
        document.getElementById('result-style').textContent = travelStyleText;
        
        // Generate itinerary
        generateItinerary(formData);
        
        // Generate accommodations
        generateAccommodations(formData);
        
        // Generate local tips
        generateLocalTips(formData);
    }
    
    function generateItinerary(formData) {
        const itineraryContainer = document.getElementById('itinerary-container');
        itineraryContainer.innerHTML = '';
        
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Mock data for attractions based on travel style and destination
        const attractions = getAttractionsByDestination(formData.destination, formData.travelStyle);
        
        // Generate day-by-day itinerary
        for (let i = 0; i < dayCount; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            
            const dayTitle = document.createElement('h3');
            dayTitle.className = 'day-title';
            dayTitle.textContent = `Day ${i + 1} - ${currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`;
            
            dayHeader.appendChild(dayTitle);
            dayCard.appendChild(dayHeader);
            
            // Add 3-4 activities per day
            const activitiesCount = 3 + Math.floor(Math.random() * 2); // 3 or 4 activities
            
            for (let j = 0; j < activitiesCount; j++) {
                const activityIndex = (i * activitiesCount + j) % attractions.length;
                const activity = attractions[activityIndex];
                
                const activityEl = document.createElement('div');
                activityEl.className = 'activity';
                
                const activityTime = document.createElement('div');
                activityTime.className = 'activity-time';
                
                // Generate reasonable time slots
                let timeSlot;
                if (j === 0) {
                    timeSlot = '9:00 AM - 11:00 AM';
                } else if (j === 1) {
                    timeSlot = '12:00 PM - 2:00 PM';
                } else if (j === 2) {
                    timeSlot = '3:00 PM - 5:00 PM';
                } else {
                    timeSlot = '7:00 PM - 9:00 PM';
                }
                
                activityTime.textContent = timeSlot;
                
                const activityTitle = document.createElement('h4');
                activityTitle.className = 'activity-title';
                activityTitle.textContent = activity.name;
                
                const activityDesc = document.createElement('p');
                activityDesc.textContent = activity.description;
                
                activityEl.appendChild(activityTime);
                activityEl.appendChild(activityTitle);
                activityEl.appendChild(activityDesc);
                
                dayCard.appendChild(activityEl);
            }
            
            itineraryContainer.appendChild(dayCard);
        }
    }
    
    function generateAccommodations(formData) {
        const accommodationsContainer = document.getElementById('accommodations-container');
        accommodationsContainer.innerHTML = '';
        
        // Mock data for accommodations based on travel style and destination
        const accommodations = getAccommodationsByDestination(formData.destination, formData.travelStyle);
        
        // Generate accommodation cards
        accommodations.forEach(accommodation => {
            const accommodationCard = document.createElement('div');
            accommodationCard.className = 'accommodation-card';
            
            const accommodationImage = document.createElement('div');
            accommodationImage.className = 'accommodation-image';
            accommodationImage.style.backgroundImage = `url(${accommodation.image})`;
            
            const accommodationDetails = document.createElement('div');
            accommodationDetails.className = 'accommodation-details';
            
            const accommodationName = document.createElement('h3');
            accommodationName.className = 'accommodation-name';
            accommodationName.textContent = accommodation.name;
            
            const accommodationRating = document.createElement('div');
            accommodationRating.className = 'accommodation-rating';
            
            // Generate stars based on rating
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                if (i < Math.floor(accommodation.rating)) {
                    star.className = 'fas fa-star';
                } else if (i < accommodation.rating) {
                    star.className = 'fas fa-star-half-alt';
                } else {
                    star.className = 'far fa-star';
                }
                accommodationRating.appendChild(star);
            }
            
            const accommodationPrice = document.createElement('div');
            accommodationPrice.className = 'accommodation-price';
            accommodationPrice.textContent = accommodation.price;
            
            const accommodationLocation = document.createElement('p');
            accommodationLocation.textContent = accommodation.location;
            
            const accommodationFeatures = document.createElement('div');
            accommodationFeatures.className = 'accommodation-features';
            
            accommodation.features.forEach(feature => {
                const featureEl = document.createElement('span');
                featureEl.className = 'feature';
                featureEl.textContent = feature;
                accommodationFeatures.appendChild(featureEl);
            });
            
            accommodationDetails.appendChild(accommodationName);
            accommodationDetails.appendChild(accommodationRating);
            accommodationDetails.appendChild(accommodationPrice);
            accommodationDetails.appendChild(accommodationLocation);
            accommodationDetails.appendChild(accommodationFeatures);
            
            accommodationCard.appendChild(accommodationImage);
            accommodationCard.appendChild(accommodationDetails);
            
            accommodationsContainer.appendChild(accommodationCard);
        });
    }
    
    function generateLocalTips(formData) {
        const tipsContainer = document.getElementById('tips-container');
        tipsContainer.innerHTML = '';
        
        // Mock data for local tips based on destination
        const tips = getLocalTipsByDestination(formData.destination);
        
        // Generate tip cards
        tips.forEach(tip => {
            const tipCard = document.createElement('div');
            tipCard.className = 'tip-card';
            
            const tipTitle = document.createElement('h3');
            tipTitle.className = 'tip-title';
            
            const tipIcon = document.createElement('i');
            tipIcon.className = tip.icon;
            
            tipTitle.appendChild(tipIcon);
            tipTitle.appendChild(document.createTextNode(tip.title));
            
            const tipContent = document.createElement('p');
            tipContent.textContent = tip.content;
            
            tipCard.appendChild(tipTitle);
            tipCard.appendChild(tipContent);
            
            tipsContainer.appendChild(tipCard);
        });
    }
    
    // Mock data generators
    function getAttractionsByDestination(destination, travelStyle) {
        // This would ideally come from an API, but for this demo we'll use mock data
        const attractions = {
            'Paris': [
                { name: 'Eiffel Tower', description: 'Iconic iron tower offering city views from observation decks.' },
                { name: 'Louvre Museum', description: 'World\'s largest art museum and historic monument housing the Mona Lisa.' },
                { name: 'Notre-Dame Cathedral', description: 'Medieval Catholic cathedral known for its French Gothic architecture.' },
                { name: 'Montmartre', description: 'Bohemian district with artists, cafes and the Sacré-Cœur Basilica.' },
                { name: 'Seine River Cruise', description: 'Scenic boat tour along the Seine River with views of Paris landmarks.' },
                { name: 'Champs-Élysées', description: 'Famous avenue known for luxury shops, cafés, and the Arc de Triomphe.' },
                { name: 'Palace of Versailles', description: 'Opulent royal château with gardens, just outside of Paris.' },
                { name: 'Centre Pompidou', description: 'Modern art museum with a distinctive architectural style.' }
            ],
            'Tokyo': [
                { name: 'Tokyo Skytree', description: 'Tallest tower in Japan offering panoramic views of the city.' },
                { name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa, Tokyo\'s oldest temple.' },
                { name: 'Shibuya Crossing', description: 'Famous busy intersection known as the world\'s busiest pedestrian crossing.' },
                { name: 'Meiji Shrine', description: 'Shinto shrine dedicated to Emperor Meiji and Empress Shoken.' },
                { name: 'Tsukiji Fish Market', description: 'Large wholesale market for fish, fruits and vegetables.' },
                { name: 'Akihabara', description: 'Shopping district for electronic, anime, manga and computer goods.' },
                { name: 'Tokyo Disneyland', description: 'Theme park based on the films produced by Walt Disney.' },
                { name: 'Ueno Park', description: 'Spacious public park with museums, a zoo, and beautiful cherry blossoms in spring.' }
            ],
            'New York': [
                { name: 'Statue of Liberty', description: 'Iconic copper statue gifted by France, symbolizing freedom and democracy.' },
                { name: 'Central Park', description: 'Urban park spanning 843 acres with walking paths, lakes, and attractions.' },
                { name: 'Empire State Building', description: '102-story skyscraper with observation decks offering city views.' },
                { name: 'Times Square', description: 'Bustling intersection famous for its bright lights, Broadway theaters, and shops.' },
                { name: 'Metropolitan Museum of Art', description: 'One of the world\'s largest and finest art museums.' },
                { name: 'Brooklyn Bridge', description: 'Historic bridge connecting Manhattan and Brooklyn with pedestrian walkway.' },
                { name: 'High Line', description: 'Elevated linear park created on a former freight rail line.' },
                { name: 'One World Observatory', description: 'Observation deck at the top of One World Trade Center.' }
            ]
        };
        
        // Default to New York if destination not found
        return attractions[destination] || attractions['New York'];
    }
    
    function getAccommodationsByDestination(destination, travelStyle) {
        // Mock accommodation data
        const accommodations = {
            'Paris': [
                {
                    name: 'Hotel de Seine',
                    rating: 4.5,
                    price: '$180 per night',
                    location: 'Saint-Germain-des-Prés, 0.5 miles from city center',
                    features: ['Free WiFi', 'Breakfast included', 'Air conditioning'],
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    name: 'Le Marais Apartment',
                    rating: 4.2,
                    price: '$150 per night',
                    location: 'Le Marais, 1 mile from city center',
                    features: ['Kitchen', 'Washer/Dryer', 'Close to metro'],
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    name: 'Luxury Paris Suites',
                    rating: 4.8,
                    price: '$350 per night',
                    location: 'Champs-Élysées, 0.2 miles from city center',
                    features: ['Spa', 'Room service', 'Concierge'],
                    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
            ],
            'Tokyo': [
                {
                    name: 'Shinjuku Granbell Hotel',
                    rating: 4.3,
                    price: '$120 per night',
                    location: 'Shinjuku, 2 miles from city center',
                    features: ['Free WiFi', 'Restaurant', 'Bar'],
                    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    name: 'Tokyo Bay Hostel',
                    rating: 3.9,
                    price: '$40 per night',
                    location: 'Asakusa, 3 miles from city center',
                    features: ['Shared kitchen', 'Lounge', 'Budget-friendly'],
                    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    name: 'Imperial Hotel Tokyo',
                    rating: 4.9,
                    price: '$400 per night',
                    location: 'Chiyoda, 0.5 miles from city center',
                    features: ['Pool', 'Spa', 'Multiple restaurants'],
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
            ],
            'New York': [
                {
                    name: 'The Manhattan Hotel',
                    rating: 4.4,
                    price: '$220 per night',
                    location: 'Midtown, 0.3 miles from Times Square',
                    features: ['Free WiFi', 'Fitness center', 'Restaurant'],
                    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    name: 'Brooklyn Bridge Loft',
                    rating: 4.1,
                    price: '$180 per night',
                    location: 'DUMBO, Brooklyn, 2 miles from city center',
                    features: ['Full kitchen', 'Washer/Dryer', 'City views'],
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                },
                {
                    name: 'Luxury Central Park Suites',
                    rating: 4.7,
                    price: '$450 per night',
                    location: 'Upper East Side, 0.1 miles from Central Park',
                    features: ['Concierge', 'Spa services', 'Fine dining'],
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
            ]
        };
        
        // Filter accommodations based on travel style
        let filteredAccommodations = accommodations[destination] || accommodations['New York'];
        
        if (travelStyle === 'budget') {
            // Sort by price (assuming lower price is better for budget travelers)
            filteredAccommodations = filteredAccommodations.sort((a, b) => {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                return priceA - priceB;
            });
        } else if (travelStyle === 'luxury') {
            // Sort by rating and price (higher is better for luxury travelers)
            filteredAccommodations = filteredAccommodations.sort((a, b) => {
                if (b.rating === a.rating) {
                    const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                    return priceB - priceA;
                }
                return b.rating - a.rating;
            });
        }
        
        return filteredAccommodations;
    }
    
    function getLocalTipsByDestination(destination) {
        // Mock local tips data
        const tips = {
            'Paris': [
                {
                    title: 'Cultural Etiquette',
                    content: 'Always greet shopkeepers with "Bonjour" when entering and "Au revoir" when leaving. Basic French phrases are appreciated by locals.',
                    icon: 'fas fa-handshake'
                },
                {
                    title: 'Best Time to Visit Attractions',
                    content: 'Visit the Eiffel Tower early in the morning or late in the evening to avoid crowds. The Louvre is less crowded on Wednesday and Friday evenings.',
                    icon: 'far fa-clock'
                },
                {
                    title: 'Transportation Tips',
                    content: 'Purchase a "carnet" of 10 metro tickets for savings. The Paris Metro is efficient but avoid rush hours (8-10am, 5-7pm).',
                    icon: 'fas fa-subway'
                },
                {
                    title: 'Dining Customs',
                    content: 'Lunch is typically from 12-2pm and dinner from 7:30-10pm. Service is included in the bill, but leaving small change is appreciated.',
                    icon: 'fas fa-utensils'
                }
            ],
            'Tokyo': [
                {
                    title: 'Cultural Etiquette',
                    content: 'Bow when greeting people. Remove shoes when entering homes and some restaurants. Avoid eating while walking in public.',
                    icon: 'fas fa-handshake'
                },
                {
                    title: 'Best Time to Visit Attractions',
                    content: 'Visit popular shrines early morning to avoid crowds. Tokyo Skytree is less crowded on weekday mornings.',
                    icon: 'far fa-clock'
                },
                {
                    title: 'Transportation Tips',
                    content: 'Purchase a Suica or Pasmo card for easy travel on trains and buses. Trains stop running around midnight, so plan accordingly.',
                    icon: 'fas fa-subway'
                },
                {
                    title: 'Dining Customs',
                    content: 'Saying "Itadakimasu" before eating and "Gochisosama" after is customary. Tipping is not practiced in Japan.',
                    icon: 'fas fa-utensils'
                }
            ],
            'New York': [
                {
                    title: 'Cultural Etiquette',
                    content: 'New Yorkers walk fast and value efficiency. Stand to the right on escalators to let others pass on the left.',
                    icon: 'fas fa-handshake'
                },
                {
                    title: 'Best Time to Visit Attractions',
                    content: 'Visit popular museums on weekday afternoons. The Empire State Building is less crowded early morning or late evening.',
                    icon: 'far fa-clock'
                },
                {
                    title: 'Transportation Tips',
                    content: 'Purchase a MetroCard for subway and bus travel. Avoid rush hours (8-9:30am, 5-6:30pm) if possible.',
                    icon: 'fas fa-subway'
                },
                {
                    title: 'Dining Customs',
                    content: 'Tipping 15-20% is customary at restaurants. Many places are cash-only, so carry some cash with you.',
                    icon: 'fas fa-utensils'
                }
            ]
        };
        
        return tips[destination] || tips['New York'];
    }
});