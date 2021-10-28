function isOneAm(){
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if(hour === 16 && minute === 57){
        return true;
    } else {
        return false
    }
}


module.exports = {
    isOneAm,
}