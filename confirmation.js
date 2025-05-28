document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Page navigation logic
    const allNavLinks = document.querySelectorAll('.nav-link-custom, .btn-custom[data-page], .footer-nav-link[data-page]');
    const pageSections = document.querySelectorAll('.page-section');
    const mainContent = document.getElementById('mainContent');
    const skeletonLoaderResults = document.getElementById('skeletonLoaderResults');
    const actualFlightResults = document.getElementById('actualFlightResults');

    function setActivePage(pageId, skipScroll = false) {
        pageSections.forEach(section => {
            if (section) section.classList.add('hidden');
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.remove('hidden');
            if (!skipScroll && mainContent) {
                // Scroll to top of main content, not the entire window
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (pageId === 'searchResults') {
                if (skeletonLoaderResults) skeletonLoaderResults.style.display = 'block';
                if (actualFlightResults) actualFlightResults.classList.add('hidden');
                setTimeout(() => {
                    if (skeletonLoaderResults) skeletonLoaderResults.style.display = 'none';
                    if (actualFlightResults) actualFlightResults.classList.remove('hidden');
                    lucide.createIcons();
                }, 1500);
            }
        } else {
            console.warn(`Page section with ID "${pageId}" not found.`);
        }

        // Update active link styling for main nav and mobile nav
        document.querySelectorAll('.nav-link-custom').forEach(link => {
            if (link) {
                link.classList.remove('nav-link-active-custom');
                if (link.dataset.page === pageId) {
                    link.classList.add('nav-link-active-custom');
                }
            }
        });

        const mobileMenuElement = document.getElementById('mobile-menu');
        if (mobileMenuElement && mobileMenuElement.classList.contains('block')) {
            toggleMobileMenu(); // Close mobile menu after navigation
        }
        lucide.createIcons(); // Re-render icons after page change
    }

    allNavLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.dataset.page;
                if (pageId) {
                    setActivePage(pageId);
                }
            });
        }
    });

    setActivePage('home', true); // Initial page load (Home), skip scroll

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMobileMenu() {
        if (mobileMenu && mobileMenuButton) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            // Toggle icons by finding them within the button
            const icons = mobileMenuButton.querySelectorAll('.current-icon');
            icons.forEach(icon => icon.classList.toggle('hidden'));
        }
    }
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }


    // Login Modal Logic
    const loginModal = document.getElementById('loginModal');
    const loginModalButton = document.getElementById('loginModalButton');
    const loginModalButtonMobile = document.getElementById('loginModalButtonMobile');
    const closeLoginModalButton = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm'); // Changed from loginSubmitButton to the form
    const userProfileDropdownContainer = document.getElementById('userProfileDropdownContainer');
    const userProfileDropdownContainerMobile = document.getElementById('userProfileDropdownContainerMobile');

    function openLoginModal() { if (loginModal) loginModal.classList.add('show'); }
    function closeLoginModal() { if (loginModal) loginModal.classList.remove('show'); }

    if (loginModalButton) loginModalButton.addEventListener('click', openLoginModal);
    if (loginModalButtonMobile) loginModalButtonMobile.addEventListener('click', openLoginModal);
    if (closeLoginModalButton) closeLoginModalButton.addEventListener('click', closeLoginModal);

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeLoginModal();
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => { // Changed to listen to form submit
            e.preventDefault();
            closeLoginModal();
            showToast('Login successful! Welcome back.', 'success');
            if (loginModalButton) loginModalButton.classList.add('hidden');
            if (loginModalButtonMobile) loginModalButtonMobile.classList.add('hidden');
            if (userProfileDropdownContainer) userProfileDropdownContainer.classList.remove('hidden');
            if (userProfileDropdownContainerMobile) userProfileDropdownContainerMobile.classList.remove('hidden');
            lucide.createIcons(); // Refresh icons if profile pic appears
        });
    }

    // User Profile Dropdown Toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userProfileDropdown = document.getElementById('userProfileDropdown');

    if (userMenuButton && userProfileDropdown) {
        userMenuButton.addEventListener('click', () => {
            const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true' || false;
            userMenuButton.setAttribute('aria-expanded', String(!isExpanded));
            userProfileDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (event) => {
            if (userProfileDropdown && !userProfileDropdown.classList.contains('hidden') && userMenuButton && !userMenuButton.contains(event.target) && !userProfileDropdown.contains(event.target)) {
                userProfileDropdown.classList.add('hidden');
                userMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Toast Notification Logic
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    function showToast(message, type = 'success') {
        if (toastMessage && toastNotification) {
            toastMessage.textContent = message;
            toastNotification.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-sky-500'); // Clear other types
            if (type === 'success') toastNotification.classList.add('bg-green-500');
            else if (type === 'error') toastNotification.classList.add('bg-red-500');
            else if (type === 'warning') toastNotification.classList.add('bg-yellow-500');
            else if (type === 'info') toastNotification.classList.add('bg-sky-500'); // Added info type

            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3000);
        }
    }

    // Confirm Booking Button
    const confirmBookingButton = document.getElementById("confirmBookingButton");

    if (confirmBookingButton) {
        confirmBookingButton.addEventListener("click", () => {
            // Get input values
            const firstName = document.getElementById("firstName")?.value.trim();
            const lastName = document.getElementById("lastName")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const phone = document.getElementById("phone")?.value.trim();

            // Validation: Ensure all required fields are filled
            if (!firstName || !lastName || !email || !phone) {
                alert("Please fill in all passenger details before proceeding!");
                return; // Stop submission if fields are empty
            }

            // If validation passes, confirm booking
            showToast("Booking Confirmed! Check your email for details.", "success");

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                setActivePage("dashboard");
            }, 1000);
        });
    }

    // Seat Selection Logic
    const seatMapContainer = document.getElementById('seatMapContainer');
    const selectedSeatDisplay = document.getElementById('selectedSeatDisplay');
    if (seatMapContainer && selectedSeatDisplay) {
        seatMapContainer.addEventListener('click', (e) => {
            const seat = e.target.closest('.seat-base'); // Target base class
            if (seat && !seat.classList.contains('seat-occupied')) {
                const currentSelected = seatMapContainer.querySelector('.seat-selected');
                if (currentSelected && currentSelected !== seat) {
                    currentSelected.classList.remove('seat-selected');
                    currentSelected.classList.add('seat-available');
                }
                seat.classList.toggle('seat-selected');
                seat.classList.toggle('seat-available'); // Toggle available only if not becoming selected

                const newlySelectedSeat = seatMapContainer.querySelector('.seat-selected');
                selectedSeatDisplay.textContent = newlySelectedSeat ? newlySelectedSeat.dataset.seat : 'None';
            }
        });
    }

    // Dashboard Navigation
    const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item');
    const dashboardContents = document.querySelectorAll('.dashboard-content');

    dashboardNavItems.forEach(item => {
        if (item) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetHref = item.getAttribute('href');
                if (!targetHref || !targetHref.startsWith('#')) return; // Basic check for valid href

                // Handle logout separately
                if (item.id === 'dashboardLogoutButton') {
                    showToast('Logged out successfully.', 'info');
                    // Simulate logged out state
                    if (loginModalButton) loginModalButton.classList.remove('hidden');
                    if (loginModalButtonMobile) loginModalButtonMobile.classList.remove('hidden');
                    if (userProfileDropdownContainer) userProfileDropdownContainer.classList.add('hidden');
                    if (userProfileDropdownContainerMobile) userProfileDropdownContainerMobile.classList.add('hidden');
                    if (userProfileDropdown && !userProfileDropdown.classList.contains('hidden')) userProfileDropdown.classList.add('hidden'); // Close dropdown if open
                    setActivePage('home');
                    return;
                }

                const targetId = targetHref.substring(1) + 'Content';

                dashboardNavItems.forEach(nav => {
                    if (nav) {
                        nav.classList.remove('bg-sky-100', 'text-sky-700');
                        nav.classList.add('text-gray-600');
                    }
                });
                item.classList.add('bg-sky-100', 'text-sky-700');
                item.classList.remove('text-gray-600');

                dashboardContents.forEach(content => {
                    if (content) content.classList.add('hidden');
                });
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                } else {
                    console.warn(`Dashboard content with ID "${targetId}" not found.`);
                }
                lucide.createIcons();
            });
        }
    });

    // Admin Panel Navigation
    const adminNavItems = document.querySelectorAll('.admin-nav-item');
    const adminContents = document.querySelectorAll('.admin-content');

    adminNavItems.forEach(item => {
        if (item) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetHref = item.getAttribute('href');
                if (!targetHref || !targetHref.startsWith('#')) return;
                const targetId = targetHref.substring(1) + 'Content';

                adminNavItems.forEach(nav => {
                    if (nav) {
                        nav.classList.remove('bg-sky-100', 'text-sky-700');
                        nav.classList.add('text-gray-600');
                    }
                });
                item.classList.add('bg-sky-100', 'text-sky-700');
                item.classList.remove('text-gray-600');

                adminContents.forEach(content => {
                    if (content) content.classList.add('hidden');
                });
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                } else {
                    console.warn(`Admin content with ID "${targetId}" not found.`);
                }
                lucide.createIcons();
            });
        }
    });

    // Set current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Flight Search Form Submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            setActivePage('searchResults');
            showToast('Searching for flights...', 'info');
        });
    }

