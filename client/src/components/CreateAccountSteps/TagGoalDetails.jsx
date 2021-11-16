import React, {useState} from 'react'
import {Button, TextField, InputAdornment, Typography, Grid, ButtonGroup} from '@mui/material';
import { useMutation } from '@apollo/client';
import {DatePicker} from '@mui/lab';
import enLocale from 'date-fns/locale/en-GB';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { CREATE_ACCOUNT_FE } from '../../utils/mutations';
import { useHistory } from 'react-router-dom';
import {Container} from '@mui/material'

export default function TagGoalDetails({values, handleChange,handleGoalDateChange, prevStep}) {

    const [errors, setErrors] = useState([]);
    const history = useHistory();

    // prepare the return mutation for creating query
    const [createAccount, accountReturn] = useMutation(CREATE_ACCOUNT_FE);

    if(accountReturn.loading){
        return (
            <Container>
                <Grid container paddingTop="40px">
                    <Grid item>
                    <Typography variant='h3' color='primary'>Building your account, syncing economy, don't interrupt</Typography>
                    </Grid>
                </Grid>
            </Container>
        )
    }

    if (accountReturn.error) {
        console.log(JSON.stringify(accountReturn.error, null, 2));
        // console.log(accountReturn.error.networkError.result.errors)
        // console.log(accountReturn.error instanceof Error);
        // console.log(accountReturn.error)
    };

    if (accountReturn.data) {
        console.log('Congratulations you made an account')
        console.log(accountReturn.data)
        history.push('/home');
    };

    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        // if we have either a goal amount or a goal date
        if(values.goalDate || values.goalAmount){
            // we must have both
            if(!(values.goalDate && values.goalAmount)){
                errorBuffer.push('You need a date and an amount if you want to set a goal at all - get serious')
            }
        }

        //check is the date is set to the future
        if(values.goalDate){
            if(values.goalDate < new Date()){
                errorBuffer.push('Goal Date must be in the future');
            }
        }

        //check balance is a float
        if(values.goalAmount){
            if (isNaN(values.goalAmount) && !values.goalAmount.toString().indexOf('.') !== -1){
                errorBuffer.push('That goal amount isn\'t valid');
            }
        }

        setErrors(errorBuffer)

        if(errorBuffer.length > 0){
            valid = false
        }

        return valid
    }

    const progress = (e) => {
        e.preventDefault();
        console.log('Sending form');

        // check the state is correct before progressing
        if(validateFormSubmit()){
            console.log('Valid form sending');
            sendForm();
        }
    }

    const backup = (e) => {
        e.preventDefault();
        prevStep();

    }

    const sendForm = () => {
        console.log('Pre submit form state: ',values);
        createAccount({
            variables: values
        })
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{paddingTop: '40px'}}>
                <Typography variant="h3" color="primary">Tags and Goal - Optional</Typography>
                <Grid item xs>
                    <TextField 
                        id="tags" 
                        label="Tags" 
                        value={values.tags} 
                        placeholder="Low risk, mortgage, 20yrs"
                        onChange={handleChange('tags')} 
                    />
                </Grid>
                <Grid item xs>
                    <DatePicker
                        required="false"
                        label='Goal Date'
                        value={values.goalDate}
                        onChange={(newDate) => handleGoalDateChange(newDate)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid item xs>
                    <TextField 
                        id="goalAmount" 
                        label="Goal Amount" 
                        value={values.goalAmount} 
                        placeholder="10000"
                        onChange={handleChange('goalAmount')}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs>
                    <ButtonGroup>
                        <Button onClick={backup} variant="outlined">Back</Button>
                        <Button onClick={progress} variant="contained">Continue</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs>
                    <Button href="/" variant="outlined">Cancel</Button>
                </Grid>
                <Grid item xs>
                    <div id="error">
                        {errors.map((error) => {
                            return <div>{error}</div>
                        })}
                    </div>
                </Grid>
            </Grid>
        </LocalizationProvider>
    )
}