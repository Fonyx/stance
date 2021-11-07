// https://stackoverflow.com/questions/24386667/set-new-date-with-a-string-containing-a-date-in-uk-format
/**
 * Parse en-GB formatted date string to a new date object
 * @param {str} value 
 * @returns {Date()} date
 */
export default function parseDMY(value) {
    var date = value.split("/");
    var d = parseInt(date[0], 10),
        m = parseInt(date[1], 10),
        y = parseInt(date[2], 10);
    return new Date(y, m - 1, d);
}

/**
 * Converts a unix timestamp to an en-GB date string 
 * @param {models.Transaction} transactionObj 
 * @returns {str} en-GB formatted date string
 */
export function timestampToDateString(transactionObj){
    let date = new Date(transactionObj.date*1);
    let dateString = date.toLocaleDateString('en-GB');
    return dateString
}

// convert timestamp 1233482983y45 to local string en-GB 05/11/2021
export function readableDate(dateStamp){
    return dateStamp.toLocaleDateString('en-GB');
}