document.addEventListener('DOMContentLoaded', () => {
    const bisActsByTypeInput = document.getElementById('bisActsByType').value;
    const coverOptsByTypesInput = document.getElementById('coverOptsByTypes').value;
    const bisActsByType = JSON.parse(bisActsByTypeInput);
    const coverOptsByTypes = JSON.parse(coverOptsByTypesInput);

    let coverOptionSelection = '';
    let barLmt = '';
    let currentPage = 1;

    const buttons = {
        prevBtn: document.getElementById('prev_btn'),
        nextBtn: document.getElementById('next_btn'),
        submitBtn: document.getElementById('submit_btn'),
    };

    const pagesQuestions = {

    };

    const bisActDropdown = document.getElementById('bisAct');
    bisActDropdown.addEventListener('change', function() {
        const otherBisAct = document.getElementById('business-activity-other-div');
        if (this.value === 'Other') {
            otherBisAct.classList.remove('hidden');
        } else {
            coverOptionSelection = coverOptsByTypes[bisActsByType[this.value]];
            otherBisAct.classList.add('hidden');
        }
    });

    buttons.prevBtn.addEventListener('click', () => {
        currentPage = updateQuestionPage(buttons, currentPage, -1);
    });
    buttons.nextBtn.addEventListener('click', () => {
        // hasAnsweredAllQuestions(currentPage) && updateQuestion(1); //UNCOMMENT FOR LIVE
        if (currentPage === 1) {
            console.log('PAGE 1')
            updateCoverOptions(coverOptionSelection, (selectedBarLmt) => {
                barLmt = selectedBarLmt;
            });
        }
        if (currentPage === 3) { updateDeviceInfoBaseOnCover(barLmt); }
        currentPage = updateQuestionPage(buttons, currentPage, 1); //ADDED FOR TESTING, REMOVE FOR LIVE
    });
    // buttons.submitBtn.addEventListener('click', () => {
    //     hasAnsweredAllQuestions(currentPage) && submitForm();
    // });

    

    document.querySelectorAll('.single-select-checkbox input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', idPassportLabelHandler);
    });
});

// NEXT, PREV, SUBMIT BUTTON HANDLER - TO CHANGE PAGES
function updateQuestionPage(btn, currentPage, direction) {
    document.getElementById('page' + currentPage).style.display = 'none';
    currentPage += direction;
    document.getElementById('page' + currentPage).style.display = 'block';

    // Adjust button visibility based on the next page number
    btn.prevBtn.style.display = currentPage === 1 ? 'none' : 'block';
    btn.nextBtn.style.display = currentPage === 4 ? 'none' : 'block';
    btn.submitBtn.style.display = currentPage === 4 ? 'block' : 'none';

    return currentPage;
}

