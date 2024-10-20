// DOM elements
const inputDay = document.getElementById('input-day');
const inputMonth = document.getElementById('input-month');
const inputYear = document.getElementById('input-year');

const submitButton = document.getElementById('submit-button');

const years = document.getElementById('years');
const months = document.getElementById('months');
const days = document.getElementById('days');

const errorMessageDay = document.getElementById('error-message-day');
const errorMessageMonth = document.getElementById('error-message-month');
const errorMessageYear = document.getElementById('error-message-year');

const errorLabelDay = document.getElementById('error-label-day');
const errorLabelMonth = document.getElementById('error-label-month');
const errorLabelYear = document.getElementById('error-label-year');

// Current date
const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

// Function for adding error
function addError(input, errorLabel, errorMessage, message) {
    input.classList.add('border-LightRed');
    errorLabel.classList.remove('text-SmokeyGrey');
    errorLabel.classList.add('text-LightRed');
    errorMessage.textContent = message;
}

// Function for removing error
function removeError(input, errorLabel, errorMessage) {
    input.classList.remove('border-LightRed');
    errorLabel.classList.remove('text-LightRed');
    errorLabel.classList.add('text-SmokeyGrey');
    errorMessage.textContent = '';
}

// Function for validating input
function validateInput(inputValue, inputField, errorLabel, errorMessage) {
    if (inputField.value === '') {
        addError(inputField, errorLabel, errorMessage, 'This field is required');
        return false;
    } else {
        removeError(inputField, errorLabel, errorMessage);
        return true;
    }
}

// Function for validating date
function isValidDate(day, month, year) {
    let isValid = true;

    const inputDate = new Date(year, month - 1, day);
    if (inputDate > currentDate) {
        addError(inputYear, errorLabelYear, errorMessageYear, 'Must be in the past');
        return false;
    }

    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isLeapYear = (year) => {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    };
    if (isLeapYear(year)) {
        daysInMonth[1] = 29;
    }

    if (month < 1 || month > 12) {
        addError(inputMonth, errorLabelMonth, errorMessageMonth, 'Must be a valid month');
        isValid = false;
    }
    if (day < 1 || day > daysInMonth[month - 1]) {
        addError(inputDay, errorLabelDay, errorMessageDay, 'Must be a valid day');
        isValid = false;
    }
    if (!isValid) return false;

    let calculatedYears = currentYear - year;
    let calculatedMonths = currentMonth - month;
    let calculatedDays = currentDay - day;

    if (calculatedDays < 0) {
        calculatedMonths -= 1;
        calculatedDays += daysInMonth[(currentMonth - 2 + 12) % 12];
    }

    if (calculatedMonths < 0) {
        calculatedYears -= 1;
        calculatedMonths += 12;
    }

    years.textContent = calculatedYears;
    months.textContent = calculatedMonths;
    days.textContent = calculatedDays;

    animateCountUp(years, 0, calculatedYears, 1000);
    animateCountUp(months, 0, calculatedMonths, 1000);
    animateCountUp(days, 0, calculatedDays, 1000);

    return true;
}

// Function for animate result
function animateCountUp(element, start, end, duration) {
    let current = start;
    const increment = (end - start) / (duration / 100);

    const interval = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = Math.floor(end);
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 100);
}

// Function for allowing only numbers
function allowNumbersOnly(event) {
    const input = event.target;
    const value = input.value;

    input.value = value.replace(/[^0-9]/g, '');
}
// Event listeners for restrict only numbers
inputDay.addEventListener('input', allowNumbersOnly);
inputMonth.addEventListener('input', allowNumbersOnly);
inputYear.addEventListener('input', allowNumbersOnly);

// Function for submiting
function submit(event) {
    event.preventDefault();

    const inputDayValue = parseInt(inputDay.value);
    const inputMonthValue = parseInt(inputMonth.value);
    const inputYearValue = parseInt(inputYear.value);

    const isDayValid = validateInput(inputDayValue, inputDay, errorLabelDay, errorMessageDay);
    const isMonthValid = validateInput(inputMonthValue, inputMonth, errorLabelMonth, errorMessageMonth);
    const isYearValid = validateInput(inputYearValue, inputYear, errorLabelYear, errorMessageYear);

    if (!isDayValid || !isMonthValid || !isYearValid) {
        return;
    }

    isValidDate(inputDayValue, inputMonthValue, inputYearValue);
}

// Submitting on button
submitButton.addEventListener('click', submit);

// Submitting on keyboard (Enter)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submit(event);
    }
});