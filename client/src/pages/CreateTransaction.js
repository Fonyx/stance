import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_ACCOUNTS } from '../utils/queries';
import { CREATE_TRANSACTION } from '../utils/mutations';
import {Autocomplete, TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

import {DatePicker} from '@mui/lab';
import enLocale from 'date-fns/locale/en-GB';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';


// function filterChoiceFromOptions(choice, options){
//     let remainingOptions = options.filter((option) => choice !== option.name);
//     return remainingOptions
// }

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

    // prepare the return mutation for creating query
    const [createTransaction, transactionReturn] = useMutation(CREATE_TRANSACTION);

    if (transactionReturn.loading) return 'Submitting...';

    if (transactionReturn.error) {
        console.log(transactionReturn)
        return `Submission error! ${transactionReturn.error.message}`
    };

    // get the data from the return and set it to the userAccounts variable
    const userAccounts = data?.userAccounts || [];
    
    // let currentAccountChoice = toAccount.name? toAccount.name : fromAccount.name
    // var accountChoices = filterChoiceFromOptions(currentAccountChoice, userAccounts);

    
    // update state based on form select changes
    const handleToAccountChange = (e) => {

        console.log('Handling Currency change');
        console.log('event: ',e);

        let accountName = e.target.textContent;
        let account = ''

        console.log('Account of event: ', account);

        if(accountName){
            account = userAccounts.find(account => account.name === accountName);
            console.log('Account after filtering data: ', account);
            setToAccount({...account});
        // if there is no account on event, update state to be empty
        } else {
            setToAccount({});
        }

        // to account id is of form id="toAccount-option-0"
        // if(event.target.id.startsWith('toAccount')){
        //     let optionStrings = event.target.id.split('-');
        //     let accountIndex = parseInt(optionStrings[2]);
        //     let account = userAccounts[accountIndex];
            
        // }
        
    };

    // update state based on form select changes
    const handleFromAccountChange = (e) => {
        console.log('Handling Currency change');
        console.log('event: ',e);

        let accountName = e.target.textContent;
        let account = ''

        console.log('Account of event: ', account);

        if(accountName){
            account = userAccounts.find(account => account.name === accountName);
            console.log('Account after filtering data: ', account);
            setFromAccount({...account});
        // if there is no account on event, update state to be empty
        } else {
            setFromAccount({});
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
    // console.log('State Amount: ', amount);
    // console.log('State description: ', description);
    // console.log('State frequency: ', frequency);
    // console.log('State Date: ', date);
    // console.log('State End Recurrence: ', endRecurrence);

    const transferMaximum = () => {
        if(fromAccount.balance > 0){
            let fundsAvailable = fromAccount.balance;
            setAmount(fundsAvailable)
        } else {
            setErrors(['You don\'t have a positive balance in that from account'])
        }
    }

    const clearState = () => {
        setToAccount ({});
        setFromAccount({});
        setDescription('');
        setAmount(0);
        setFrequency('once');
        setDate(new Date());
        setEndRecurrence(null)
    }

    // checks that the form is submittable, if it fails, sets error state and returns false, else true
    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        //check at least one account
        if(!toAccount?.balance && !fromAccount?.balance){
            errorBuffer.push('You need to choose at least one account');
        }

        // check accounts aren't equal
        if(toAccount?.balance && fromAccount?.balance){
            if(toAccount.name === fromAccount.name){
                errorBuffer.push('You can\'t send money to the same account');
            }
        }

        // check amount is not null
        if(!amount || amount < 0){
            errorBuffer.push('You need to specify a positive amount');
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
        }

        // check that there is a date
        if(!date){
            errorBuffer.push('You need to set a date for this transaction to happen');
        }
        // check that if frequency isn't once, there is a selected endRecurrence
        if(frequency !== 'once' && !endRecurrence){
            errorBuffer.push('You need to specify when this transaction ends');
        }
        setErrors(errorBuffer)

        if(errorBuffer.length > 0){
            valid = false
        }

        return valid
    }

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try { 
            if(validateFormSubmit()){

                let payload = {
                    toAccount: toAccount._id, 
                    fromAccount: fromAccount._id, 
                    amount: amount, 
                    description: description, 
                    date: date, 
                    frequency: frequency, 
                    endRecurrence: endRecurrence, 
                }

                console.log('payload: ',payload);

                createTransaction({ 
                    variables: payload
                });
                console.log(transactionReturn)
                if(transactionReturn.error){
                    setErrors(transactionReturn.error);
                } else {
                    // refresh and re-fetch user data
                    window.location.reload();
                }

                clearState()
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
                        clearOnBlur
                        selectOnFocus
                        handleHomeEndKeys
                        id="fromAccount"
                        name='fromAccount'
                        options={userAccounts}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        sx={{ width: 300 }}
                        onChange={handleFromAccountChange}
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
                        options={userAccounts}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        sx={{ width: 300 }}
                        onChange={handleToAccountChange}
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