// Create Flights
const flights = [
    { airline: "Cebu Pacific", flightCode: "CP 205", depTime: "08:00 AM", depLoc: "Philippines", arrTime: "10:15 AM", arrLoc: "Japan", price: "22067", duration: "2h 15m duration | Non-stop" },
    { airline: "Philippines Airlines", flightCode: "PA 712", depTime: "09:15 AM", depLoc: "Philippines", arrTime: "11:45 AM", arrLoc: "Japan", price: "35145", duration: "2h 30m duration | Non-stop" },
    { airline: "Philippines AirAsia", flightCode: "PAA 625", depTime: "09:15 AM", depLoc: "Philippines", arrTime: "12:00 PM", arrLoc: "Japan", price: "28696", duration: "2h 45m duration | Non-stop" },
    { airline: "Cebu Pacific", flightCode: "CP 205", depTime: "09:00 AM", depLoc: "Philippines", arrTime: "11:15 AM", arrLoc: "United States", price: "52067", duration: "2h 15m duration | Non-stop" },
    { airline: "Philippines Airlines", flightCode: "PA 712", depTime: "10:15 AM", depLoc: "Philippines", arrTime: "12:45 AM", arrLoc: "United States", price: "75145", duration: "2h 30m duration | Non-stop" },
    { airline: "Philippines AirAsia", flightCode: "PAA 625", depTime: "08:15 AM", depLoc: "Philippines", arrTime: "11:00 PM", arrLoc: "United States", price: "68696", duration: "2h 45m duration | Non-stop" },
    { airline: "Philippines Airlines", flightCode: "PA 712", depTime: "12:00 AM", depLoc: "Philippines", arrTime: "03:00 PM", arrLoc: "China", price: "40000", duration: "3h duration | Non-stop" },
    { airline: "Cebu Pacific", flightCode: "CP 205", depTime: "12:30 AM", depLoc: "Philippines", arrTime: "04:30 PM", arrLoc: "China", price: "32500", duration: "4h duration | Non-stop" },
    { airline: "Philippines AirAsia", flightCode: "PAA 625", depTime: "10:30 AM", depLoc: "Philippines", arrTime: "02:30 PM", arrLoc: "China", price: "35500", duration: "4h duration | Non-stop" },
    { airline: "Philippines Airlines", flightCode: "PA 712", depTime: "10:00 AM", depLoc: "Philippines", arrTime: "01:00 PM", arrLoc: "France", price: "80000", duration: "3h duration | Non-stop" },
    { airline: "Cebu Pacific", flightCode: "CP 205", depTime: "11:30 AM", depLoc: "Philippines", arrTime: "03:30 PM", arrLoc: "France", price: "62500", duration: "4h duration | Non-stop" },
    { airline: "Philippines AirAsia", flightCode: "PAA 625", depTime: "12:30 AM", depLoc: "Philippines", arrTime: "04:30 PM", arrLoc: "France", price: "55500", duration: "4h duration | Non-stop" }
];

