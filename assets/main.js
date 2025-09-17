// Wedding Website JavaScript
// TODO: Update wedding date and other details as needed

// Configuration
const WEDDING_DATE = new Date('2025-12-01T17:00:00'); // December 1, 2025 at 5:00 PM
const SECTIONS = ['home', 'our-story', 'schedule', 'travel', 'photos', 'registry', 'faq', 'rsvp'];

// DOM Elements - Only select elements that exist on all pages
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize hearts animation
    initHeartsAnimation();
    
    // Add smooth navigation transitions
    initSmoothNavigation();
    
    // Check if we're on the home page
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    console.log('Is home page:', isHomePage);
    
    // Initialize core functionality first
    if (isHomePage) {
        // Check session storage BEFORE initializing popup and loading screen
        const popupShown = sessionStorage.getItem('popupShown');
        const loadingShown = sessionStorage.getItem('loadingShown');
        
        // Only initialize loading screen if not already shown
        if (!loadingShown) {
        initLoadingScreen();
        } else {
            // Hide loading screen immediately if already shown
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) loadingScreen.style.display = 'none';
        }
        
        // Only initialize popup if not already shown
        if (!popupShown) {
        initCouplePopup();
        } else {
            // Hide popup immediately if already shown
            const popup = document.getElementById('couple-popup');
            if (popup) popup.style.display = 'none';
        }
        
        initCountdown();
    }
    
    initScrollSpy();
    
    // Initialize interactive features
    initMobileMenu();
    initScheduleTabs();
    
    // Only initialize old RSVP if not on the dedicated RSVP page
    if (!window.location.pathname.includes('rsvp.html')) {
        setTimeout(() => {
            console.log('Initializing RSVP after delay');
            initRSVP();
        }, 100);
    } else {
        // Progressive RSVP is initialized by rsvp-progressive.js
        console.log('RSVP page detected - ProgressiveRSVP will be initialized by rsvp-progressive.js');
    }
    
    initPhotoGallery();
    
    // Initialize scroll-based features with requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initScrollAnimations();
            initNavbarScroll();
        });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            initScrollAnimations();
            initNavbarScroll();
        }, 100);
    }
    
    // Initialize calendar features
    initAddToCalendar();
});

// Countdown Timer
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const weddingTime = WEDDING_DATE.getTime();
        const timeLeft = weddingTime - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        } else {
            if (daysEl) daysEl.textContent = '0';
            if (hoursEl) hoursEl.textContent = '0';
            if (minutesEl) minutesEl.textContent = '0';
            if (secondsEl) secondsEl.textContent = '0';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000); // Update every second
}

// Scroll Spy for Navigation
function initScrollSpy() {
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavLink(sectionId);
            }
        });
    }, observerOptions);
    
    SECTIONS.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
}

function updateActiveNavLink(activeSection) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}


// Schedule Tabs
function initScheduleTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (tabBtns.length === 0) return; // No tabs on this page
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const day = btn.getAttribute('data-day');
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide event cards
            eventCards.forEach(card => {
                if (day === 'all' || card.getAttribute('data-day') === day) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    });
}