// BUILDS THE COVER OPTIONS
// MAIN FUNCTION THAT RUNS
function updateCoverOptions(coverOpts, onSelection) {
    console.log('Updating cover options')
    let barLmt = '';
    const container = document.querySelector('.cover-options');
    const detailsContainer = document.querySelector('.cover-details'); // Assume there's a container for details
    container.innerHTML = '';
    detailsContainer.innerHTML = ''; // Clear previous details

    // Keep track of the original order of radio buttons
    const elements = [];
    console.log(coverOpts)
    if (coverOpts && coverOpts.length > 0) {
        coverOpts.forEach((opt) => {
            const coverName = opt.option.coverName;
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.id = coverName.replace(/\s+/g, '-');
            radioInput.name = 'coverOpt';
            radioInput.value = coverName;

            const label = document.createElement('label');
            label.setAttribute('for', radioInput.id);
            label.textContent = 'R' + opt.option.totalPremium + ' - ' + coverName;

            const element = document.createElement('div');
            element.classList.add('cover-option-div');
            element.appendChild(radioInput);
            element.appendChild(label);
            container.appendChild(element);
            elements.push(element);

            radioInput.addEventListener('click', function (e) {
                detailsContainer.innerHTML = ''; // Clear details for new selection
                if (radioInput.checked && container.contains(element)) {
                    if (element.dataset.selected === 'true') {
                        radioInput.checked = false;
                        element.dataset.selected = 'false';
                        restoreOriginalOrder(elements, container);
                        detailsContainer.innerHTML = '';
                        barLmt = '';
                        element.querySelector('label').classList.remove('selected');
                    } else {
                        elements.forEach(el => {
                            if (el !== element) el.style.display = 'none';
                        });
                        container.prepend(element);
                        element.dataset.selected = 'true';
                        displayCoverDetails(opt.option, detailsContainer);
                        for (let i = 0; i < coverOpts.length; i++) {
                            if (coverOpts[i].option.coverName === coverName) {
                                barLmt = coverOpts[i].option.barLmt;
                            }
                        };
                        element.querySelector('label').classList.add('selected');
                    }
                    onSelection(barLmt);
                } else {
                    elements.forEach(el => {
                        el.querySelector('label').classList.remove('selected');
                    });
                    restoreOriginalOrder(elements, container);
                }
            });
        });
    } else {
        container.textContent = 'Please select a business activity on the previous page to see cover options.';
    }
}
// RESTORES THE ORIGINAL ORDER OF THE COVER OPTIONS ON DESELECT
function restoreOriginalOrder(elements, container) {
    container.innerHTML = '';
    elements.forEach(el => {
        container.appendChild(el);
        el.style.display = '';
        el.dataset.selected = 'false';
    });
}
// BUILDS THE DETAILS OF THE SELECTED COVER OPTION
function displayCoverDetails(option, container) {
    const table = document.createElement('table');
    table.classList.add('cover-details-table');

    Object.entries(option).forEach(([key, value]) => {
        if (key === 'coverName' || key === 'totalPremium' || key === 'Cover Note') return;
        if (!value) return;
        const row = table.insertRow();
        const keyCell = row.insertCell();
        keyCell.textContent = key;
        keyCell.classList.add('cover-details-key');
        const valueCell = row.insertCell();
        valueCell.textContent = processAmountsToString(value);
    });

    container.appendChild(table);
    // ADD cover note to the details
    if (option['Cover Note']) {
        const hr = document.createElement('hr');
        container.appendChild(hr);
        hr.classList.add('cover-note-divider');
        const note_header = document.createElement('h3');
        note_header.textContent = 'Cover Note';
        container.appendChild(note_header);
        const note = document.createElement('p');
        note.textContent = option['Cover Note'];
        container.appendChild(note);
    }
}

// HANDLES CITIZENSHIP - SA = ID, FOREIGN = PASSPORT
function idPassportLabelHandler() {
    const label = document.getElementById('id_number_label');
    label.textContent = this.id === 'sa_citizen' ? 'What is your ID number?' : 'What is your Passport Number?';
    const idNumber = document.getElementById('id_number');
    idNumber.placeholder = this.id === 'sa_citizen' ? 'ID Number' : 'Passport Number';
}

// SHOWS OR HIDES COVER DETAILS BASE ON COVER OPTIONS
function updateDeviceInfoBaseOnCover(barLmtVar) {
    // SELECT device-info Class
    const deviceInfo = document.querySelectorAll('.device-info');
    if (barLmtVar === '' || barLmtVar === '0' || barLmtVar === 0) {
        for (let i = 0; i < deviceInfo.length; i++) {
            deviceInfo[i].style.display = 'none';
        }
    } else {
        for (let i = 0; i < deviceInfo.length; i++) {
            deviceInfo[i].style.display = 'flex';
        }
    }
}

// HELPER FUNCTIONS
// CONVERTS AMOUNTS TO RAND STRING
function processAmountsToString(amount) {
    let result = amount.toString();
    result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return 'R ' + result;
}