const resultsPerPage = 6;
let currentPage = 0;

// Ensure displayedFlights starts with ALL flights
let displayedFlights = [...flights];

function updateFlights() {
    const flightContainer = document.getElementById("actualFlightResults");
    flightContainer.innerHTML = "";

    let start = currentPage * resultsPerPage;
    let end = start + resultsPerPage;
    let paginatedFlights = displayedFlights.slice(start, end);

    paginatedFlights.forEach((flight, index) => {
        flightContainer.innerHTML += `
            <div class="card-custom hover:shadow-xl transition-shadow" id="flight-card-${index}">
                <div class="p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div class="flex items-center space-x-4">
                        <img src="https://placehold.co/48x48/0EA5E9/FFFFFF?text=AL" alt="Airline Logo" class="rounded-full">
                        <div>
                            <h4 class="font-semibold text-lg">${flight.airline}</h4>
                            <p class="text-sm text-gray-500" id="code-${index}">${flight.flightCode}</p>
                        </div>
                    </div>
                    <div class="text-center md:text-left">
                        <p class="font-medium" id="departure-time-${index}">${flight.depTime}</p>
                        <p class="text-sm text-gray-500" id="departure-${index}">${flight.depLoc}</p>
                    </div>
                    <div class="text-center md:text-left">
                        <p class="font-medium" id="arrival-time-${index}">${flight.arrTime}</p>
                        <p class="text-sm text-gray-500" id="arrival-${index}">${flight.arrLoc}</p>
                    </div>
                    <div class="text-center md:text-right">
                    <p id="flight-price-${index}" class="text-2xl font-bold text-sky-600" data-price="${parseInt(flight.price.replace(/[^\d]/g, ""))}">
                        ${parseInt(flight.price.replace(/[^\d]/g, "")).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                    </p>
                        <button class="btn-custom btn-primary-custom !text-sm mt-2 !px-4 !py-2" id="btn-sf-${index}">Select Flight</button> 
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-3 border-t text-sm text-gray-600">
                    ${flight.duration}
                </div>
            </div>
        `;
    });

    document.getElementById("current-page").textContent = currentPage + 1;
}

