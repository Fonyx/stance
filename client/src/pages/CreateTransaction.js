import React, { useState, useEffect } from 'react';
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
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('once');
    const [date, setDate] = useState(new Date());
    const [endRecurrence, setEndRecurrence] = useState(null);

    // create query to get user accounts
    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});
    const userAccounts = data?.userAccounts || [];
    
    // console.log('user accounts: ', userAccounts);
    
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

    console.log('State To Account: ', toAccount);
    console.log('State From Account: ', fromAccount);
    console.log('State Amount: ', amount);
    console.log('State description: ', description);
    console.log('State frequency: ', frequency);
    console.log('State Date: ', date);
    console.log('State End Recurrence: ', endRecurrence);

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try { 
            console.log('Sending form not implemented yet')
        } catch (e) {
        console.error(e);
        }
    };

    if(loading){
        return ( 
            <div>Loading Accounts...</div>
        )
    }

    return (
        <div>
            <h1>NEW TRANSACTION</h1>
            <form onSubmit={handleFormSubmit}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
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
                    <TextField name='amount' onChange={handleInputChange} label="Amount" placeholder="0.00"/>
                    <TextField name='description' onChange={handleInputChange} label="Description" placeholder="A quick note"/>

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
                        label='Starting On'
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
                </LocalizationProvider>
            </form>

        </div>
    )
}