import React, {useState} from 'react'
import {Button, TextField, InputAdornment} from '@mui/material'
import {DatePicker} from '@mui/lab';
import enLocale from 'date-fns/locale/en-GB';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function TagGoalDetails({values, handleChange,handleGoalDateChange, prevStep}) {

    const [errors, setErrors] = useState([]);

    const validateFormSubmit = () => {
        let valid = true;
        let errorBuffer = [];

        //check is the date is set to the future
        if(values.goal < new Date()){
            errorBuffer.push('Goal Date must be in the future');
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

        // check the state is correct before progressing
        if(validateFormSubmit()){
            console.log('Regressing form');
            prevStep();
        }
    }

    const sendForm = () => {
        console.log('Sending form not implemented yet')
    }

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
            <h1>Tags and Goal</h1>
            <TextField 
                id="tags" 
                label="Tags" 
                value={values.tags} 
                placeholder="Low risk, mortgage, 20yrs"
                onChange={handleChange('tags')} 
            />
            <DatePicker
                required="false"
                label='Goal Date'
                value={values.goalDate}
                onChange={(newDate) => handleGoalDateChange(newDate)}
                renderInput={(params) => <TextField {...params} />}
            />
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
            <Button onClick={progress} variant="outlined">Continue</Button>
            <Button onClick={backup} variant="outlined">Back</Button>
            <Button href="/" variant="outlined">Cancel</Button>
            <div id="error">
                {errors.map((error) => {
                    return <div>{error}</div>
                })}
            </div> 
            </LocalizationProvider>
        </div>
    )
}