function changePage(direction) {
    if (direction === 'prev' && currentPage > 0) {
        currentPage--;
    } else if (direction === 'next' && currentPage < Math.ceil(displayedFlights.length / resultsPerPage) - 1) {
        currentPage++;
    } else if (typeof direction === "number") {
        currentPage = direction - 1;
    }
    updateFlights();
}

// Show all flights on page load
window.onload = function () {
    updateFlights(displayedFlights);
};

// To apply the filters
document.querySelector("#btn").addEventListener("click", function () {
    applyFilters();
});

function applyFilters() {
    const maxPrice = parseInt(document.getElementById("priceRange").value);

    const departureLocation = document.getElementById("takeOff").value;
    const arrivalLocation = document.getElementById("arrival").value;

    // Capture selected airlines
    const selectedAirlines = [];
    if (document.getElementById("airline1").checked) selectedAirlines.push("Cebu Pacific");
    if (document.getElementById("airline2").checked) selectedAirlines.push("Philippines Airlines");
    if (document.getElementById("airline3").checked) selectedAirlines.push("Philippines AirAsia");

    // Capture selected departure times
    const selectedTimes = [];
    if (document.getElementById("time_morning").checked) selectedTimes.push({ start: 6, end: 12 });
    if (document.getElementById("time_afternoon").checked) selectedTimes.push({ start: 12, end: 18 });
    if (document.getElementById("time_evening").checked) selectedTimes.push({ start: 18, end: 24 });

    // Ensure price filtering works independently
    displayedFlights = flights.filter(flight => {
        let flightPrice = parseInt(flight.price.replace("₱", "").replace(",", ""));
        let priceValid = flightPrice >= 10000 && flightPrice <= maxPrice;

        let airlineValid = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
        let locationValid = flight.depLoc === departureLocation && flight.arrLoc === arrivalLocation;

        let timeValid = selectedTimes.length === 0 || selectedTimes.some(time => {
            let depParts = flight.depTime.split(/[: ]/);
            let depHour = parseInt(depParts[0]);
            if (depParts[2] === "PM" && depHour !== 12) depHour += 12;
            if (depParts[2] === "AM" && depHour === 12) depHour = 0;
            return depHour >= time.start && depHour < time.end;
        });

        return priceValid && airlineValid && timeValid && locationValid;
    });

    console.log("Filtered Flights Count:", displayedFlights.length);

    // If no flights match, display message
    if (displayedFlights.length === 0) {
        console.log("No matching flights.");
        document.getElementById("actualFlightResults").innerHTML = `<p class="text-center text-gray-500">No flights match your filters.</p>`;
        return;
    }

    // Update flight results
    currentPage = 0;
    updateFlights(displayedFlights);
}

