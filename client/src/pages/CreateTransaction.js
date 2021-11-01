import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_USER_ACCOUNTS } from '../utils/queries';
import {Autocomplete, TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

import {DatePicker} from '@mui/lab';
import enLocale from 'date-fns/locale/en-GB';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';


function filterChoiceFromOptions(choice, options){
    let remainingOptions = options.filter((option) => choice !== option.name);
    return remainingOptions
}

export default function CreateTransaction() {
    

    const [toAccount, setToAccount] = useState({});
    const [fromAccount, setFromAccount] = useState({});
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [frequency, setFrequency] = useState('once');
    const [date, setDate] = useState(new Date());
    const [endRecurrence, setEndRecurrence] = useState(null);

    const [errors, setErrors] = useState([]);

    // create query to get user accounts
    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});
    const userAccounts = data?.userAccounts || [];
    
    let currentAccountChoice = toAccount.name? toAccount.name : fromAccount.name
    var accountChoices = filterChoiceFromOptions(currentAccountChoice, userAccounts);

    
    // update state based on form select changes
    const handleSelectChange = (event) => {
        console.log('Select Event triggered: ', event);
        console.log('target: ', event.target);

        // to account id is of form id="toAccount-option-0"
        if(event.target.id.startsWith('toAccount')){
            let optionStrings = event.target.id.split('-');
            let accountIndex = parseInt(optionStrings[2]);
            let account = userAccounts[accountIndex];
            setToAccount({...account});
        }
        // to account id is of form id="toAccount-option-0"
        if(event.target.id.startsWith('fromAccount')){
            let optionStrings = event.target.id.split('-');
            let accountIndex = parseInt(optionStrings[2]);
            let account = userAccounts[accountIndex];
            setFromAccount({...account});
        }
        
    };

    // update state based on form inputs
    const handleInputChange = ({target}) => {
        console.log('Input Event triggered: ');
        console.log('target: ', target);

        // to account id is of form id="toAccount-option-0"
        if(target.name === 'description'){
            let value = target.value;
            setDescription(value);
        }
        // to account id is of form id="toAccount-option-0"
        if(target.name === 'amount'){
            let value = target.value;
            setAmount(value);
        }

        // case for handling frequency field
        if(target.name === 'frequency'){
            setFrequency(target.value);
        }
    }

    // console.log('State To Account: ', toAccount);
    // console.log('State From Account: ', fromAccount);
    // console.log('State Amount: ', amount);
    // console.log('State description: ', description);
    // console.log('State frequency: ', frequency);
    // console.log('State Date: ', date);
    // console.log('State End Recurrence: ', endRecurrence);

    const transferMaximum = () => {
        let fundsAvailable = fromAccount.balance;
        setAmount(fundsAvailable)
    }

    // checks that the form is submittable, if it fails, sets error state and returns false, else true
    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        //check accounts
        if(!toAccount?.balance && !fromAccount?.balance){
            errorBuffer.push('You need to choose at least one account');
            valid  = false;
        }

        // check amount is not null
        if(!amount){
            errorBuffer.push('You need to specify a non-zero amount');
            valid = false;
        }

        // check amount isn't larger than the balance in the from account if there is a from account
        if(fromAccount?.balance){
            if(amount > fromAccount.balance){
                errorBuffer.push("You can't transfer more than the balance of the from account for the transaction")
            }
        }

        // check there is a description
        if(!description){
            errorBuffer.push('You need to describe the transaction, your future self with thank you');
            valid = false
        }

        // check that there is a date
        if(!date){
            errorBuffer.push('You need to set a date for this transaction to happen');
            valid = false
        }
        // check that if frequency isn't once, there is a selected endRecurrence
        if(frequency !== 'once' && !endRecurrence){
            errorBuffer.push('You need to specify when this transaction ends');
            valid = false
        }
        setErrors(errorBuffer)

        return valid
    }

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try { 
            if(validateFormSubmit()){
                console.log('sending form')
            }
        } catch (e) {
        console.error(e);
        }
    };

    if(loading){
        return ( 
            <div>Loading Your Details...</div>
        )
    }

    return (
        <div>
            <h1>NEW TRANSACTION</h1>
            <form onSubmit={handleFormSubmit}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <Autocomplete
                        disablePortal
                        id="fromAccount"
                        name='fromAccount'
                        options={accountChoices}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        sx={{ width: 300 }}
                        onChange={handleSelectChange}
                        renderInput={(params) => <TextField {...params} label="From Account" />}
                        />
                    {fromAccount.balance? 
                        <div>
                            {fromAccount.balance}
                            <Button onClick={transferMaximum}>Transfer All</Button>
                        </div> 
                        : 
                        <></>
                    }
                    <Autocomplete
                        disablePortal
                        id="toAccount"
                        name='toAccount'
                        options={accountChoices}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        sx={{ width: 300 }}
                        onChange={handleSelectChange}
                        renderInput={(params) => <TextField {...params} label="To Account" />}
                    />
                    {toAccount.balance? 
                        <div>{toAccount.balance}</div> : <></>
                    }
                    <TextField name='amount' onChange={handleInputChange} label="Amount" value={amount} placeholder="0.00"/>
                    <TextField name='description' onChange={handleInputChange} label="Description" value={description} placeholder="A quick note"/>

                    <FormControl sx={{width: '25ch'}}>
                        <InputLabel id="every">Frequency</InputLabel>
                        <Select
                            labelId="every"
                            id="every"
                            value={frequency}
                            label="How Often"
                            name='frequency'
                            onChange={handleInputChange}
                        >
                            <MenuItem value={"once"}>once</MenuItem>
                            <MenuItem value={"daily"}>daily</MenuItem>
                            <MenuItem value={"weekly"}>weekly</MenuItem>
                            <MenuItem value={"fortnightly"}>fortnightly</MenuItem>
                            <MenuItem value={"monthly"}>monthly</MenuItem>
                            <MenuItem value={"quarterly"}>quarterly</MenuItem>
                            <MenuItem value={"yearly"}>yearly</MenuItem>
                        </Select>
                    </FormControl>

                    <DatePicker
                        label='On Date'
                        value={date}
                        minDate={new Date()}
                        onChange={(newValue) => {
                            // console.log('Updating date state to: ', newValue);
                            setDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        />
                        {frequency !== 'once'? 
                            <DatePicker
                                label='Until'
                                value={endRecurrence}
                                minDate={new Date()}
                                onChange={(newValue) => {
                                    // console.log('Updating end Recurrence state to: ', newValue);
                                    setEndRecurrence(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                        />: <></>}
                    <Button
                        style={{ cursor: 'pointer' }}
                        type="submit"
                        variant="outlined"
                    >
                        Submit
                    </Button>
                    <div id="error">
                        {errors.map((error) => {
                            return <div>{error}</div>
                        })}
                    </div> 
                </LocalizationProvider>
            </form>
        </div>
    )
}