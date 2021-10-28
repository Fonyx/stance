const later = require('later');

// general use is that date2 is the current datetime
function areDatesSame(date1, date2){
    let same = true;

    if(date1.getFullYear() !== date2.getFullYear()){
        same = false;
    }
    if(date1.getMonth() !== date2.getMonth()){
        same = false;
    }
    if(date1.getDay() !== date2.getDay()){
        same = false;
    }
    return same
}

/**
 * returns the number of days between dates, date2-date1
 * @param {date1} instance of Date 
 * @param {date2} instance of Date 
 * @returns int
 */
 function getDateRange(date1, date2){
    // subtract the two dates and divide by number of seconds in a day, since the subtraction reverts to the milliseconds since 1970 for each date
    let millisecondDifference = date2-date1;
    let dayDifference = millisecondDifference / (1000*60*60*24);
    return Math.round(dayDifference);
}

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every day
 * @returns list of date objects
 */
function getDailyEnum(startDateString, endDateString){
    let dateEnum  = [];

    let dayCount = getDateRange(startDateString, endDateString);

    for(let i =0; i<dayCount; i++){
        // create a new date for each element in the day count
        let date = Date.now() + i*24*60*60;
        dateEnum.push(date);
    }

    return dateEnum;
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every week
 * @returns list of date objects
 */
function getWeeklyEnum(startDateString, endDateString){
    var weeklySched = later.parse.recur().on(day).dayOfWeek();
    var weeklyEnum = later.schedule(weeklySched).next(10);
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every fortnight
 * @returns list of date objects
 */
function getFortnightlyEnum(startDateString, endDateString){
    var fortnightlySched = later.parse.recur().on(day).dayOfWeek().every(2).week();
    var fortnightlyEnum = later.schedule(fortnightlySched).next(10);
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every fortnight
 * @returns list of date objects
 */
function getMonthlyEnum(startDateString, endDateString){
    var monthSched = later.parse.recur().on(day).dayOfMonth().every(1).month();
    var monthEnum = later.schedule(monthSched).next(10);
};
/**
 * get the dates from transaction start date to end recurrence date as a list of dates every quarter - fixed dates for financial
 * @returns list of date objects quarters
 */
function getQuarterEnum(startDateString, endDateString){
    var quarterSched = later.parse.recur().on(day).dayOfMonth().every(3).month();
    var quarterEnum = later.schedule(quarterSched).next(10);
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every year
 * @returns list of date objects
 */
function getYearEnum(startDateString, endDateString){
    var yearlySched = later.parse.recur().on(day).dayOfMonth().every(12).month();
    var yearlyEnum = later.schedule(yearlySched).next(10);
};

module.exports = {
    areDatesSame,
    getDailyEnum,
    getWeeklyEnum,
    getFortnightlyEnum,
    getMonthlyEnum,
    getQuarterEnum,
    getYearEnum
}