function updateFlights(filteredFlights = displayedFlights) {
    filteredFlights = Array.isArray(filteredFlights) ? filteredFlights : [];

    const flightContainer = document.getElementById("actualFlightResults");
    flightContainer.classList.remove("hidden");
    flightContainer.innerHTML = "";

    let start = currentPage * resultsPerPage;
    let end = start + resultsPerPage;

    // Ensure `filteredFlights` is always an array before calling `.slice()`
    let paginatedFlights = Array.isArray(filteredFlights) ? filteredFlights.slice(start, end) : [];

    console.log("Updating displayed flights", paginatedFlights.length);

    if (paginatedFlights.length === 0) {
        flightContainer.innerHTML = `<p class="text-center text-gray-500">No flights match your filters.</p>`;
        return;
    }

    paginatedFlights.forEach((flight, index) => {
        flightContainer.innerHTML += `
            <div class="card-custom hover:shadow-xl transition-shadow" id="flight-card-${index}">
                <div class="p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div class="flex items-center space-x-4">
                        <img src="https://placehold.co/48x48/0EA5E9/FFFFFF?text=AL" alt="Airline Logo" class="rounded-full">
                        <div>
                            <h4 class="font-semibold text-lg">${flight.airline}</h4>
                            <p class="text-sm text-gray-500" id="code-${index}">${flight.flightCode}</p>
                        </div>
                    </div>
                    <div class="text-center md:text-left">
                        <p class="font-medium" id="departure-time-${index}">${flight.depTime}</p>
                        <p class="text-sm text-gray-500" id="departure-${index}">${flight.depLoc}</p>
                    </div>
                    <div class="text-center md:text-left">
                        <p class="font-medium" id="arrival-time-${index}">${flight.arrTime}</p>
                        <p class="text-sm text-gray-500" id="arrival-${index}">${flight.arrLoc}</p>
                    </div>
                    <div class="text-center md:text-right">
                    <p id="flight-price-${index}" class="text-2xl font-bold text-sky-600" data-price="${parseInt(flight.price.replace(/[^\d]/g, ""))}">
                        ${parseInt(flight.price.replace(/[^\d]/g, "")).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                    </p>
                        <button class="btn-custom btn-primary-custom !text-sm mt-2 !px-4 !py-2" id="btn-sf-${index}">Select Flight</button> 
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-3 border-t text-sm text-gray-600">
                    ${flight.duration}
                </div>
            </div>
        `;
    });

    document.getElementById("current-page").textContent = currentPage + 1;
}

// Sorting Flights
document.getElementById("sortBy").addEventListener("change", function () {
    sortFlights(this.value);
});

function sortFlights(option) {
    switch (option) {
        case "Sort by: Price (Low to High)":
            displayedFlights.sort((a, b) => parseInt(a.price.replace("₱", "").replace(",", "")) - parseInt(b.price.replace("₱", "").replace(",", "")));
            break;
        case "Sort by: Price (High to Low)":
            displayedFlights.sort((a, b) => parseInt(b.price.replace("₱", "").replace(",", "")) - parseInt(a.price.replace("₱", "").replace(",", "")));
            break;
    }

    // Update flight display after sorting
    updateFlights(displayedFlights);
}

document.getElementById("travel-type").addEventListener("change", function () {
    switchFlights(this.value);
});

// Switch Flights from Depart to Returning
function switchFlights(selectedType) {
    if (selectedType === "departure") {
        // Filter departure flights based on home form values
        const departureLocation = document.getElementById("takeOff").value;
        const arrivalLocation = document.getElementById("arrival").value;

        displayedFlights = flights.filter(flight => flight.depLoc === departureLocation && flight.arrLoc === arrivalLocation);
    } else if (selectedType === "returning") {
        // Filter returning flights based on reversed home form values
        const departureLocation = document.getElementById("arrival").value; // Returning departs from previous arrival location
        const arrivalLocation = document.getElementById("takeOff").value; // Returning arrives back at original departure location

        displayedFlights = returningFlights.filter(flight => flight.depLoc === departureLocation && flight.arrLoc === arrivalLocation);
    }

    console.log("Switched flight type:", selectedType, "Filtered Flights Count:", displayedFlights.length);
    updateFlights(displayedFlights);
}

