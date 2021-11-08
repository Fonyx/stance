import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_ACCOUNTS } from '../utils/queries';
import { CREATE_TRANSACTION } from '../utils/mutations';
import {Autocomplete, Grid, Typography, ButtonGroup, TextField, Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useHistory } from 'react-router-dom';

import {DatePicker} from '@mui/lab';
import enLocale from 'date-fns/locale/en-GB';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const initialFormState ={
    toAccount: null,
    fromAccount: null,
    description: '',
    amount: 0,
    frequency: 'once',
    date: new Date(),
    endRecurrence: null
}

const frequencies = ['once', 'daily', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly']

export default function CreateTransaction() {
    

    const [formState, setFormState] = useState(initialFormState);

    const [errors, setErrors] = useState([]);
    const history = useHistory();

    // create query to get user accounts
    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});

    // prepare the return mutation for creating query
    const [createTransaction, transactionReturn] = useMutation(CREATE_TRANSACTION);

    if (transactionReturn.loading) return 'Submitting...';

    if (transactionReturn.error) {
        // since the apollo client returns a weird error derivative we need custom logging
        console.log(JSON.stringify(transactionReturn.error, null, 2));
        // console.log(accountReturn.error.networkError.result.errors)
    };

    const clearState = () => {
        setFormState(initialFormState)
    }

    // successfully made a transaction
    if (transactionReturn.data) {
        console.log('Congratulations you added a transaction', transactionReturn.data);
        history.push('/home');
    };

    // Handle fields change
    const handleInputChange = input => e => {
        console.log('Handling Change');
        // console.log(input, e);

        let newValue = e.target.value;

        setFormState({
        ...formState,
        [input]: newValue
        });

    };

    // Handle fields change
    const handleFloatChange = (e) => {
        console.log('Handling Change');
        // console.log(input, e);

        let newValue = e.target.value;

        setFormState({
        ...formState,
        amount: newValue
        });

    };

    // get the data from the return and set it to the userAccounts variable
    const userAccounts = data?.userAccounts || [];
    
    // update state based on form select changes
    const handleToAccountChange = (e) => {

        console.log('Handling Currency change');
        console.log('event: ',e);

        let accountName = e.target.textContent;

        console.log('Account of event: ', accountName);

        if(accountName){
            let account = userAccounts.find(account => account.name === accountName);
            console.log('Account after filtering data: ', account);
            setFormState({
                ...formState,
                toAccount: account
            })
        }
        
    };

    const handleFromAccountChange = (e) => {

        console.log('Handling Currency change');
        console.log('event: ',e);

        let accountName = e.target.textContent;

        console.log('Account of event: ', accountName);

        if(accountName){
            let account = userAccounts.find(account => account.name === accountName);
            console.log('Account after filtering data: ', account);
            setFormState({
                ...formState,
                fromAccount: account
            })
        }
        
    };

    const handleDateChange = (date, input) => {
        console.log('state date: ',date);
        setFormState({
          ...formState,
          [input]: date
        });
      }

    const transferMaximum = () => {
        if(formState.fromAccount.balance > 0){
            let fundsAvailable = formState.fromAccount.balance;
            setFormState({
                ...formState,
                amount: fundsAvailable
            })
        } else {
            setErrors(['You don\'t have a positive balance in that from account'])
        }
    }

    // checks that the form is submittable, if it fails, sets error state and returns false, else true
    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        //check at least one account
        if(!formState.toAccount?.balance && !formState.fromAccount?.balance){
            errorBuffer.push('You need to choose at least one account');
        }

        // check accounts aren't equal
        if(formState.toAccount?.balance && formState.fromAccount?.balance){
            if(formState.toAccount.name === formState.fromAccount.name){
                errorBuffer.push('You can\'t send money to the same account');
            }
        }

        // check amount is not null
        if(!formState.amount || formState.amount < 0){
            errorBuffer.push('You need to specify a positive amount');
            //check amount is a float
            if(formState.amount){
                if (isNaN(formState.amount) && !formState.amount.toString().indexOf('.') !== -1){
                    errorBuffer.push('That amount looks wrong, must be number');
                }
            }
        }

        // check amount isn't larger than the balance in the from account if there is a from account
        // if(formState.fromAccount?.balance){
        //     if(formState.amount > formState.fromAccount.balance){
        //         errorBuffer.push("You can't transfer more than the balance of the from account for the transaction")
        //     }
        // }

        //check fromAccount balance is a float
        if(formState.fromAccount?.balance){
            if (isNaN(formState.fromAccount.balance) && !formState.fromAccount.balance.toString().indexOf('.') !== -1){
                errorBuffer.push('That fromAccount balance isn\'t valid');
            }
        }

        //check fromAccount balance is a float
        if(formState.toAccount?.balance){
            if (isNaN(formState.toAccount.balance) && !formState.toAccount.balance.toString().indexOf('.') !== -1){
                errorBuffer.push('That toAccount balance isn\'t valid');
            }
        }

        // check there is a description
        if(!formState.description){
            errorBuffer.push('You need to describe the transaction, your future self with thank you');
        }

        // check that there is a date
        if(!formState.date){
            errorBuffer.push('You need to set a date for this transaction to happen');
        }
        // check that if frequency isn't once, there is a selected endRecurrence
        if(formState.frequency !== 'once' && !formState.endRecurrence){
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

                // convert the payload to accountId strings because bad design downstream
                let payload = {
                    ...formState,
                    toAccount: formState.toAccount._id,
                    fromAccount: formState.fromAccount._id,
                    amount: parseFloat(formState.amount)
                }

                console.log('payload: ',payload);

                createTransaction({ 
                    variables: payload,
                });
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

    // console.log('current form state: ',formState);
    // console.log('User accounts available: ',userAccounts);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>

            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="space-between" style={{paddingTop: '40px'}}>
                <Typography variant="h3" color="primary">NEW TRANSACTION</Typography>

                <Grid container justifyContent="space-around" alignItems="flex-start" style={{paddingTop: '20px'}}>
                    <Grid item xs={3}>
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
                        {formState.fromAccount?.balance &&
                            <Grid>
                                <Typography variant="h6" color="primary">Balance: {formState.fromAccount.balance} </Typography>
                                {formState.fromAccount.type !== 'money' &&
                                    <Typography variant="h6" color="primary">Worth: {formState.fromAccount.currency.symbol}{formState.fromAccount.valuation.toFixed(4)} {formState.fromAccount.currency.code}</Typography>
                                }
                            </Grid>
                        }
                    </Grid>
                
                    <Grid item xs={3}>
                        <Autocomplete
                            disablePortal
                            id="toAccount"
                            name='toAccount'
                            options={userAccounts}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            sx={{ width: 300 }}
                            onChange={handleToAccountChange}
                            onReset={handleToAccountChange}
                            renderInput={(params) => <TextField {...params} label="To Account" />}
                        />
                        {formState.toAccount?.balance &&
                            <Grid item>
                            {formState.fromAccount?.balance &&
                                <Grid>
                                    <Typography variant="h6" color="primary">Balance: {formState.toAccount.balance} </Typography>
                                    {formState.fromAccount.type !== 'money' &&
                                            <Typography variant="h6" color="primary">Worth: {formState.toAccount.currency.symbol}{formState.toAccount.valuation.toFixed(4)} {formState.toAccount.currency.code}</Typography>
                                        }
                                </Grid>
                            }
                            </Grid>
                        }
                    </Grid>
                </Grid>

                <Grid item xs={6} style={{paddingTop: '20px'}}>
                    <Grid item>
                        <TextField name='amount' 
                            onChange={handleFloatChange} 
                            label="Amount" 
                            value={formState.amount} 
                            placeholder="0.00"/>
                    </Grid>
                    <Grid item>
                        <Button onClick={transferMaximum}>Transfer All</Button>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center">
                    <Grid item>
                        <TextField name='description' 
                            onChange={handleInputChange('description')} 
                            label="Description" 
                            value={formState.description} 
                            placeholder="A quick note"/>
                    </Grid>
                    <Grid item>
                        <Select
                            labelId="every"
                            id="every"
                            value={formState.frequency}
                            label="How Often"
                            name='frequency'
                            onChange={handleInputChange('frequency')}
                        >
                            {frequencies.map((element, index) => (
                                <MenuItem key={index} value={element}>{element}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                </Grid>

                <Grid item xs={3}>
                    <DatePicker
                        label='On Date'
                        value={formState.date}
                        minDate={new Date()}
                        onChange={(newValue) => {
                            // console.log('Updating date state to: ', newValue);
                            handleDateChange(newValue, 'date');
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        />
                        
                </Grid>
                <Grid item xs={3}>
                    {formState.frequency !== 'once'? 
                        <DatePicker
                            label='Until'
                            value={formState.endRecurrence}
                            minDate={new Date()}
                            onChange={(newValue) => {
                                // console.log('Updating end Recurrence state to: ', newValue);
                                handleDateChange(newValue, 'endRecurrence');
                            }}
                            renderInput={(params) => <TextField {...params} />}
                    />: <></>}  
                </Grid>
                
                <Grid item>
                    <ButtonGroup>
                        <Button
                            style={{ cursor: 'pointer' }}
                            type="submit"
                            variant="outlined"
                            href="/home"
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ cursor: 'pointer' }}
                            type="submit"
                            variant="contained"
                            onClick={handleFormSubmit}
                        >
                            Submit
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs>
                    <div id="error">
                        {errors.map((error, index) => {
                            return <div key={index}>{error}</div>
                        })}
                    </div>
                </Grid>
            </Grid>
        </LocalizationProvider>
    )
}