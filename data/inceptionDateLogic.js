// controller.js
class DateOptionsController {
    /**
     * Format a date as a string
     * @param {Date} date
     * @returns {string}
     */
    formatDateToString(dateParam) {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let date = dateParam.getDate();
        let month = monthNames[dateParam.getMonth()];
        let year = dateParam.getFullYear();
        return `${date}-${month}-${year}`;
    }

    /**
     * This method will return today, tomorrow, and the first of next month as date options
     * @returns {object} result
     */
    getInceptionDateOptions() {
        let result = {};
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        result.currentDate = this.formatDateToString(today); // Using formatString as a method
        result.tomorrowDate = this.formatDateToString(tomorrow); // Using formatString as a method
        if (today.getMonth() == 11) {
            var firstNextMonth = new Date(today.getFullYear() + 1, 0, 1);
        } else {
            var firstNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        }
        result.firstNextMonth = this.formatDateToString(firstNextMonth); // Using formatString as a method
        return result;
    }
}

class BusinessTypeController {
    // ADD CONTROLLER LOGIC HERE
}

module.exports = DateOptionsController;
