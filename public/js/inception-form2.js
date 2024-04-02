document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded');
    const bisActsByTypeInput = document.getElementById('bisActsByType').value;
    const coverOptsByTypesInput = document.getElementById('coverOptsByTypes').value;
    const bisActsByType = JSON.parse(bisActsByTypeInput);
    const coverOptsByTypes = JSON.parse(coverOptsByTypesInput);

    const coverOptionContainer = document.querySelector('.cover-options');

    let coverOptionSelected = '';
    let currentQuestion = 1;

    const buttons = {
        prevBtn: document.getElementById('prev_btn'),
        nextBtn: document.getElementById('next_btn'),
        submitBtn: document.getElementById('submit_btn'),
    };

    buttons.prevBtn.addEventListener('click', () => {
        currentQuestion = updateQuestionPage(buttons, currentQuestion, -1);
    });
    buttons.nextBtn.addEventListener('click', () => {
        // hasAnsweredAllQuestions(currentQuestion) && updateQuestion(1); //UNCOMMENT FOR LIVE
        if (currentQuestion === 1) { updateCoverOptions(coverOptionSelected) }
        currentQuestion = updateQuestionPage(buttons, currentQuestion, 1); //ADDED FOR TESTING, REMOVE FOR LIVE
    });

    // buttons.submitBtn.addEventListener('click', () => {
    //     hasAnsweredAllQuestions(currentQuestion) && submitForm();
    // });

    const bisActDropdown = document.getElementById('bisAct');

    bisActDropdown.addEventListener('change', function () {
        coverOptionSelected = coverOptsByTypes[bisActsByType[this.value]];
    });

    document.querySelectorAll('.single-select-checkbox input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', idPassportLabelHandler);
    });
});

function updateQuestionPage(btn, currentQuestion, direction) {
    document.getElementById('page' + currentQuestion).style.display = 'none';
    currentQuestion += direction;
    document.getElementById('page' + currentQuestion).style.display = 'block';

    // Adjust button visibility based on the next page number
    btn.prevBtn.style.display = currentQuestion === 1 ? 'none' : 'block';
    btn.nextBtn.style.display = currentQuestion === 3 ? 'none' : 'block';
    btn.submitBtn.style.display = currentQuestion === 3 ? 'block' : 'none';

    return currentQuestion;
}

function updateCoverOptions(coverOpts) {
    const container = document.querySelector('.cover-options');
    const detailsContainer = document.querySelector('.cover-details'); // Assume there's a container for details
    container.innerHTML = '';
    detailsContainer.innerHTML = ''; // Clear previous details

    // Keep track of the original order of radio buttons
    const elements = [];

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
                        detailsContainer.innerHTML = ''; // Clear details when deselected
                    } else {
                        elements.forEach(el => {
                            if (el !== element) el.style.display = 'none';
                        });
                        container.prepend(element);
                        element.dataset.selected = 'true';
                        displayCoverDetails(opt.option, detailsContainer); // Display details of the selected cover
                    }
                } else {
                    restoreOriginalOrder(elements, container);
                }
            });
        });
    } else {
        container.textContent = 'No cover options available for the selected business activity.';
    }
}

function restoreOriginalOrder(elements, container) {
    container.innerHTML = '';
    elements.forEach(el => {
        container.appendChild(el);
        el.style.display = '';
        el.dataset.selected = 'false';
    });
}

function displayCoverDetails(option, container) {
    const table = document.createElement('table');
    table.classList.add('cover-details-table');

    Object.entries(option).forEach(([key, value]) => {
        if (key === 'coverName' || key === 'totalPremium' || key === 'Cover Note') return;
        if (!value) return;
        const row = table.insertRow();
        const keyCell = row.insertCell();
        keyCell.textContent = key;
        const valueCell = row.insertCell();
        valueCell.textContent = value;
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

function idPassportLabelHandler() {
    const label = document.getElementById('id_number_label');
    label.textContent = this.id === 'sa_citizen' ? 'What is your ID number?' : 'What is your Passport Number?';
    const idNumber = document.getElementById('id_number');
    idNumber.placeholder = this.id === 'sa_citizen' ? 'ID Number' : 'Passport Number';
}