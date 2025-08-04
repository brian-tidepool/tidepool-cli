export function generateDateArray2D(startDate, endDate, incrementMinutes) {
    const result = [];
    // Create a copy of start date to avoid mutating the original
    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
        const dayRow = [];
        //currentDate.setMinutes(currentDate.getMinutes()-5);
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate);
        dayEnd.setDate(dayStart.getDate() + 1); // End of current day
        //console.log('dayStart',dayStart,dayEnd,endDate)
        // Generate dates for current day
        const dayIterator = new Date(dayStart);
        //console.log('di',dayIterator);
        while (dayIterator < endDate && dayIterator < dayEnd) {
            dayRow.push(new Date(dayIterator));
            dayIterator.setMinutes(dayIterator.getMinutes() + incrementMinutes);
            if (dayIterator >= endDate) {
                console.log('dibetween', dayIterator);
            }
        }
        //console.log('diafter',dayIterator.getDate());
        // Only add the row if it has dates
        if (dayRow.length > 0) {
            result.push(dayRow);
        }
        // Move to next day
        currentDate = new Date(dayIterator);
        //console.log('length',dayRow.length)
        //currentDate.setHours(0, 0, 0, 0); // Reset to start of day
    }
    return result;
}
