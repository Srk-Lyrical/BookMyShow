/**
 * ShowTime - Vanilla JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Carousel Logic ---
    const carousel = document.getElementById('carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Manual Navigation
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Auto Transition every 3 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // --- Category Filtering Logic ---
    const navMovies = document.getElementById('nav-movies');
    const navSports = document.getElementById('nav-sports');
    const moviesSection = document.getElementById('movies-section');
    const eventsSection = document.getElementById('events-section');

    // When "Sports" is clicked: Hide Movies, Show Events
    navSports.addEventListener('click', (e) => {
        e.preventDefault();
        moviesSection.style.display = 'none';
        eventsSection.style.display = 'block';
        console.log('Switched to Sports/Events view');
    });

    // When "Movies" is clicked: Show Movies, Show Events (Reset)
    navMovies.addEventListener('click', (e) => {
        e.preventDefault();
        moviesSection.style.display = 'block';
        eventsSection.style.display = 'block';
        console.log('Reset to Movies view');
    });

    // --- Location Selection Logic ---
    const locationTrigger = document.getElementById('location-trigger');
    const locationModal = document.getElementById('location-modal');
    const closeModal = document.getElementById('close-modal');
    const currentLocationSpan = document.getElementById('current-location');
    const locationInput = document.getElementById('location-input');
    const btnSearchLocation = document.getElementById('btn-search-location');
    const btnDetectLocation = document.getElementById('btn-detect-location');
    const cityChips = document.querySelectorAll('.city-chip');
    const mapPlaceholder = document.getElementById('map-placeholder');

    function openLocationModal() {
        locationModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLocationModal() {
        locationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function setLocation(city) {
        currentLocationSpan.textContent = city;
        closeLocationModal();
        console.log(`Location changed to: ${city}`);
    }

    locationTrigger.addEventListener('click', openLocationModal);
    closeModal.addEventListener('click', closeLocationModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === locationModal) {
            closeLocationModal();
        }
    });

    // Type to change location
    btnSearchLocation.addEventListener('click', () => {
        const city = locationInput.value.trim();
        if (city) {
            setLocation(city);
            locationInput.value = '';
        }
    });

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnSearchLocation.click();
        }
    });

    // Detect current location
    btnDetectLocation.addEventListener('click', () => {
        btnDetectLocation.textContent = 'Detecting...';
        btnDetectLocation.disabled = true;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Coordinates: ${latitude}, ${longitude}`);
                    
                    try {
                        // Using a free reverse geocoding API (BigDataCloud or similar)
                        // For this demo, we'll simulate a lookup or use a hardcoded result
                        // since we don't want to rely on external API keys if possible.
                        // However, we can use a public endpoint if available.
                        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                        const data = await response.json();
                        const city = data.city || data.locality || "Detected Location";
                        setLocation(city);
                    } catch (error) {
                        console.error("Error fetching city name:", error);
                        setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
                    } finally {
                        btnDetectLocation.innerHTML = '<i>📍</i> Use Current Location';
                        btnDetectLocation.disabled = false;
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Unable to retrieve your location. Please check your permissions.");
                    btnDetectLocation.innerHTML = '<i>📍</i> Use Current Location';
                    btnDetectLocation.disabled = false;
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            btnDetectLocation.disabled = false;
        }
    });

    // Select from map (Mock implementation)
    mapPlaceholder.addEventListener('click', (e) => {
        // In a real app, we'd use map coordinates. 
        // Here we'll just pick a random city from our list for the demo.
        const mockCities = ["Mumbai", "Chennai", "Delhi", "Bangalore", "Kolkata"];
        const randomCity = mockCities[Math.floor(Math.random() * mockCities.length)];
        setLocation(`${randomCity} (from Map)`);
    });

    // Select from popular cities
    cityChips.forEach(chip => {
        chip.addEventListener('click', () => {
            setLocation(chip.textContent);
        });
    });

    // --- Sign In Modal Logic ---
    const signinTrigger = document.getElementById('signin-trigger');
    const signinModal = document.getElementById('signin-modal');
    const closeSignin = document.getElementById('close-signin');
    const signinForm = document.getElementById('signin-form');

    function openSigninModal() {
        signinModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Re-render Google button to ensure it has the correct width now that container is visible
        initGoogleSignIn();
    }

    function closeSigninModal() {
        signinModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    signinTrigger.addEventListener('click', openSigninModal);
    closeSignin.addEventListener('click', closeSigninModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === signinModal) {
            closeSigninModal();
        }
    });

    // Handle Sign In Form Submission
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('email-phone').value;
        alert(`Sign in successful for: ${input}`);
        closeSigninModal();
        signinTrigger.textContent = 'Profile'; // Change button text to simulate login
    });

    // --- Google Sign-In Initialization ---
    window.handleCredentialResponse = (response) => {
        console.log("Encoded JWT ID token: " + response.credential);
        alert("Google Sign-In successful!");
        closeSigninModal();
        signinTrigger.textContent = 'Profile';
    };

    const initGoogleSignIn = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const buttonContainer = document.getElementById("google-signin-button");
        
        if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
            console.warn("Google Client ID not set. Please provide your OAuth ID.");
            if (buttonContainer) {
                buttonContainer.innerHTML = `
                    <button class="social-btn google" style="width: 100%; justify-content: center;">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
                        Continue with Google (ID Required)
                    </button>
                `;
                buttonContainer.querySelector('.google').onclick = () => {
                    alert("Please set your VITE_GOOGLE_CLIENT_ID in the environment variables to enable real Google Sign-In.");
                };
            }
            return;
        }

        const renderGoogleButton = () => {
            if (window.google && window.google.accounts) {
                google.accounts.id.initialize({
                    client_id: clientId,
                    callback: window.handleCredentialResponse
                });

                google.accounts.id.renderButton(
                    buttonContainer,
                    { 
                        theme: "outline", 
                        size: "large", 
                        width: buttonContainer.offsetWidth || 380,
                        text: "continue_with"
                    }
                );
            } else {
                // Retry if script not loaded yet
                setTimeout(renderGoogleButton, 500);
            }
        };

        renderGoogleButton();
    };

    // Initialize Google Sign-In
    initGoogleSignIn();
});