// Define flight lists separately
const departureFlights = [...flights]; // Use your existing flights array for departures
const returningFlights = [
    { airline: "Tokyo Pacific", flightCode: "CP 301", depTime: "02:00 PM", depLoc: "Japan", arrTime: "04:30 PM", arrLoc: "Philippines", price: "₱20,500", duration: "2h 30m duration | Non-stop" },
    { airline: "Japan Airlines", flightCode: "PA 915", depTime: "03:15 PM", depLoc: "Japan", arrTime: "05:45 PM", arrLoc: "Philippines", price: "₱34,600", duration: "2h 30m duration | Non-stop" },
    { airline: "Japan AirAsia", flightCode: "PAA 789", depTime: "03:45 PM", depLoc: "Japan", arrTime: "06:30 PM", arrLoc: "Philippines", price: "₱29,100", duration: "2h 45m duration | Non-stop" },
    { airline: "Washington Pacific", flightCode: "CP 205", depTime: "09:00 AM", depLoc: "United States", arrTime: "11:15 AM", arrLoc: "Philippines", price: "₱52,067", duration: "2h 15m duration | Non-stop" },
    { airline: "USA Airlines", flightCode: "PA 712", depTime: "10:15 AM", depLoc: "United States", arrTime: "12:45 AM", arrLoc: "Philippines", price: "₱75,145", duration: "2h 30m duration | Non-stop" },
    { airline: "USA AirAsia", flightCode: "PAA 625", depTime: "08:15 AM", depLoc: "United States", arrTime: "11:00 PM", arrLoc: "Philippines", price: "₱68,696", duration: "2h 45m duration | Non-stop" },
    { airline: "China Airlines", flightCode: "PA 712", depTime: "12:00 AM", depLoc: "China", arrTime: "03:00 PM", arrLoc: "Philippines", price: "₱40,000", duration: "3h duration | Non-stop" },
    { airline: "Shanghai Pacific", flightCode: "CP 205", depTime: "12:30 AM", depLoc: "China", arrTime: "04:30 PM", arrLoc: "Philippines", price: "₱32,500", duration: "4h duration | Non-stop" },
    { airline: "China AirAsia", flightCode: "PAA 625", depTime: "10:30 AM", depLoc: "China", arrTime: "02:30 PM", arrLoc: "Philippines", price: "₱35,500", duration: "4h duration | Non-stop" },
    { airline: "France Airlines", flightCode: "PA 712", depTime: "10:00 AM", depLoc: "France", arrTime: "01:00 PM", arrLoc: "Philippines", price: "₱80,000", duration: "3h duration | Non-stop" },
    { airline: "Paris Pacific", flightCode: "CP 205", depTime: "11:30 AM", depLoc: "France", arrTime: "03:30 PM", arrLoc: "Philippines", price: "₱62,500", duration: "4h duration | Non-stop" },
    { airline: "France AirAsia", flightCode: "PAA 625", depTime: "12:30 AM", depLoc: "France", arrTime: "04:30 PM", arrLoc: "Philippines", price: "₱55,500", duration: "4h duration | Non-stop" }
];

document.getElementById("bookingForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const departureLocation = document.getElementById("takeOff").value;
    const arrivalLocation = document.getElementById("arrival").value;

    // Filter flights based on selected departure & arrival
    displayedFlights = flights.filter(flight => flight.depLoc === departureLocation && flight.arrLoc === arrivalLocation);

    console.log("Filtered Flights:", displayedFlights);

    // If no flights match, show message
    const flightContainer = document.getElementById("actualFlightResults");
    if (displayedFlights.length === 0) {
        flightContainer.innerHTML = `<p class="text-center text-gray-500">No flights match your search.</p>`;
        return;
    }

    // Update flight results
    currentPage = 0;
    updateFlights(displayedFlights);
    });


