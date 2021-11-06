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