// RSVP Form - Progressive Reveal
function initRSVP() {
    console.log('initRSVP function called'); // Debug log
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpMessage = document.getElementById('rsvp-message');
    
    console.log('RSVP form found:', rsvpForm); // Debug log
    console.log('RSVP message found:', rsvpMessage); // Debug log
    
    if (!rsvpForm) {
        console.error('No RSVP form found on this page');
        return; // No RSVP form on this page
    }
    
    // Debug: Check if full name input exists
    const fullNameInput = document.getElementById('full-name');
    console.log('Full name input found:', fullNameInput);
    
    let currentQuestion = 1;
    const totalQuestions = 13;
    let isAttending = false;
    
    // Initialize form
    console.log('Initializing RSVP form'); // Debug log
    initializeProgressBar();
    showQuestion('q1');
    
    // Set up event listeners for progressive reveal
    setupProgressiveForm();
    setupOtherInputs();
    setupFileValidation();
    setupAdminPanel();
    setupFamilyMembers();
    
    // Form submission
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitRSVP();
    });
    
    // Test function to manually advance
    window.testAdvance = function() {
        console.log('Manual test advance called');
        
        // Simple test - hide q1, show q2
        const q1 = document.getElementById('q1');
        const q2 = document.getElementById('q2');
        
        console.log('Q1 element:', q1);
        console.log('Q2 element:', q2);
        
        if (q1 && q2) {
            q1.style.display = 'none';
            q2.style.display = 'block';
            q2.style.opacity = '1';
            q2.style.transform = 'translateX(0)';
            console.log('Should have hidden q1 and shown q2');
        } else {
            console.error('Q1 or Q2 not found');
        }
    };
    
    function initializeProgressBar() {
        const progressDots = document.getElementById('progress-dots');
        if (progressDots) {
            for (let i = 1; i <= totalQuestions; i++) {
                const dot = document.createElement('div');
                dot.className = 'progress-dot';
                dot.id = `dot-${i}`;
                progressDots.appendChild(dot);
            }
            updateProgressBar();
        }
    }
    
    function updateProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        const progress = (currentQuestion / totalQuestions) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Update progress dots
        for (let i = 1; i <= totalQuestions; i++) {
            const dot = document.getElementById(`dot-${i}`);
            if (dot) {
                dot.classList.remove('active', 'completed');
                if (i < currentQuestion) {
                    dot.classList.add('completed');
                } else if (i === currentQuestion) {
                    dot.classList.add('active');
                }
            }
        }
    }
    
    function setupProgressiveForm() {
        console.log('Setting up progressive form...');
        
        // Full name input - advance on Enter or blur
        const fullNameInput = document.getElementById('full-name');
        console.log('Full name input in setupProgressiveForm:', fullNameInput);
        
        if (fullNameInput) {
            console.log('Adding event listeners to full name input');
            
            fullNameInput.addEventListener('keypress', (e) => {
                console.log('Keypress event on full name:', e.key, 'Value:', e.target.value);
            if (e.key === 'Enter' && e.target.value.trim().length > 0) {
                e.preventDefault();
                    console.log('Advancing to question 2 from keypress');
                showNextQuestion(2);
            }
        });
            
            fullNameInput.addEventListener('blur', (e) => {
                console.log('Blur event on full name, Value:', e.target.value);
                if (e.target.value.trim().length > 0) {
                    console.log('Advancing to question 2 from blur');
                    showNextQuestion(2);
                }
            });
        } else {
            console.error('Full name input not found!');
        }
        
        // Continue button for full name
        const continueNameBtn = document.getElementById('continue-name');
        if (continueNameBtn) {
            console.log('Adding continue button listener');
            continueNameBtn.addEventListener('click', () => {
                console.log('Continue button clicked');
                if (fullNameInput && fullNameInput.value.trim().length > 0) {
                    console.log('Advancing to question 2 from continue button');
                    showNextQuestion(2);
                } else {
                    alert('Please enter your full name first');
                }
            });
        }
        
        // Attending radio buttons - advance immediately on selection
        document.querySelectorAll('input[name="attending"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                console.log('Attending radio changed:', e.target.value); // Debug log
                isAttending = e.target.value === 'yes';
                
                if (isAttending) {
                    console.log('Advancing to q3 (Mobile Number)'); // Debug log
                    showNextQuestion('q3'); // Mobile number
                } else {
                    console.log('Advancing to q2-no (Not Attending)'); // Debug log
                    showNextQuestion('q2-no'); // Thank you screen for not attending
                }
            });
        });
        
        // Mobile number - advance on Enter or blur
        const mobileInput = document.getElementById('mobile');
        if (mobileInput) {
            mobileInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim().length > 0) {
                e.preventDefault();
                showNextQuestion('q4');
            }
        });
        
            mobileInput.addEventListener('blur', (e) => {
                if (e.target.value.trim().length > 0) {
                    showNextQuestion('q4');
                }
            });
        }
        
        // Age - advance on Enter or blur
        const ageInput = document.getElementById('age');
        if (ageInput) {
            ageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim().length > 0) {
                e.preventDefault();
                showNextQuestion('q5');
            }
        });
        
            ageInput.addEventListener('blur', (e) => {
                if (e.target.value.trim().length > 0) {
                    showNextQuestion('q5');
                }
            });
        }
        
        // Travel mode - advance immediately on selection
        document.querySelectorAll('input[name="travel-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                showNextQuestion('q7');
            });
        });
        
        // Arrival date - advance immediately on selection
        document.querySelectorAll('input[name="arrival-date"]').forEach(radio => {
            radio.addEventListener('change', () => {
                showNextQuestion('q8');
            });
        });
        
        // Arrival location - advance immediately on selection
        document.querySelectorAll('input[name="arrival-location"]').forEach(radio => {
            radio.addEventListener('change', () => {
                showNextQuestion('q9');
            });
        });
        
        // Arrival time - advance on Enter or blur
        const arrivalTimeInput = document.getElementById('arrival-time');
        const continueArrivalTimeBtn = document.getElementById('continue-arrival-time');
        
        if (arrivalTimeInput) {
            arrivalTimeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim().length > 0) {
                e.preventDefault();
                showNextQuestion('q10');
            }
        });
            
            arrivalTimeInput.addEventListener('blur', (e) => {
                if (e.target.value.trim().length > 0) {
                    showNextQuestion('q10');
                }
            });
        }
        
        if (continueArrivalTimeBtn) {
            continueArrivalTimeBtn.addEventListener('click', () => {
                showNextQuestion('q10');
            });
        }
        
        // Departure date - advance immediately on selection
        document.querySelectorAll('input[name="departure-date"]').forEach(radio => {
            radio.addEventListener('change', () => {
                showNextQuestion('q11');
            });
        });
        
        // Transport number - advance on Enter or blur
        const transportNumberInput = document.getElementById('transport-number');
        const continueTransportNumberBtn = document.getElementById('continue-transport-number');
        
        if (transportNumberInput) {
            transportNumberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim().length > 0) {
                e.preventDefault();
                showNextQuestion('q12');
            }
        });
            
            transportNumberInput.addEventListener('blur', (e) => {
                if (e.target.value.trim().length > 0) {
                    showNextQuestion('q12');
                }
            });
        }
        
        if (continueTransportNumberBtn) {
            continueTransportNumberBtn.addEventListener('click', () => {
                showNextQuestion('q12');
            });
        }
        
        // Transport location - advance immediately on selection
        document.querySelectorAll('input[name="transport-location"]').forEach(radio => {
            radio.addEventListener('change', () => {
                showNextQuestion('q13');
            });
        });
        
        // Identity proof - show submit button after file selection
        const identityProofInput = document.getElementById('identity-proof');
        if (identityProofInput) {
            identityProofInput.addEventListener('change', () => {
                if (identityProofInput.files.length > 0) {
                    showSubmitButton();
                }
            });
        }
    }
    
    function setupFamilyMembers() {
        const addFamilyBtn = document.getElementById('add-family-member');
        const continueFamilyBtn = document.getElementById('continue-family');
        const familyContainer = document.getElementById('family-members-container');
        
        if (addFamilyBtn && familyContainer) {
            addFamilyBtn.addEventListener('click', () => {
                const newRow = document.createElement('div');
                newRow.className = 'family-member-row';
                newRow.innerHTML = `
                    <input type="text" name="family-name[]" placeholder="Name" class="family-name">
                    <input type="number" name="family-age[]" placeholder="Age" class="family-age">
                `;
                familyContainer.appendChild(newRow);
            });
        }
        
        if (continueFamilyBtn) {
            continueFamilyBtn.addEventListener('click', () => {
                showNextQuestion('q6');
            });
        }
    }
    
    function showNextQuestion(questionNumber) {
        console.log('Showing next question:', questionNumber); // Debug log
        
        // Mark current question as visible (not active)
        const currentActive = document.querySelector('.question.active');
        console.log('Current active question:', currentActive);
        
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.add('visible');
            console.log('Marking current question as visible:', currentActive.id); // Debug log
        }
        
        // Show new question as active
        const question = document.getElementById(questionNumber);
        console.log('Target question element:', question);
        
        if (question) {
            // Force visibility with inline styles for debugging
            question.style.display = 'block';
            question.style.opacity = '1';
            question.style.transform = 'translateX(0)';
            
            question.classList.add('active');
            // Extract number from question ID (e.g., 'q1' -> 1)
            const questionNum = parseInt(questionNumber.replace('q', ''));
            if (!isNaN(questionNum)) {
                currentQuestion = questionNum;
            }
            console.log('Showing new question as active:', question.id); // Debug log
            
            // Update progress bar
            updateProgressBar();
            
            // Show submit button only on the last question (q13)
            if (questionNumber === 'q13') {
                showSubmitButton();
            } else {
                hideSubmitButton();
            }
            
            // Scroll to the new question
            setTimeout(() => {
                question.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            console.error('Question not found:', questionNumber); // Debug log
        }
    }
    
    function showSubmitButton() {
        const submitContainer = document.getElementById('submit-button-container');
        if (submitContainer) {
            submitContainer.style.display = 'block';
        }
    }
    
    function hideSubmitButton() {
        const submitContainer = document.getElementById('submit-button-container');
        if (submitContainer) {
            submitContainer.style.display = 'none';
        }
    }
    
    function showQuestion(questionNumber) {
        console.log('showQuestion called with:', questionNumber);
        // This function is kept for initialization
        const question = document.getElementById(questionNumber);
        console.log('Question element found:', question);
        
        if (question) {
            console.log('Adding active class to question:', questionNumber);
            question.classList.add('active');
            // Extract number from question ID (e.g., 'q1' -> 1)
            const questionNum = parseInt(questionNumber.replace('q', ''));
            if (!isNaN(questionNum)) {
                currentQuestion = questionNum;
            }
            updateProgressBar();
            console.log('Question should now be visible');
        } else {
            console.error('Question not found:', questionNumber);
        }
    }
    
    function setupOtherInputs() {
        // Travel mode other
        document.querySelectorAll('input[name="travel-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const otherInput = document.getElementById('travel-other');
                if (otherInput) {
                    otherInput.style.display = radio.value === 'other' ? 'block' : 'none';
                }
            });
        });
        
        // Arrival date other
        document.querySelectorAll('input[name="arrival-date"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const otherInput = document.getElementById('arrival-other');
                if (otherInput) {
                    otherInput.style.display = radio.value === 'other' ? 'block' : 'none';
                }
            });
        });
        
        // Arrival location other
        document.querySelectorAll('input[name="arrival-location"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const otherInput = document.getElementById('arrival-other');
                if (otherInput) {
                    otherInput.style.display = radio.value === 'other' ? 'block' : 'none';
                }
            });
        });
        
        // Departure date other
        document.querySelectorAll('input[name="departure-date"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const otherInput = document.getElementById('departure-other');
                if (otherInput) {
                    otherInput.style.display = radio.value === 'other' ? 'block' : 'none';
                }
            });
        });
        
        // Transport location other
        document.querySelectorAll('input[name="transport-location"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const otherInput = document.getElementById('transport-other');
                if (otherInput) {
                    otherInput.style.display = radio.value === 'other' ? 'block' : 'none';
                }
            });
        });
    }
    
    function setupFileValidation() {
        const fileInput = document.getElementById('identity-proof');
        const fileUploadArea = document.getElementById('file-upload-area');
        
        if (!fileInput || !fileUploadArea) return;
        
        // Drag and drop functionality
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#F4B6A6';
            fileUploadArea.style.background = 'rgba(244, 182, 166, 0.1)';
        });
        
        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#8fbc8f';
            fileUploadArea.style.background = 'rgba(143, 188, 143, 0.05)';
        });
        
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#8fbc8f';
            fileUploadArea.style.background = 'rgba(143, 188, 143, 0.05)';
            
            const files = e.dataTransfer.files;
            fileInput.files = files;
            validateFiles(files);
        });
        
        fileInput.addEventListener('change', (e) => {
            validateFiles(e.target.files);
        });
            
        function validateFiles(files) {
            if (files.length === 0) return;
            
            // Check each file
            for (const file of files) {
                const fileName = file.name.toLowerCase();
                
                // Check if it's a PAN card (common patterns)
                if (isPANCard(fileName)) {
                    alert('PAN cards are not accepted. Please upload other identity proof like Aadhaar, Passport, or Driver\'s License.');
                    fileInput.value = '';
                    return;
                }
                
                // Check file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Only JPG, PNG, and PDF files are allowed.');
                    fileInput.value = '';
                    return;
                }
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB.');
                    fileInput.value = '';
                    return;
                }
            }
            
            // Update file upload area to show selected files
            const fileNames = Array.from(files).map(f => f.name).join(', ');
            const content = fileUploadArea.querySelector('.file-upload-content');
            if (content) {
                content.innerHTML = `
                    <span class="file-icon">📎</span>
                    <p>Selected: ${fileNames}</p>
                    <small>Click to change files</small>
                `;
            }
        }
    }
    
    function isPANCard(fileName) {
        const panPatterns = [
            /pan/i,
            /pancard/i,
            /pan_card/i,
            /pan-card/i,
            /permanent_account_number/i
        ];
        
        return panPatterns.some(pattern => pattern.test(fileName));
    }
    
    function setupAdminPanel() {
        const adminToggle = document.getElementById('admin-toggle');
        const adminPanel = document.getElementById('admin-panel');
        const downloadBtn = document.getElementById('download-all-rsvp');
        const clearBtn = document.getElementById('clear-all-data');
        const responseCount = document.getElementById('response-count');
        
        if (!adminToggle || !adminPanel) return;
        
        // Toggle admin panel
        adminToggle.addEventListener('click', () => {
            const isVisible = adminPanel.style.display !== 'none';
            adminPanel.style.display = isVisible ? 'none' : 'block';
            adminToggle.textContent = isVisible ? 'Admin Access' : 'Hide Admin';
            
            if (!isVisible) {
                updateResponseCount();
            }
        });
        
        // Download all RSVP data
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const allData = JSON.parse(localStorage.getItem('rsvpData') || '[]');
                if (allData.length === 0) {
                    alert('No RSVP data found.');
                    return;
                }
                exportToExcel(allData);
            });
        }
        
        // Clear all data
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all RSVP data? This cannot be undone.')) {
                    localStorage.removeItem('rsvpData');
                    updateResponseCount();
                    alert('All RSVP data has been cleared.');
                }
            });
        }
        
        function updateResponseCount() {
            const allData = JSON.parse(localStorage.getItem('rsvpData') || '[]');
            if (responseCount) {
                responseCount.textContent = allData.length;
            }
        }
    }
    
    function submitRSVP() {
        const formData = new FormData(rsvpForm);
        const attending = formData.get('attending');
        const fullName = formData.get('full-name');
        
        if (!fullName || !attending) {
            showRSVPMessage('Please complete the required fields.', 'error', rsvpMessage);
            return;
        }
        
        // Store RSVP data
        storeRSVPData(formData);
        
        // Show thank you screen
        showThankYouScreen(fullName, attending === 'yes');
    }
    
    function showThankYouScreen(name, attending) {
        const formContainer = document.querySelector('.rsvp-form-container');
        if (!formContainer) return;
        
        const thankYouHTML = `
            <div class="thank-you-screen">
                <div class="thank-you-icon">${attending ? '✅' : '💛'}</div>
                <h2 class="thank-you-title">
                    ${attending 
                        ? `Thank you, ${name}! We can't wait to celebrate with you 💍✨` 
                        : `Thank you for your response, ${name}. We will miss you 💛`
                    }
                </h2>
                <p class="thank-you-message">
                    ${attending ? 'Your RSVP has been recorded.' : 'Your note has been saved. Thank you.'}
                </p>
                <button class="btn btn-primary" onclick="location.reload()">Go Back to Home Page</button>
            </div>
        `;
        
        formContainer.innerHTML = thankYouHTML;
    }
    
    function resetForm() {
        rsvpForm.reset();
        showQuestion('q1');
        isAttending = false;
        
        // Hide all "other" inputs
        document.querySelectorAll('input[id$="-other"]').forEach(input => {
            input.style.display = 'none';
        });
        
        // Reset file upload area
        const fileUploadArea = document.getElementById('file-upload-area');
        if (fileUploadArea) {
            const content = fileUploadArea.querySelector('.file-upload-content');
            if (content) {
                content.innerHTML = `
                    <span class="file-icon">📎</span>
                    <p>Drag and drop your ID here, or click to browse</p>
                    <small>JPG, PNG, PDF only, max 5MB. PAN cards not accepted.</small>
                `;
            }
        }
    }
}

// Store RSVP data locally (no download)
function storeRSVPData(formData) {
    const rsvpData = {
        timestamp: new Date().toISOString(),
        fullName: formData.get('full-name'),
        attending: formData.get('attending'),
        mobile: formData.get('mobile') || '',
        age: formData.get('age') || '',
        familyMembers: formData.get('family-members') || '',
        travelMode: formData.get('travel-mode') || '',
        travelOther: formData.get('travel-other') || '',
        arrivalDate: formData.get('arrival-date') || '',
        arrivalLocation: formData.get('arrival-location') || '',
        arrivalOther: formData.get('arrival-other') || '',
        arrivalTime: formData.get('arrival-time') || '',
        departureDate: formData.get('departure-date') || '',
        departureOther: formData.get('departure-other') || '',
        transportNumber: formData.get('transport-number') || '',
        transportLocation: formData.get('transport-location') || '',
        transportOther: formData.get('transport-other') || '',
        identityProof: formData.get('identity-proof') ? formData.get('identity-proof').name : ''
    };
    
    // Get existing data from localStorage
    let allRSVPData = JSON.parse(localStorage.getItem('rsvpData') || '[]');
    allRSVPData.push(rsvpData);
    
    // Save to localStorage
    localStorage.setItem('rsvpData', JSON.stringify(allRSVPData));
}

// Export RSVP data to Excel
function exportToExcel(data) {
    // Create CSV content (Excel compatible)
    const headers = [
        'Timestamp', 'Full Name', 'Attending', 'Mobile', 'Age', 'Family Members',
        'Travel Mode', 'Travel Other', 'Arrival Date', 'Arrival Location', 'Arrival Other',
        'Arrival Time', 'Departure Date', 'Departure Other', 'Transport Number',
        'Transport Location', 'Transport Other', 'Identity Proof'
    ];
    
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            row.timestamp,
            `"${row.fullName}"`,
            row.attending,
            `"${row.mobile}"`,
            row.age,
            `"${row.familyMembers}"`,
            row.travelMode,
            `"${row.travelOther}"`,
            row.arrivalDate,
            row.arrivalLocation,
            `"${row.arrivalOther}"`,
            `"${row.arrivalTime}"`,
            row.departureDate,
            `"${row.departureOther}"`,
            `"${row.transportNumber}"`,
            row.transportLocation,
            `"${row.transportOther}"`,
            `"${row.identityProof}"`
        ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `RSVP_Data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showRSVPMessage(message, type, messageElement) {
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = `rsvp-message ${type}`;
    messageElement.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Photo Gallery Lightbox
function initPhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (photoItems.length === 0 || !lightbox) return; // No photos or lightbox on this page
    
    let currentPhotoIndex = 0;
    const photos = Array.from(photoItems);
    
    photoItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentPhotoIndex = index;
            showLightbox(photos[currentPhotoIndex].querySelector('img').src);
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', hideLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
            showLightbox(photos[currentPhotoIndex].querySelector('img').src);
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            showLightbox(photos[currentPhotoIndex].querySelector('img').src);
        });
    }
    
    // Close lightbox when clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            hideLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                hideLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
                showLightbox(photos[currentPhotoIndex].querySelector('img').src);
            } else if (e.key === 'ArrowRight') {
                currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
                showLightbox(photos[currentPhotoIndex].querySelector('img').src);
            }
        }
    });
}

function showLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    if (!lightbox || !lightboxImage) return;
    
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.faq-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Form Validation Helpers
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return; // nothing to attach to

    let errorElement = formGroup.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    if (field && field.style) field.style.borderColor = '#dc3545';
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) {
        // Input isn't inside a .form-group (e.g., custom file/choice inputs)
        // Just reset the border and exit safely.
        if (field && field.style) field.style.removeProperty('border-color');
        return;
    }

    const errorElement = formGroup.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    if (field && field.style) field.style.borderColor = '#e9ecef';
}

// Add real-time validation to form fields
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('#rsvp-form input, #rsvp-form textarea, #rsvp-form select');
    
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Couple Message Popup
function initCouplePopup() {
    const popup = document.getElementById('couple-popup');
    const popupClose = document.getElementById('popup-close');
    const popupContinue = document.getElementById('popup-continue');
    
    // Show popup
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    
    // Close popup
    popupClose.addEventListener('click', () => {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
        sessionStorage.setItem('popupShown', 'true');
    });
    
    // Continue button - scroll to home section
    popupContinue.addEventListener('click', () => {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
        sessionStorage.setItem('popupShown', 'true');
        // Scroll to home section (top of page)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
            sessionStorage.setItem('popupShown', 'true');
        }
    });
}

// Add to Calendar functionality
function initAddToCalendar() {
    const calendarButtons = document.querySelectorAll('.add-to-calendar');
    
    calendarButtons.forEach(button => {
        // Add both click and touchstart events for better mobile support
        const handleCalendarClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Calendar button clicked:', button.getAttribute('data-event'));
            
            const event = button.getAttribute('data-event');
            const date = button.getAttribute('data-date');
            const time = button.getAttribute('data-time');
            
            // Create calendar event data
            const startDate = new Date(`${date}T${time.split('-')[0]}:00`);
            const endDate = new Date(`${date}T${time.split('-')[1]}:00`);
            
            // Format dates for different calendar services
            const formatDate = (date) => {
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };
            
            const startFormatted = formatDate(startDate);
            const endFormatted = formatDate(endDate);
            
            // Create Google Calendar URL
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event)}&dates=${startFormatted}/${endFormatted}&location=${encodeURIComponent('Whistling Woodzs Jungle Resort, Dandeli, Karnataka, India')}&details=${encodeURIComponent('Sakshi & Mithil Wedding Event')}`;
            
            // Create Outlook Calendar URL
            const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event)}&startdt=${startFormatted}&enddt=${endFormatted}&location=${encodeURIComponent('Whistling Woodzs Jungle Resort, Dandeli, Karnataka, India')}&body=${encodeURIComponent('Sakshi & Mithil Wedding Event')}`;
            
            // Create Apple Calendar URL
            const appleUrl = `https://calendar.apple.com/event?title=${encodeURIComponent(event)}&start=${startFormatted}&end=${endFormatted}&location=${encodeURIComponent('Whistling Woodzs Jungle Resort, Dandeli, Karnataka, India')}&notes=${encodeURIComponent('Sakshi & Mithil Wedding Event')}`;
            
            // Show calendar options
            showCalendarOptions(event, googleUrl, outlookUrl, appleUrl);
        };
        
        // Add both click and touchstart events
        button.addEventListener('click', handleCalendarClick);
        button.addEventListener('touchstart', handleCalendarClick);
        
        // Ensure button is properly styled for mobile
        button.style.cursor = 'pointer';
        button.style.touchAction = 'manipulation';
        button.style.userSelect = 'none';
    });
}

