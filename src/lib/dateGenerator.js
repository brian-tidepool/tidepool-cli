export function generateDateArray2D(startDate, endDate, incrementMinutes) {
    const result = [];
    // Create a copy of start date to avoid mutating the original
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayRow = [];
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999); // End of current day
        // Generate dates for current day
        const dayIterator = new Date(dayStart);
        while (dayIterator <= dayEnd && dayIterator <= endDate) {
            dayRow.push(new Date(dayIterator));
            dayIterator.setMinutes(dayIterator.getMinutes() + incrementMinutes);
        }
        // Only add the row if it has dates
        if (dayRow.length > 0) {
            result.push(dayRow);
        }
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0); // Reset to start of day
    }
    return result;
}
// Example usage:
const start = new Date('2024-01-01T00:00:00');
const end = new Date('2024-01-03T12:00:00');
const increment = 60; // 1 hour intervals
const dateArray = generateDateArray2D(start, end, increment);
console.log(dateArray);
const dateArrayString = dateArray.map(row => {
    return row.map((value, index) => value.toISOString());
});
console.log(dateArrayString);
// Print results for demonstration
dateArray.forEach((day, dayIndex) => {
    console.log(`Day ${dayIndex + 1}:`);
    day.forEach(date => {
        console.log(`  ${date.toISOString()}`);
    });
    console.log();
});