// Select Flight & Booking Summary
    document.getElementById("actualFlightResults").addEventListener("click", function (event) {
        if (event.target.id.startsWith("btn-sf")) {
            // Ensure Booking Section exists
            const bookingSection = document.getElementById("booking");
            const searchResultsSection = document.getElementById("searchResults");

            if (!bookingSection || !searchResultsSection) {
                console.error("Booking section or Flight Results section not found.");
                return;
            }

            // Show Booking Section & Hide Flight Results
            searchResultsSection.classList.add("hidden");
            bookingSection.classList.remove("hidden");

            // Highlight "Book" in navigation
            document.querySelectorAll(".nav-link-custom").forEach(link => link.classList.remove("nav-link-active-custom"));
            document.querySelector('[data-page="booking"]').classList.add("nav-link-active-custom");

            console.log("Successfully switched to Booking Section.");

            // Get the index from the clicked button's ID
            const index = event.target.id.split("-").pop();
            console.log("Extracted index:", index);

            // Get flight details from the selected card
            const flightCard = document.getElementById(`flight-card-${index}`);
            if (!flightCard) {
                console.error(`Flight card flight-card-${index} not found.`);
                return;
            }

            const takeOffElem = flightCard.querySelector(`#departure-${index}`);
            const arrivalElem = flightCard.querySelector(`#arrival-${index}`);
            const flightCodeElem = flightCard.querySelector(`#code-${index}`);
            const depTimeElem = flightCard.querySelector(`#departure-time-${index}`);
            const arrTimeElem = flightCard.querySelector(`#arrival-time-${index}`);
            const flightPriceElem = flightCard.querySelector(`#flight-price-${index}`);

            const takeOff = takeOffElem ? takeOffElem.textContent.trim() : "N/A";
            const arrival = arrivalElem ? arrivalElem.textContent.trim() : "N/A";
            const flightCode = flightCodeElem ? flightCodeElem.textContent.trim() : "N/A";
            const depTime = depTimeElem ? depTimeElem.textContent.trim() : "N/A";
            const arrTime = arrTimeElem ? arrTimeElem.textContent.trim() : "N/A";
            const price = flightPriceElem ? parseInt(flightPriceElem.getAttribute("data-price")) : 0;

            // Get passenger details
            const adultsElem = document.getElementById("adultCount");
            const childrenElem = document.getElementById("childCount");
            const infantsElem = document.getElementById("infantCount");

            if (!adultsElem || !childrenElem || !infantsElem) {
                console.error("Passenger count elements not found.");
                return;
            }

            const adults = parseInt(adultsElem.value) || 1;
            const children = parseInt(childrenElem.value) || 0;
            const infants = parseInt(infantsElem.value) || 0;
            const totalPassengers = adults + children + infants;

            // Get departure & return dates
            const departureDate = document.getElementById("departureDate")?.value || "N/A";
            const returnDate = document.getElementById("returnDate")?.value || "N/A";

            // Calculate pricing
            const subtotal = price * totalPassengers;
            const taxes = Math.floor(subtotal * 0.12); // 12% tax calculation
            const totalCost = subtotal + taxes;

            // Update Booking Summary section (Fixed targeting)
            document.getElementById("dep-to-arr").textContent = takeOff && arrival ? `${takeOff} → ${arrival}` : "N/A";
            document.getElementById("depd-to-retd").textContent = departureDate && returnDate ? `${departureDate} - ${returnDate}` : "N/A";
            document.getElementById("passengers").textContent = totalPassengers ? `${totalPassengers} Passenger(s)` : "N/A";
            document.getElementById("sub-total").textContent = `₱${subtotal.toLocaleString()}`;
            document.getElementById("taxes-and-fees").textContent = `₱${taxes.toLocaleString()}`;
            document.getElementById("totalPrice").textContent = `₱${totalCost.toLocaleString()}`;

            console.log("Booking Summary updated:", { takeOff, arrival, departureDate, returnDate, totalPassengers, subtotal, taxes, totalCost });

                // Extract index from clicked button's ID
                console.log("Extracted index:", index);

                // Get flight details from the selected flight card
                if (!flightCard) {
                    console.error(`Flight card flight-card-${index} not found.`);
                    return;
                }

                // Retrieve flight code
                if (!flightCodeElem) {
                    console.error(`Flight Code element code-${index} not found.`);
                    return;
                }

                console.log("Selected Flight Code:", flightCode);

                // Store flight code in LocalStorage for later use
                localStorage.setItem("selectedFlightCode", flightCode);

        }


// Dashboard
    const dashboardResults = document.getElementById("dashboard-results");

    if (!dashboardResults) {
        console.error("Dashboard results container not found.");
        return;
    }

        const takeOff = document.getElementById("takeOff")?.value || "";
        const arrival = document.getElementById("arrival")?.value || "";
        const departureDate = document.getElementById("departureDate")?.value || "";
        const returnDate = document.getElementById("returnDate")?.value || "";
        const flightCode = localStorage.getItem("selectedFlightCode") || "";

    // Retrieve stored booking data
            const bookingData = {
                departure: document.getElementById("takeOff")?.value || "",
                destination: document.getElementById("arrival")?.value || "",
                departureDate: document.getElementById("departureDate")?.value || "",
                returnDate: document.getElementById("returnDate")?.value || "",
                flightCode: flightCode
            };

            console.log("Sending data to server:", bookingData); // Debugging step

            fetch("index.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData)
            })
            .then(response => response.text()) // Read raw response first
            .then(text => {
                try {
                    const data = JSON.parse(text); // Attempt JSON parsing
                    console.log("Server Response:", data);
                } catch (error) {
                    console.error("Raw server response:", text); // If not JSON, log HTML response
                    console.error("Error:", error);
                }
            })
            .catch(error => console.error("Fetch request failed:", error));

            if (!bookingData.departure || !bookingData.destination || !bookingData.departureDate || !bookingData.returnDate) {
                dashboardResults.innerHTML = `<p class="text-center text-gray-600">No bookings available.</p>`;
                return;
            }
 
    const flightSummaryHTML = `
        <div class="bg-white p-6 md:p-8 shadow-xl rounded-lg border border-gray-300">
            <p class="text-gray-600"><strong>Departure:</strong> ${takeOff}</p>
            <p class="text-gray-600"><strong>Destination:</strong> ${arrival}</p>
            <p class="text-gray-600"><strong>Departure Date:</strong> ${departureDate}</p>
            <p class="text-gray-600"><strong>Return Date:</strong> ${returnDate}</p>
            <p class="text-gray-600"><strong>Flight Code:</strong> ${flightCode}</p>
            <button onclick="openModifyModal()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Modify Booking
            </button>
            <button onclick="deleteBooking()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Delete Booking
            </button>
        </div>
    `;

    // Insert booking details into the dashboard
    dashboardResults.innerHTML = flightSummaryHTML;

    console.log("Dashboard successfully populated with stored booking details.");
});

