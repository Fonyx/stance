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

module.exports = {
    areDatesSame
}