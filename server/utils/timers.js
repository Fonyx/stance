function isOneAm(){
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if(hour === 1 && minute === 0){
        return true;
    } else {
        return false
    }
}


module.exports = {
    isOneAm,
}