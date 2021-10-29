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

    // https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript

    let millisecondDifference = date2-date1;
    let dayDifference = millisecondDifference / (1000*60*60*24);
    return Math.round(dayDifference);
}

/**
 * get the current Australian financial quarter for a date
 * @param {str} dateString 
 * @returns int [1-4]
 */
function getCurrentAuQuarter(dateString){
    let date = new Date(dateString);
    let UsQuarter = Math.floor((date.getMonth() + 3) / 3);
    let AuQuarter = UsQuarter > 2? UsQuarter - 2: UsQuarter + 2

    return AuQuarter
}

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every day
 * @returns list of date TIMESTAMPS!!!!!!
 */
function getDailyEnum(startDateString, endDateString){

    let date1 = new Date(startDateString);
    let date2 = new Date(endDateString);

    console.log(date1.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
    console.log(date2.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

    let dayCount = getDateRange(startDateString, endDateString);

    var dailySched = later.parse.recur().every(1).dayOfWeek();
    // run for an extra day since Later.js has a bug / creates 2 days with different times at the start
    var dailyEnum = later.schedule(dailySched).next(dayCount+1);

    // pop first entry off as it is repeated due to bug in Later.js
    let trimmedEnum = dailyEnum.slice(1);

    return trimmedEnum;
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every week
 * @returns list of date objects
 */
function getWeeklyEnum(startDateString, endDateString){

    let date1 = new Date(startDateString);
    let date2 = new Date(endDateString);

    console.log(date1.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
    console.log(date2.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

    let dayCount = getDateRange(startDateString, endDateString);
    let weekCount = Math.ceil(dayCount/7);

    let weeklyEnum = [];
    let secondsInWeek = 7*24*60*60*1000

    for(let i = 0; i < weekCount; i++){
        // create a new week by adding a weeks worth of seconds to the date
        let newDate = new Date(startDateString + i*secondsInWeek);
        weeklyEnum.push(newDate);
    }

    return weeklyEnum
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every fortnight
 * @returns list of date objects
 */
function getFortnightlyEnum(startDateString, endDateString){

    let date1 = new Date(startDateString);
    let date2 = new Date(endDateString);

    console.log(date1.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
    console.log(date2.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

    let dayCount = getDateRange(startDateString, endDateString);
    let weekCount = Math.ceil(dayCount/7);

    let fortnightlyEnum = [];
    let secondsInFortnight = 2*7*24*60*60*1000

    for(let i = 0; i < weekCount; i++){
        // create a new week by adding a weeks worth of seconds to the date
        let newDate = new Date(startDateString + i*secondsInFortnight);
        fortnightlyEnum.push(newDate);
    }

    return fortnightlyEnum
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every fortnight
 * @returns list of date objects
 */
function getMonthlyEnum(startDateString, endDateString){

    let date1 = new Date(startDateString);
    let date2 = new Date(endDateString);

    console.log(date1.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
    console.log(date2.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

    var d = new Date(startDateString);
    var day = d.getDate();

    let dayCount = getDateRange(startDateString, endDateString);
    let monthCount = Math.floor(dayCount/30);

    var monthSched = later.parse.recur().on(day).dayOfMonth().every(1).month();
    var monthEnum = later.schedule(monthSched).next(monthCount);

    return monthEnum
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every quarter - fixed dates for financial
 * @returns list of date objects quarters
 */
function getQuarterEnum(startDateString, endDateString){
    // guidance from https://stackoverflow.com/questions/11981453/get-current-quarter-in-year-with-javascript

    let date1 = new Date(startDateString);
    let date2 = new Date(endDateString);

    console.log(date1.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
    console.log(date2.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

    var d = new Date(startDateString);
    var year = d.getFullYear();

    // these are in AU quarter sequence i.e Q1,2,3,4
    quarterLines = [
        "1/July",
        "1/October",
        "1/January",
        "1/April"
    ]

    let dayCount = getDateRange(startDateString, endDateString);
    let quarterCount = Math.floor(dayCount/30)/3;

    let currentQuarter = getCurrentAuQuarter(startDateString);
    // note the cancellation of the quarterLines index0 and the incremented next quarter date
    let nextQuarterDate = new Date(quarterLines[currentQuarter] + `/${year}`);
    let nextQuarterDay = nextQuarterDate.getDate();

    var quarterSched = later.parse.recur().on(nextQuarterDay).dayOfMonth().every(3).month();
    var quarterEnum = later.schedule(quarterSched).next(quarterCount);

    return quarterEnum
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every year
 * @returns list of date objects
 */
function getYearEnum(startDateString, endDateString){

    let date1 = new Date(startDateString);
    let date2 = new Date(endDateString);

    console.log(date1.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
    console.log(date2.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

    let dayCount = getDateRange(startDateString, endDateString);
    let yearCount = Math.ceil(dayCount/365);

    let yearlyEnum = [];
    let secondsInYear = 365*24*60*60*1000

    for(let i = 0; i <= yearCount; i++){
        // create a new week by adding a weeks worth of seconds to the date
        let newDate = new Date(startDateString + i*secondsInYear);
        yearlyEnum.push(newDate);
    }

    return yearlyEnum

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