const {parseDMY} = require('../utils/date')

/**
 * A dictionary object that acts like a python dictionary, with the asterix that the value is a list
 * has getter, setter and print methods
 */
 class Dictionary{
    /**
     * 
     * @param {list} keys list of strings
     * @param {list} values list of elements [str, int]
     */
    constructor(keys, values, debug=false){
        this.debug = debug;
        if(keys && values){
            this.keys = keys;
            this.values = values;
        } else {
            this.reset();
        }
    }

    reset(){
        this.keys = [];
        this.values = [];
    }

    print(){
        if(this.debug) console.log('DICT PRINT');
        for(let i =0; i < this.keys.length; i++){
            let curr_key = this.keys[i];
            let curr_val = this.values[i];
            console.log(curr_key,curr_val);
        }
    }

    /**
     * exports the contents of the dictionary to a list of objects with lists
     i.e [
         {
             date: 'dd/mm/yy', 
             balance: xxx, 
             details: [
                {
                    description: 'rent',
                    amount: -400
                }, {
                    description: 'phone',
                    amount: -100
                },
            ] 
        },
        ]
     * 
     */
    export(){
        let data = []
        for(let i = 0; i < this.keys.length; i++){
            let curr_key = this.keys[i];
            // we need 0th element because values is a list with one element
            let curr_val = this.getByValue(curr_key);
            let packet = {
                date: parseDMY(curr_key),
                balance: curr_val.balance,
                details: curr_val.details
            }
            data.push(packet);
        }
        return data;
    }

    length(){
        return this.keys.length;
    }

    get_as_list(){
        let result = [];
        for(let i =0; i < this.keys.length; i++){
            result[this.keys[i]] = this.values[i];
        }
        return result;
    }   

    lookupKeyIndex(stri){
        return this.keys.indexOf(stri);
    }

    getByIndex(index){
        let result = this.values[index];
        return result;
    }

    getByValue(key){
        let result = null;
        
        let keyIndex = this.keys.indexOf(key);
        // if there is a key for this value, lookup and update result
        if(keyIndex !== -1){
            result = this.values[keyIndex];
        }
        
        return result;

    }
    /**Receives a key and value pair, only adds new pairs to dict
     * 
     * @param {str} key 
     * @param {str/int} value 
     */
    set(key, value){
        // check if key is already in dict
        let keyIndex = this.keys.indexOf(key);
        // if the value has no key, insert it into the keys and values lists
        if(keyIndex === -1){
            if(this.debug) console.log(`DICT INSERTING:`,key,value)
            this.keys.push(key);
            this.values.push(value);
            // if that key already exists, just update the value
        } else {
            if(this.debug) console.log(`DICT UPDATING:`,key,value)
            this.values[keyIndex] = value;
        }
    }

}

module.exports ={
    Dictionary,
}