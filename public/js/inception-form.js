document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded');
    let currentQuestion = 1;
    const buttons = {
        prevBtn: document.getElementById('prev_btn'),
        nextBtn: document.getElementById('next_btn'),
        submitBtn: document.getElementById('submit_btn'),
        coverOptionInfoBtn: document.getElementById('cover_options_btn'),
        coverOptionModalCloseBtn: document.getElementById('cover-options-modal-close-btn')
    }

    buttons.prevBtn.addEventListener('click', () => { 
        updateQuestion(-1); 
    });
    buttons.nextBtn.addEventListener('click', () => { 
        // hasAnsweredAllQuestions(currentQuestion) && updateQuestion(1); //UNCOMMENT FOR LIVE
        updateQuestion(1); //ADDED FOR TESTING, REMOVE FOR LIVE
    });

    buttons.submitBtn.addEventListener('click', () => {
        hasAnsweredAllQuestions(currentQuestion) && submitForm();
    });

    buttons.coverOptionInfoBtn.addEventListener('click', () => {
        coverOptionModalHandler();
    });

    buttons.coverOptionModalCloseBtn.addEventListener('click', () => {
        coverOptionModalHandler();
    });

    document.getElementById('cover_option').addEventListener('change', () => {
        const coverOption = document.getElementById('cover_option').value;
        if (coverOption === 'Starter') {
            document.getElementById('device_make').value = 'NA';
            document.getElementById('device_model').value = 'NA';
            document.querySelectorAll('.device-info').forEach(element => {
                element.style.display = 'none';
            });
        } else {
            //  display: block for all device-info class elements
            document.querySelectorAll('.device-info').forEach(element => {
                element.style.display = 'block';
            });
            document.getElementById('device_make').value = '';
            document.getElementById('device_model').value = '';
        }});

    document.querySelectorAll('.single-select-checkbox input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', idPassportLabelHandler);
    });

    function updateQuestion(direction) {
        document.getElementById('page' + currentQuestion).style.display = 'none';
        currentQuestion += direction;
        document.getElementById('page' + currentQuestion).style.display = 'block';

        // Adjust button visibility based on the next page number
        buttons.prevBtn.style.display = currentQuestion === 1 ? 'none' : 'block';
        buttons.nextBtn.style.display = currentQuestion === 3 ? 'none' : 'block';
        buttons.submitBtn.style.display = currentQuestion === 3 ? 'block' : 'none';
    }

    function idPassportLabelHandler() {
        const label = document.getElementById('id_number_label');
        label.textContent = this.id === 'sa_citizen' ? 'What is your ID number?' : 'What is your Passport Number?';
        const idNumber = document.getElementById('id_number');
        idNumber.placeholder = this.id === 'sa_citizen' ? 'ID Number' : 'Passport Number';
    }

    function hasAnsweredAllQuestions(pageNumber) {
        switch(pageNumber) {
            case 1:
                // Check if all questions on page 1 have been answered
                const firstName = document.getElementById('first_name');
                const lastName = document.getElementById('last_name');
                const cellNumber = document.getElementById('cell_number');
                const saCitizen = document.getElementById('sa_citizen');
                const foreignCitizen = document.getElementById('foreign_citizen');
                const idNumber = document.getElementById('id_number');

                if (firstName.value === '') {
                    alert('Please enter your first name before continuing');
                    return false;
                }
                if (lastName.value === '') {
                    alert('Please enter your last name before continuing');
                    return false;
                }
                if (cellNumber.value === '') {
                    alert('Please enter your cell number before continuing');
                    return false;
                }
                if (saCitizen.checked === false && foreignCitizen.checked === false) {
                    alert('Please select your citizenship before continuing');
                    return false;
                }
                if (saCitizen.checked === true && idNumber.value === '') {
                    alert('Please enter your ID number before continuing');
                    return false;
                }
                return true; // Return true if all questions are answered
            case 2:
                // Check if all questions on page 2 have been answered
                const businessName = document.getElementById('business_name');
                const businessAddress = document.getElementById('business_address');
                const businessActivity = document.getElementById('business_activity');
    
                if (businessName.value === '') {
                    alert('Please enter your business name before continuing');
                    return false;
                }
                if (businessAddress.value === '') {
                    alert('Please enter your business address before continuing');
                    return false;
                }
                if (businessActivity.value === '') {
                    alert('Please enter your business activity before continuing');
                    return false;
                }
                return true; // Return true if all questions are answered
            case 3:
                // Check if all questions on page 3 have been answered
                const coverOption = document.getElementById('cover_option');
                const inceptionDate = document.getElementById('inception_date');
                const deviceMake = document.getElementById('device_make');
                const deviceModel = document.getElementById('device_model');

                if (coverOption.value === '') {
                    alert('Please select a cover option before continuing');
                    return false;
                }
                if (inceptionDate.value === '') {
                    alert('Please select an inception date before continuing');
                    return false;
                }
                if (deviceMake.value === '') {
                    alert('Please enter your device make before continuing');
                    return false;
                }
                if (deviceModel.value === '') {
                    alert('Please enter your device model before continuing');
                    return false;
                }
                return true; // Return true if all questions are answered
            default:
                return false; // Invalid page number
        }
    }

    function coverOptionModalHandler(){
        const modal = document.getElementById("cover-options-modal");
        const questionsContainer = document.getElementById("all-quesiton-container");
        modal.style.display = modal.style.display === "block" ? "none" : "block";
        questionsContainer.style.display = modal.style.display === "block" ? "none" : "block";
    }

    async function submitForm() {
        console.log('Submitting form')
        // Get all form data
        const form = document.getElementById('inception-form');
        const formData = new FormData(form);
        const data = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            cell_number: formData.get('cell_number'),
            citizenship: formData.get('citizenship'),
            id_number: formData.get('id_number'),
            business_name: formData.get('business_name'),
            business_address: formData.get('business_address'),
            business_activity: formData.get('business_activity'),
            cover_option: formData.get('cover_option'),
            inception_date: formData.get('inception_date'),
            device_make: formData.get('device_make'),
            device_model: formData.get('device_model')
        };
    
        const url = '/api/inceptionForm';
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok) {
                // Redirect to whatsapp?
            }
        }
        catch (error) {
            console.log(error);
        } 
    };
});