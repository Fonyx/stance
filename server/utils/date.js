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
 * get the dates from transaction start date to end recurrence date as a list of dates every day
 * @returns list of date TIMESTAMPS!!!!!!
 */
function getDailyEnum(startDateString, endDateString){

    let dayCount = getDateRange(startDateString, endDateString);

    // for(let i =0; i<dayCount; i++){
    //     // create a new date for each element in the day count
    //     let date = new Date(Date.now() + i*24*60*60);
    //     dateEnum.push(date);
    // }

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

    var d = new Date(startDateString);
    var day = d.getDate();

    let dayCount = getDateRange(startDateString, endDateString);
    let weekCount = Math.floor(dayCount/7);
    // TODO: This is a mess, trying to get weekCount number of specific days of week
    var fortnightlySched = later.parse.recur().on(day).dayOfWeek().every(2).weekOfYear();
    var fortnightlyEnum = later.schedule(fortnightlySched).next(weekCount/2);

    return fortnightlyEnum
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every fortnight
 * @returns list of date objects
 */
function getMonthlyEnum(startDateString, endDateString){

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
    // TODO: this needs a more sophisticated look over for how to manage the quarter
    var d = new Date(startDateString);
    var day = d.getDate();
    var year = d.getFullYear();

    // these are in annual sequence so the loop below makes sense
    quarterLines = [
        "1/July",
        "1/October",
        "1/January",
        "1/April"
    ]

    let dayCount = getDateRange(startDateString, endDateString);
    let quarterCount = Math.floor(dayCount/30)/3;

    for(let i = 0; i < quarterCount; i++){

        // every 4 quarters, increment the year
        if(i % 4 == 1){
            year +=1
        }
        
        let quarter = quarterLines[i] + `/${year}`;

        console.log(`This should be a D/MM/YYYY string and every 4 quarters it should increment`)

        let newQuarterMark = new Date()
    }

    var quarterSched = later.parse.recur().on(day).dayOfMonth().every(3).month();
    var quarterEnum = later.schedule(quarterSched).next();

    return quarterEnum
};

/**
 * get the dates from transaction start date to end recurrence date as a list of dates every year
 * @returns list of date objects
 */
function getYearEnum(startDateString, endDateString){
    var d = new Date(startDateString);
    var day = d.getDate();

    let dayCount = getDateRange(startDateString, endDateString);
    let yearCount = Math.round(dayCount/365.25);

    var yearlySched = later.parse.recur().on(day).dayOfMonth().every(12).month();
    var yearlyEnum = later.schedule(yearlySched).next(yearCount);

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