function showCalendarOptions(eventName, googleUrl, outlookUrl, appleUrl) {
    // Create modal for calendar options
    const modal = document.createElement('div');
    modal.className = 'calendar-modal';
    modal.innerHTML = `
        <div class="calendar-modal-content">
            <h3>Add "${eventName}" to Calendar</h3>
            <p>Choose your preferred calendar:</p>
            <div class="calendar-options">
                <a href="${googleUrl}" target="_blank" class="calendar-option google">
                    <span class="calendar-icon">📅</span>
                    Google Calendar
                </a>
                <a href="${outlookUrl}" target="_blank" class="calendar-option outlook">
                    <span class="calendar-icon">📅</span>
                    Outlook Calendar
                </a>
                <a href="${appleUrl}" target="_blank" class="calendar-option apple">
                    <span class="calendar-icon">📅</span>
                    Apple Calendar
                </a>
            </div>
            <button class="calendar-close">Close</button>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .calendar-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 4000;
        }
        .calendar-modal-content {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        }
        .calendar-modal h3 {
            color: #4B553F;
            margin-bottom: 1rem;
        }
        .calendar-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 2rem 0;
        }
        .calendar-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #F4F1DE;
            border-radius: 10px;
            text-decoration: none;
            color: #4B553F;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .calendar-option:hover {
            background: #4B553F;
            color: #F4F1DE;
            transform: translateY(-2px);
        }
        .calendar-icon {
            font-size: 1.5rem;
        }
        .calendar-close {
            background: #4B553F;
            color: #F4F1DE;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal
    const closeBtn = modal.querySelector('.calendar-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
        document.body.style.overflow = 'auto';
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
            document.body.style.overflow = 'auto';
        }
    });
}

// Parallax and Scroll Effects
function initParallaxEffects() {
    const heroBackground = document.querySelector('.hero-background');
    const heroImage = document.querySelector('.hero-image');
    const heroOverlay = document.querySelector('.hero-overlay');
    const storyImages = document.querySelectorAll('.story-image img');
    const photoItems = document.querySelectorAll('.photo-item');
    
    // Parallax scroll effect for hero background
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        // Simple blur effect on scroll
        if (heroImage) {
            const blurAmount = Math.min(scrolled / 400, 1);
            heroImage.style.filter = `brightness(0.7) contrast(1.2) blur(${blurAmount}px)`;
        }
        
        // Overlay opacity change
        if (heroOverlay) {
            const opacity = Math.min(0.4 + (scrolled / 1000), 0.8);
            heroOverlay.style.opacity = opacity;
        }
        
        // Story images - no parallax effect (fixed position)
        storyImages.forEach((img, index) => {
            // Remove any transform effects to keep image fixed
            img.style.transform = 'none';
        });
        
        // Photo gallery effects
        photoItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const centerY = window.innerHeight / 2;
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(centerY - itemCenter);
                const maxDistance = window.innerHeight / 2;
                const blurAmount = (distance / maxDistance) * 2;
                
                if (blurAmount > 1) {
                    item.classList.add('blur');
                    item.classList.remove('focus');
                } else {
                    item.classList.remove('blur');
                    if (blurAmount < 0.3) {
                        item.classList.add('focus');
                    } else {
                        item.classList.remove('focus');
                    }
                }
            }
        });
    }
    
    // Throttled scroll event
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    function handleScroll() {
        ticking = false;
        requestTick();
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    updateParallax();
    
    // Smooth reveal animation for photos
    const photoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    photoItems.forEach(item => {
        photoObserver.observe(item);
    });
    
}



// Console message for developers
// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            
            // Remove from DOM after fade animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                sessionStorage.setItem('loadingShown', 'true');
            }, 800);
        }
    }, 3000);
}


// Mobile Menu Functionality
function initMobileMenu() {
    if (!hamburger || !navMenu) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Navigation Function
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal navigation (not external links)
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                
                // Add loading state to clicked link
                this.style.opacity = '0.7';
                this.style.transform = 'scale(0.95)';
                
                // Add page transition effect
                document.body.style.opacity = '0.8';
                document.body.style.transition = 'opacity 0.2s ease';
                
                // Navigate after short delay for smooth transition
                setTimeout(() => {
                    window.location.href = this.href;
                }, 150);
            }
        });
    });
}

// Hearts Animation Function
function initHeartsAnimation() {
    const heartsContainer = document.getElementById('hearts-container');
    
    if (!heartsContainer) return;
    
    // Create hearts for 3 seconds
    const heartInterval = setInterval(() => {
        createHeart();
    }, 150); // Create a heart every 150ms
    
    // Stop creating hearts after 3 seconds
    setTimeout(() => {
        clearInterval(heartInterval);
    }, 3000);
}

function createHeart() {
    const heartsContainer = document.getElementById('hearts-container');
    if (!heartsContainer) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Random horizontal position
    heart.style.left = Math.random() * 100 + '%';
    
    // Random size variation
    const size = 15 + Math.random() * 10; // 15px to 25px
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    // Random color variation
    const colors = ['#ff6b6b', '#ff8e8e', '#ffa8a8', '#ffb3ba', '#ffc0cb'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    heart.style.background = randomColor;
    
    heartsContainer.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 3000);
}

console.log('🎉 Wedding Website Loaded Successfully!');
console.log('💍 Sakshi & Mithil - December 1-2, 2025');
console.log('📍 Whistling Woodz Jungle Resort, Karnataka');
console.log('📧 Questions? Contact: hello@sakshiandmithil.com');