// 🛠 Open Modify Booking Modal & Populate Form
function openModifyModal(departure, destination, departureDate, returnDate, flightCode) {
    document.getElementById("modifyBookingModal").classList.remove("hidden");

    // Populate modification form with stored data
    document.getElementById("modDeparture").value = departure;
    document.getElementById("modDestination").value = destination;
    document.getElementById("modDepartureDate").value = departureDate;
    document.getElementById("modReturnDate").value = returnDate;
    document.getElementById("modFlightCode").value = flightCode;
}

// 🛠 Close Modify Booking Modal
document.getElementById("closeModifyModal").addEventListener("click", function () {
    document.getElementById("modifyBookingModal").classList.add("hidden");
});

// 🛠 Handle Booking Modification Submission
document.getElementById("modifyForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedBooking = {
        departure: document.getElementById("modDeparture").value,
        destination: document.getElementById("modDestination").value,
        departureDate: document.getElementById("modDepartureDate").value,
        returnDate: document.getElementById("modReturnDate").value,
        flightCode: document.getElementById("modFlightCode").value
    };

    console.log("Updating Booking:", updatedBooking);

    // Send update request to PHP
    fetch("update_booking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data);
        document.getElementById("modifyBookingModal").classList.add("hidden");
        displayBooking(updatedBooking); // Update UI without reloading
    })
    .catch(error => console.error("Error updating booking:", error));
});

// 🛠 Delete Booking
function deleteBooking(bookingId) {
    if (confirm("Are you sure you want to delete this booking?")) {
        fetch("delete_booking.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: bookingId })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data);
            document.getElementById("dashboard-results").innerHTML = `<p class="text-center text-gray-600">No bookings available.</p>`;
        })
        .catch(error => console.error("Error deleting booking:", error));
    }
}


document.addEventListener("DOMContentLoaded", function () {
    fetch("fetch_booking.php")
    .then(response => response.json())
    .then(data => {
        const dashboardResults = document.getElementById("dashboard-results");
        if (!dashboardResults || data.length === 0) {
            dashboardResults.innerHTML = `<p class="text-center text-gray-600">No bookings available.</p>`;
            return;
        }

        data.forEach(booking => {
            const flightSummaryHTML = `
                <div class="bg-white p-6 md:p-8 shadow-xl rounded-lg border border-gray-300">
                    <p class="text-gray-600"><strong>Departure:</strong> ${booking.departure}</p>
                    <p class="text-gray-600"><strong>Destination:</strong> ${booking.destination}</p>
                    <p class="text-gray-600"><strong>Departure Date:</strong> ${booking.departure_date}</p>
                    <p class="text-gray-600"><strong>Return Date:</strong> ${booking.return_date}</p>
                    <p class="text-gray-600"><strong>Flight Code:</strong> ${booking.flight_code}</p>
                </div>
            `;
            dashboardResults.innerHTML += flightSummaryHTML;
        });
    })
    .catch(error => console.error("Error fetching booking data:", error));
});

}); // End of DOMContentLoaded