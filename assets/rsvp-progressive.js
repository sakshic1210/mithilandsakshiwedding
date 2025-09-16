// Progressive RSVP Form JavaScript
class ProgressiveRSVP {
    constructor() {
        console.log('ProgressiveRSVP constructor called');
        this.currentStep = 1;
        this.totalSteps = 13;
        this.formData = {};
        this.isAttending = null;
        
        this.init();
    }

    init() {
        console.log('ProgressiveRSVP init() called');
        this.setupEventListeners();
        this.updateStep();
        this.updateProgress();
        this.setupAdminPanel();
        console.log('ProgressiveRSVP initialization complete');
    }

    setupEventListeners() {
        // Prevent default form submission
        const form = document.getElementById('rsvp-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle submission through our custom logic
                if (this.currentStep === this.totalSteps) {
                    this.submitForm(e);
                } else {
                    this.nextStep();
                }
            });
        }

        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('submitBtn').addEventListener('click', (e) => this.submitForm(e));
        
        // "No" response submit button
        document.getElementById('submitBtnNo').addEventListener('click', (e) => this.submitNoResponse(e));

        // Enter key navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                // Check if we're in a form input
                const activeElement = document.activeElement;
                const isFormInput = activeElement && (
                    activeElement.tagName === 'INPUT' || 
                    activeElement.tagName === 'SELECT' || 
                    activeElement.tagName === 'TEXTAREA'
                );
                
                if (isFormInput) {
                    e.preventDefault();
                    
                    // Small delay to ensure any input events are processed
                    setTimeout(() => {
                        // If it's the last step, submit the form
                        if (this.currentStep === this.totalSteps) {
                            this.submitForm(e);
                        } else {
                            // Otherwise, go to next step
                            this.nextStep();
                        }
                    }, 50);
                }
            }
        });

        // Setup initial choice cards
        this.setupChoiceCards();

        // Family members
        document.querySelector('.add-member-btn').addEventListener('click', () => this.addFamilyMember());
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-member')) {
                this.removeFamilyMember(e.target);
            }
        });

        // File upload
        this.setupFileUpload();

        // Form inputs
        this.setupFormInputs();
    }

    setupFormInputs() {
        // Phone number formatting based on country code
        document.getElementById('mobileNumber').addEventListener('input', (e) => {
            const countryCode = document.getElementById('countryCode').value;
            let maxLength = 10; // Default for India
            
            // Set max length based on country code
            if (countryCode === '+1') maxLength = 10; // US/Canada
            else if (countryCode === '+44') maxLength = 11; // UK
            else if (countryCode === '+61') maxLength = 9; // Australia
            else if (countryCode === '+971') maxLength = 9; // UAE
            else if (countryCode === '+966') maxLength = 9; // Saudi Arabia
            else if (countryCode === '+974') maxLength = 8; // Qatar
            else if (countryCode === '+965') maxLength = 8; // Kuwait
            else if (countryCode === '+973') maxLength = 8; // Bahrain
            else if (countryCode === '+968') maxLength = 8; // Oman
            else if (countryCode === '+60') maxLength = 10; // Malaysia
            else if (countryCode === '+65') maxLength = 8; // Singapore
            else if (countryCode === '+66') maxLength = 9; // Thailand
            else if (countryCode === '+63') maxLength = 10; // Philippines
            else if (countryCode === '+62') maxLength = 11; // Indonesia
            else if (countryCode === '+84') maxLength = 9; // Vietnam
            else if (countryCode === '+86') maxLength = 11; // China
            else if (countryCode === '+81') maxLength = 11; // Japan
            else if (countryCode === '+82') maxLength = 11; // South Korea
            else if (countryCode === '+49') maxLength = 11; // Germany
            else if (countryCode === '+33') maxLength = 9; // France
            else if (countryCode === '+39') maxLength = 10; // Italy
            else if (countryCode === '+34') maxLength = 9; // Spain
            else if (countryCode === '+31') maxLength = 9; // Netherlands
            else if (countryCode === '+41') maxLength = 9; // Switzerland
            else if (countryCode === '+43') maxLength = 10; // Austria
            else if (countryCode === '+45') maxLength = 8; // Denmark
            else if (countryCode === '+46') maxLength = 9; // Sweden
            else if (countryCode === '+47') maxLength = 8; // Norway
            else if (countryCode === '+358') maxLength = 9; // Finland
            else if (countryCode === '+7') maxLength = 10; // Russia
            else if (countryCode === '+380') maxLength = 9; // Ukraine
            else if (countryCode === '+48') maxLength = 9; // Poland
            else if (countryCode === '+420') maxLength = 9; // Czech Republic
            else if (countryCode === '+36') maxLength = 9; // Hungary
            else if (countryCode === '+40') maxLength = 9; // Romania
            else if (countryCode === '+359') maxLength = 9; // Bulgaria
            else if (countryCode === '+385') maxLength = 9; // Croatia
            else if (countryCode === '+386') maxLength = 8; // Slovenia
            else if (countryCode === '+421') maxLength = 9; // Slovakia
            else if (countryCode === '+372') maxLength = 8; // Estonia
            else if (countryCode === '+371') maxLength = 8; // Latvia
            else if (countryCode === '+370') maxLength = 8; // Lithuania
            else if (countryCode === '+90') maxLength = 10; // Turkey
            else if (countryCode === '+30') maxLength = 10; // Greece
            else if (countryCode === '+357') maxLength = 8; // Cyprus
            else if (countryCode === '+356') maxLength = 8; // Malta
            else if (countryCode === '+39') maxLength = 10; // Vatican
            else if (countryCode === '+378') maxLength = 8; // San Marino
            else if (countryCode === '+377') maxLength = 8; // Monaco
            else if (countryCode === '+376') maxLength = 6; // Andorra
            else if (countryCode === '+375') maxLength = 9; // Belarus
            else if (countryCode === '+373') maxLength = 8; // Moldova
            else if (countryCode === '+355') maxLength = 9; // Albania
            else if (countryCode === '+389') maxLength = 8; // Macedonia
            else if (countryCode === '+382') maxLength = 8; // Montenegro
            else if (countryCode === '+381') maxLength = 9; // Serbia
            else if (countryCode === '+387') maxLength = 8; // Bosnia
            else if (countryCode === '+383') maxLength = 8; // Kosovo
            
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
        });

        // Country code change handler
        document.getElementById('countryCode').addEventListener('change', (e) => {
            // Clear the phone number when country changes
            document.getElementById('mobileNumber').value = '';
            // Trigger input event to apply new formatting
            document.getElementById('mobileNumber').dispatchEvent(new Event('input'));
        });

        // Checkbox for arrival time
        document.getElementById('arrivalTimeNotConfirmed').addEventListener('change', (e) => {
            const timeInput = document.getElementById('arrivalTime');
            if (e.target.checked) {
                timeInput.disabled = true;
                timeInput.value = '';
                // Don't set pointer-events: none to allow time picker to work
                timeInput.style.opacity = '0.7';
            } else {
                timeInput.disabled = false;
                timeInput.style.opacity = '1';
            }
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('identityProof');
        const filePreview = document.getElementById('filePreview');

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Remove file
        document.querySelector('.remove-file').addEventListener('click', () => {
            this.removeFile();
        });
    }

    handleFileUpload(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            this.showError('identityProofError', 'Please upload JPG, PNG, or PDF files only.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('identityProofError', 'File size must be less than 5MB.');
            return;
        }

        // Check for PAN card (basic check)
        if (file.name.toLowerCase().includes('pan')) {
            this.showError('identityProofError', 'PAN cards are not accepted. Please upload Aadhaar, Passport, or Driver\'s License.');
            return;
        }

        // Clear any previous errors
        this.clearError('identityProofError');

        // Show file preview
        const filePreview = document.getElementById('filePreview');
        const fileName = filePreview.querySelector('.file-name');
        const fileSize = filePreview.querySelector('.file-size');

        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);

        document.getElementById('fileUploadArea').style.display = 'none';
        filePreview.style.display = 'flex';

        // Store file
        this.formData.identityProof = file;
    }

    removeFile() {
        document.getElementById('fileUploadArea').style.display = 'block';
        document.getElementById('filePreview').style.display = 'none';
        document.getElementById('identityProof').value = '';
        delete this.formData.identityProof;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleChoiceCard(e) {
        const card = e.currentTarget;
        const value = card.dataset.value;
        const stepId = card.closest('.form-step').id;
        
        // Remove active class from siblings
        card.parentElement.querySelectorAll('.choice-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Store the value
        this.formData[this.getFieldName(stepId)] = value;

        // Handle special cases
        if (stepId === 'step2') {
            console.log('Step 2 choice selected:', value);
            this.isAttending = value === 'yes';
            if (value === 'no') {
                console.log('No response selected - showing thank you screen');
                this.showThankYouNo();
                return;
            }
        }

        // Show other input if needed
        this.handleOtherInput(stepId, value);

        // Clear error
        this.clearError(this.getErrorId(stepId));

        // Auto-advance to next step after a short delay (except for step2 which handles its own navigation)
        if (stepId !== 'step2') {
            setTimeout(() => {
                console.log('Auto-advancing to next step for step:', stepId);
                this.nextStep();
            }, 300);
        } else {
            console.log('Step 2 - no auto-advance');
        }
    }

    getFieldName(stepId) {
        const fieldMap = {
            'step2': 'attending',
            'step6': 'travelMode',
            'step7': 'arrivalDate',
            'step8': 'arrivalLocation',
            'step10': 'departureDate',
            'step12': 'departureLocation'
        };
        return fieldMap[stepId] || '';
    }

    getErrorId(stepId) {
        const errorMap = {
            'step2': 'attendingError',
            'step6': 'travelModeError',
            'step7': 'arrivalDateError',
            'step8': 'arrivalLocationError',
            'step10': 'departureDateError',
            'step12': 'departureLocationError'
        };
        return errorMap[stepId] || '';
    }

    handleOtherInput(stepId, value) {
        const otherInputs = {
            'step6': 'travelOtherInput',
            'step7': 'arrivalOtherInput',
            'step8': 'arrivalLocationOtherInput',
            'step10': 'departureOtherInput',
            'step12': 'departureLocationOtherInput'
        };

        const inputId = otherInputs[stepId];
        if (inputId) {
            const otherInput = document.getElementById(inputId);
            if (value === 'other') {
                otherInput.style.display = 'block';
            } else {
                otherInput.style.display = 'none';
                // Clear other input value
                const input = otherInput.querySelector('input');
                if (input) input.value = '';
            }
        }
    }

    addFamilyMember() {
        const container = document.querySelector('.family-members-container');
        const index = container.children.length;
        
        const memberDiv = document.createElement('div');
        memberDiv.className = 'family-member';
        memberDiv.dataset.index = index;
        
        memberDiv.innerHTML = `
            <input type="text" name="familyName[]" placeholder="Full name" required>
            <input type="number" name="familyAge[]" placeholder="Age" min="1" max="120" required>
            <button type="button" class="remove-member">×</button>
        `;
        
        container.appendChild(memberDiv);
        
        // Focus first input in the new row
        setTimeout(() => {
            const firstInput = memberDiv.querySelector('input[type="text"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        // Show remove buttons if more than one member
        if (container.children.length > 1) {
            container.querySelectorAll('.remove-member').forEach(btn => btn.style.display = 'block');
        }
    }

    removeFamilyMember(button) {
        const member = button.closest('.family-member');
        const container = document.querySelector('.family-members-container');
        
        member.remove();
        
        // Hide remove buttons if only one member left
        if (container.children.length === 1) {
            container.querySelector('.remove-member').style.display = 'none';
        }
    }

    setupChoiceCards() {
        // Setup choice cards for the current step
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (currentStepElement) {
            const choiceCards = currentStepElement.querySelectorAll('.choice-card');
            choiceCards.forEach(card => {
                // Remove existing event listeners by cloning the element
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
                
                // Add click event
                newCard.addEventListener('click', (e) => this.handleChoiceCard(e));
                
                // Add keyboard support
                newCard.setAttribute('tabindex', '0');
                newCard.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleChoiceCard(e);
                    }
                });
            });
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateStep();
            this.updateProgress();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStep();
            this.updateProgress();
        }
    }

    updateStep() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            
            // Setup choice cards for this step
            this.setupChoiceCards();
            
            // Show navigation for normal steps (not success screens)
            const mainNavigation = document.getElementById('mainNavigation');
            if (mainNavigation && !currentStepElement.classList.contains('success-screen')) {
                mainNavigation.style.display = 'flex';
            }
            
            // Focus first input in the new step and scroll into view
            setTimeout(() => {
                const firstFocusable = currentStepElement.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), .choice-card');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
                currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        const rsvpNavigation = document.querySelector('.rsvp-navigation');

        // Show/hide Previous button
        if (this.currentStep > 1) {
            prevBtn.style.display = 'block';
            if (rsvpNavigation) rsvpNavigation.classList.remove('next-only');
            console.log('Step > 1: Removed next-only class');
        } else {
            prevBtn.style.display = 'none';
            if (rsvpNavigation) {
                rsvpNavigation.classList.add('next-only');
                console.log('Step 1: Added next-only class to:', rsvpNavigation);
                console.log('Current classes:', rsvpNavigation.className);
            }
        }
        
        // Show/hide Next or Submit button
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.textContent = 'Submit RSVP';
            // Center the submit button when it's the only button visible
            const mainNavigation = document.getElementById('mainNavigation');
            if (mainNavigation) {
                mainNavigation.style.justifyContent = 'center';
            }
            console.log('Last step reached - Submit button should be visible');
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
            nextBtn.textContent = '→';
            // Reset to space-between for normal navigation
            const mainNavigation = document.getElementById('mainNavigation');
            if (mainNavigation) {
                mainNavigation.style.justifyContent = 'space-between';
            }
            console.log(`Step ${this.currentStep} - Next button should be visible`);
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        
        // Debug log to ensure progress updates correctly
        console.log(`Progress updated: Step ${this.currentStep} of ${this.totalSteps} (${percentage.toFixed(1)}%)`);
    }

    validateCurrentStep() {
        const stepId = `step${this.currentStep}`;
        const stepElement = document.getElementById(stepId);
        
        if (!stepElement) return true;

        // Clear previous errors
        this.clearAllErrors();

        switch (this.currentStep) {
            case 1:
                return this.validateFullName();
            case 2:
                return this.validateAttending();
            case 3:
                return this.validateMobileNumber();
            case 4:
                return this.validateAge();
            case 5:
                return this.validateFamilyMembers();
            case 6:
                return this.validateTravelMode();
            case 7:
                return this.validateArrivalDate();
            case 8:
                return this.validateArrivalLocation();
            case 9:
                return this.validateArrivalTime();
            case 10:
                return this.validateDepartureDate();
            case 11:
                return this.validateTransportNumber();
            case 12:
                return this.validateDepartureLocation();
            case 13:
                return this.validateIdentityProof();
            default:
                return true;
        }
    }

    validateFullName() {
        const name = document.getElementById('fullName').value.trim();
        if (!name) {
            this.showError('fullNameError', 'Please enter your full name.');
            return false;
        }
        this.formData.fullName = name;
        return true;
    }

    validateAttending() {
        const attending = this.formData.attending;
        if (!attending) {
            this.showError('attendingError', 'Please select whether you will be attending.');
            return false;
        }
        return true;
    }

    validateMobileNumber() {
        const mobile = document.getElementById('mobileNumber').value.trim();
        const countryCode = document.getElementById('countryCode').value;
        
        if (!mobile) {
            this.showError('mobileNumberError', 'Please enter your mobile number.');
            return false;
        }
        
        // Get expected length based on country code
        let expectedLength = 10; // Default for India
        
        if (countryCode === '+1') expectedLength = 10; // US/Canada
        else if (countryCode === '+44') expectedLength = 11; // UK
        else if (countryCode === '+61') expectedLength = 9; // Australia
        else if (countryCode === '+971') expectedLength = 9; // UAE
        else if (countryCode === '+966') expectedLength = 9; // Saudi Arabia
        else if (countryCode === '+974') expectedLength = 8; // Qatar
        else if (countryCode === '+965') expectedLength = 8; // Kuwait
        else if (countryCode === '+973') expectedLength = 8; // Bahrain
        else if (countryCode === '+968') expectedLength = 8; // Oman
        else if (countryCode === '+60') expectedLength = 10; // Malaysia
        else if (countryCode === '+65') expectedLength = 8; // Singapore
        else if (countryCode === '+66') expectedLength = 9; // Thailand
        else if (countryCode === '+63') expectedLength = 10; // Philippines
        else if (countryCode === '+62') expectedLength = 11; // Indonesia
        else if (countryCode === '+84') expectedLength = 9; // Vietnam
        else if (countryCode === '+86') expectedLength = 11; // China
        else if (countryCode === '+81') expectedLength = 11; // Japan
        else if (countryCode === '+82') expectedLength = 11; // South Korea
        else if (countryCode === '+49') expectedLength = 11; // Germany
        else if (countryCode === '+33') expectedLength = 9; // France
        else if (countryCode === '+39') expectedLength = 10; // Italy
        else if (countryCode === '+34') expectedLength = 9; // Spain
        else if (countryCode === '+31') expectedLength = 9; // Netherlands
        else if (countryCode === '+41') expectedLength = 9; // Switzerland
        else if (countryCode === '+43') expectedLength = 10; // Austria
        else if (countryCode === '+45') expectedLength = 8; // Denmark
        else if (countryCode === '+46') expectedLength = 9; // Sweden
        else if (countryCode === '+47') expectedLength = 8; // Norway
        else if (countryCode === '+358') expectedLength = 9; // Finland
        else if (countryCode === '+7') expectedLength = 10; // Russia
        else if (countryCode === '+380') expectedLength = 9; // Ukraine
        else if (countryCode === '+48') expectedLength = 9; // Poland
        else if (countryCode === '+420') expectedLength = 9; // Czech Republic
        else if (countryCode === '+36') expectedLength = 9; // Hungary
        else if (countryCode === '+40') expectedLength = 9; // Romania
        else if (countryCode === '+359') expectedLength = 9; // Bulgaria
        else if (countryCode === '+385') expectedLength = 9; // Croatia
        else if (countryCode === '+386') expectedLength = 8; // Slovenia
        else if (countryCode === '+421') expectedLength = 9; // Slovakia
        else if (countryCode === '+372') expectedLength = 8; // Estonia
        else if (countryCode === '+371') expectedLength = 8; // Latvia
        else if (countryCode === '+370') expectedLength = 8; // Lithuania
        else if (countryCode === '+90') expectedLength = 10; // Turkey
        else if (countryCode === '+30') expectedLength = 10; // Greece
        else if (countryCode === '+357') expectedLength = 8; // Cyprus
        else if (countryCode === '+356') expectedLength = 8; // Malta
        else if (countryCode === '+39') expectedLength = 10; // Vatican
        else if (countryCode === '+378') expectedLength = 8; // San Marino
        else if (countryCode === '+377') expectedLength = 8; // Monaco
        else if (countryCode === '+376') expectedLength = 6; // Andorra
        else if (countryCode === '+375') expectedLength = 9; // Belarus
        else if (countryCode === '+373') expectedLength = 8; // Moldova
        else if (countryCode === '+355') expectedLength = 9; // Albania
        else if (countryCode === '+389') expectedLength = 8; // Macedonia
        else if (countryCode === '+382') expectedLength = 8; // Montenegro
        else if (countryCode === '+381') expectedLength = 9; // Serbia
        else if (countryCode === '+387') expectedLength = 8; // Bosnia
        else if (countryCode === '+383') expectedLength = 8; // Kosovo
        
        if (mobile.length !== expectedLength) {
            this.showError('mobileNumberError', `Please enter a valid ${expectedLength}-digit mobile number for ${countryCode}.`);
            return false;
        }
        
        this.formData.mobileNumber = mobile;
        this.formData.countryCode = countryCode;
        return true;
    }

    validateAge() {
        const age = document.getElementById('age').value;
        if (!age) {
            this.showError('ageError', 'Please enter your age.');
            return false;
        }
        if (age < 1 || age > 120) {
            this.showError('ageError', 'Please enter a valid age.');
            return false;
        }
        this.formData.age = parseInt(age);
        return true;
    }

    validateFamilyMembers() {
        const members = document.querySelectorAll('.family-member');
        const familyData = [];
        
        for (let member of members) {
            const name = member.querySelector('input[name="familyName[]"]').value.trim();
            const age = member.querySelector('input[name="familyAge[]"]').value;
            
            if (name && age) {
                familyData.push({ name, age: parseInt(age) });
            } else if (name || age) {
                this.showError('familyMembersError', 'Please fill in both name and age for all family members.');
                return false;
            }
        }
        
        this.formData.familyMembers = familyData;
        return true;
    }

    validateTravelMode() {
        const travelMode = this.formData.travelMode;
        if (!travelMode) {
            this.showError('travelModeError', 'Please select your travel mode.');
            return false;
        }
        
        if (travelMode === 'other') {
            const otherValue = document.getElementById('travelOther').value.trim();
            if (!otherValue) {
                this.showError('travelModeError', 'Please specify your travel mode.');
                return false;
            }
            this.formData.travelOther = otherValue;
        }
        
        return true;
    }

    validateArrivalDate() {
        const arrivalDate = this.formData.arrivalDate;
        if (!arrivalDate) {
            this.showError('arrivalDateError', 'Please select your arrival date.');
            return false;
        }
        
        if (arrivalDate === 'other') {
            const otherValue = document.getElementById('arrivalOther').value;
            if (!otherValue) {
                this.showError('arrivalDateError', 'Please select your arrival date.');
                return false;
            }
            this.formData.arrivalOther = otherValue;
        }
        
        return true;
    }

    validateArrivalLocation() {
        const arrivalLocation = this.formData.arrivalLocation;
        if (!arrivalLocation) {
            this.showError('arrivalLocationError', 'Please select your arrival location.');
            return false;
        }
        
        if (arrivalLocation === 'other') {
            const otherValue = document.getElementById('arrivalLocationOther').value.trim();
            if (!otherValue) {
                this.showError('arrivalLocationError', 'Please specify your arrival location.');
                return false;
            }
            this.formData.arrivalLocationOther = otherValue;
        }
        
        return true;
    }

    validateArrivalTime() {
        const timeNotConfirmed = document.getElementById('arrivalTimeNotConfirmed').checked;
        const arrivalTime = document.getElementById('arrivalTime').value;
        
        if (!timeNotConfirmed && !arrivalTime) {
            this.showError('arrivalTimeError', 'Please enter your arrival time or check "Not confirmed yet".');
            return false;
        }
        
        this.formData.arrivalTime = arrivalTime;
        this.formData.arrivalTimeNotConfirmed = timeNotConfirmed;
        return true;
    }

    validateDepartureDate() {
        const departureDate = this.formData.departureDate;
        if (!departureDate) {
            this.showError('departureDateError', 'Please select your departure date.');
            return false;
        }
        
        if (departureDate === 'other') {
            const otherValue = document.getElementById('departureOther').value;
            if (!otherValue) {
                this.showError('departureDateError', 'Please select your departure date.');
                return false;
            }
            this.formData.departureOther = otherValue;
        }
        
        return true;
    }

    validateTransportNumber() {
        const transportNumber = document.getElementById('transportNumber').value.trim();
        // Transport details are optional, so we just store whatever is entered
        this.formData.transportNumber = transportNumber;
        return true;
    }

    validateDepartureLocation() {
        const departureLocation = this.formData.departureLocation;
        if (!departureLocation) {
            this.showError('departureLocationError', 'Please select your departure location.');
            return false;
        }
        
        if (departureLocation === 'other') {
            const otherValue = document.getElementById('departureLocationOther').value.trim();
            if (!otherValue) {
                this.showError('departureLocationError', 'Please specify your departure location.');
                return false;
            }
            this.formData.departureLocationOther = otherValue;
        }
        
        return true;
    }

    validateIdentityProof() {
        // Document upload is now optional - no validation required
        return true;
    }

    showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    showThankYouNo() {
        console.log('showThankYouNo called');
        
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show thank you screen
        const thankYouScreen = document.getElementById('thankYouNo');
        if (thankYouScreen) {
            thankYouScreen.classList.add('active');
            console.log('Thank you screen activated');
        } else {
            console.error('Thank you screen element not found');
        }
        
        // Hide main navigation since the "No" response has its own submit button
        const mainNavigation = document.getElementById('mainNavigation');
        if (mainNavigation) {
            mainNavigation.style.display = 'none';
            console.log('Main navigation hidden');
        } else {
            console.error('Main navigation element not found');
        }
    }

    async submitNoResponse(e) {
        e.preventDefault();
        console.log('submitNoResponse called');
        
        // Get the note from the textarea
        const noteToCouple = document.getElementById('noteToCouple').value.trim();
        
        // Store the "No" response data
        this.formData.noteToCouple = noteToCouple;
        this.formData.attending = 'no';
        this.formData.timestamp = new Date().toISOString();
        
        // Submit to Google Apps Script
        await this.submitRSVPForm(this.formData);
    }

    showNoResponseThankYou() {
        console.log('showNoResponseThankYou called');
        
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show final success screen (reuse the existing success screen but with different message)
        const finalSuccess = document.getElementById('finalSuccess');
        if (finalSuccess) {
            finalSuccess.classList.add('active');
            
            // Update the success message for "No" response
            const successTitle = finalSuccess.querySelector('.success-title');
            const successMessage = finalSuccess.querySelector('.success-message');
            const successIcon = finalSuccess.querySelector('.success-icon');
            
            if (successTitle) {
                successTitle.textContent = `Thank you ${this.formData.fullName}!`;
            }
            
            if (successMessage) {
                successMessage.textContent = 'Thank you for your message to the couple. We appreciate you taking the time to respond.';
            }
            
            if (successIcon) {
                successIcon.textContent = '💛'; // Heart emoji for "No" response
            }
            
            console.log('No response thank you screen activated');
        } else {
            console.error('Final success screen element not found');
        }
        
        // Hide main navigation
        const mainNavigation = document.getElementById('mainNavigation');
        if (mainNavigation) {
            mainNavigation.style.display = 'none';
            console.log('Main navigation hidden');
        } else {
            console.error('Main navigation element not found');
        }
        
        // Update admin panel
        this.updateAdminPanel();
    }

    async submitForm(e) {
        e.preventDefault();
        
        if (this.isAttending === false) {
            // Handle "No" response
            this.formData.noteToCouple = document.getElementById('noteToCouple').value.trim();
            this.formData.attending = 'no';
        }
        
        // Add timestamp
        this.formData.timestamp = new Date().toISOString();
        
        // Submit to Google Apps Script
        await this.submitRSVPForm(this.formData);
    }

    async submitRSVPForm(formData) {
        try {
            const data = new FormData();

            // Add all form fields
            data.append('fullName', formData.fullName || '');
            data.append('attending', formData.attending || '');
            data.append('countryCode', formData.countryCode || '');
            data.append('mobileNumber', formData.mobileNumber || '');
            data.append('age', formData.age || '');
            data.append('familyMembers', JSON.stringify(formData.familyMembers || []));
            data.append('travelMode', formData.travelMode || '');
            data.append('travelOther', formData.travelOther || '');
            data.append('arrivalDate', formData.arrivalDate || '');
            data.append('arrivalLocation', formData.arrivalLocation || '');
            data.append('arrivalLocationOther', formData.arrivalLocationOther || '');
            data.append('arrivalTime', formData.arrivalTime || '');
            data.append('arrivalTimeNotConfirmed', formData.arrivalTimeNotConfirmed || '');
            data.append('departureDate', formData.departureDate || '');
            data.append('departureOther', formData.departureOther || '');
            data.append('departureLocation', formData.departureLocation || '');
            data.append('departureLocationOther', formData.departureLocationOther || '');
            data.append('transportNumber', formData.transportNumber || '');
            data.append('noteToCouple', formData.noteToCouple || '');
            data.append('timestamp', formData.timestamp || new Date().toISOString());

            // Add file if present
            const fileInput = document.getElementById('identityProof');
            if (fileInput && fileInput.files.length > 0) {
                data.append('identityProof', fileInput.files[0]);
            }
    
            // Send to Google Apps Script (no headers!)
            const response = await fetch(
                'https://script.google.com/macros/s/AKfycbw9_LTVKfymXEMdh9srUdW1StxerRpDpi7q7lQDBuxUjKnUs3JJM-sarMLYgnNQiyzP/exec',
                {
                    method: 'POST',
                    body: data
                }
            );
    
            const resultText = await response.text();
            console.log('Script response:', resultText);
    
            let result;
            try {
                result = JSON.parse(resultText);
            } catch (err) {
                result = { success: false, error: 'Invalid JSON response' };
            }
    
            if (response.ok && result.success) {
                if (this.isAttending === false) {
                    this.showNoResponseThankYou();
                } else {
                    this.showSuccessScreen();
                }
            } else {
                alert('Error submitting RSVP: ' + (result.error || 'Unknown error'));
            }

        } catch (error) {
            console.error('RSVP submission error:', error);
            alert('Error submitting RSVP. Please try again.');
        }
    }

    showSuccessScreen() {
        console.log('showSuccessScreen called');
        
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show success screen
        document.getElementById('finalSuccess').classList.add('active');
        
        // Update name in success message
        document.getElementById('successName').textContent = this.formData.fullName;
        
        // Hide main navigation
        const mainNavigation = document.getElementById('mainNavigation');
        console.log('Main navigation element found:', mainNavigation);
        if (mainNavigation) {
            mainNavigation.style.display = 'none';
            console.log('Main navigation hidden');
        } else {
            console.log('Main navigation element not found');
        }
        
        // Update admin panel
        this.updateAdminPanel();
    }

    setupAdminPanel() {
        // Show admin toggle (hidden by default - can be enabled for testing)
        // document.getElementById('adminToggle').style.display = 'block';
        
        const adminBtn = document.getElementById('adminBtn');
        const adminPanel = document.getElementById('adminPanel');
        const downloadCsv = document.getElementById('downloadCsv');
        const clearData = document.getElementById('clearData');
        
        adminBtn.addEventListener('click', () => {
            adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
            this.updateAdminPanel();
        });
        
        downloadCsv.addEventListener('click', () => this.downloadCSV());
        clearData.addEventListener('click', () => this.clearAllData());
        
        // Initial update
        this.updateAdminPanel();
    }

    updateAdminPanel() {
        const rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
        const total = rsvps.length;
        const yes = rsvps.filter(r => r.attending === 'yes').length;
        const no = rsvps.filter(r => r.attending === 'no').length;
        
        document.getElementById('totalResponses').textContent = total;
        document.getElementById('yesResponses').textContent = yes;
        document.getElementById('noResponses').textContent = no;
    }

    downloadCSV() {
        const rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
        
        if (rsvps.length === 0) {
            alert('No RSVP data to download.');
            return;
        }
        
        // Create CSV content
        const headers = [
            'Full Name', 'Attending', 'Mobile Number', 'Age', 'Family Members',
            'Travel Mode', 'Arrival Date', 'Arrival Location', 'Arrival Time',
            'Departure Date', 'Transport Number', 'Departure Location', 'Timestamp'
        ];
        
        const csvContent = [
            headers.join(','),
            ...rsvps.map(rsvp => [
                `"${rsvp.fullName || ''}"`,
                rsvp.attending || '',
                rsvp.mobileNumber || '',
                rsvp.age || '',
                `"${(rsvp.familyMembers || []).map(f => `${f.name} (${f.age})`).join('; ')}"`,
                rsvp.travelMode || '',
                rsvp.arrivalDate || '',
                rsvp.arrivalLocation || '',
                rsvp.arrivalTime || '',
                rsvp.departureDate || '',
                `"${rsvp.transportNumber || ''}"`,
                rsvp.departureLocation || '',
                rsvp.timestamp || ''
            ].join(','))
        ].join('\n');
        
        // Download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all RSVP data? This action cannot be undone.')) {
            localStorage.removeItem('weddingRSVPs');
            this.updateAdminPanel();
            alert('All RSVP data has been cleared.');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProgressiveRSVP();
});
