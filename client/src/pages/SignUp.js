import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {QUERY_GET_ALL_CURRENCIES} from '../utils/queries';

import { useMutation, useQuery } from '@apollo/client';
import { SIGN_UP } from '../utils/mutations';

import AuthService from '../utils/auth';

import {Autocomplete, Button, Grid, TextField, ButtonGroup, Typography} from '@mui/material'

const Signup = () => {

  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });

  console.log(formState);

  const currencyResp = useQuery(QUERY_GET_ALL_CURRENCIES, {});

  var currencies = currencyResp.data?.allCurrencies || [];
  var loading = currencyResp.loading || false;

  const [signUp, { error, data }] = useMutation(SIGN_UP);

  const [errors, setErrors] = useState([]);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // check the form fields are valid, use error buffer
  const validateForm = () => {
    let valid = true;
    let errorBuffer = [];

    //check email presence
    if(true){
        errorBuffer.push('No validation built yet');
    }

    setErrors(errorBuffer)

    if(errorBuffer.length > 0){
        valid = false
    }

    return valid
  }
  
  const handleSelectCurrency = () => e => {
    console.log('Handling Currency change');
    console.log('event: ',e);
    
    let currencyName = e.target.textContent;
    let currencyCode = ''
    
    console.log('Currency Name of event: ', currencyName);
    
    if(currencyName){
      let currency = currencies.find(currency => currency.name === currencyName);
      currencyCode = currency.code;
    } else {
      currencyCode = ''
    }
    console.log('CurrencyCode after filtering data: ', currencyCode);
    
    
    setFormState({
      ...formState,
      'currencyCode': currencyCode
    });
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    validateForm();
    
    try {
      const { data } = await signUp({
        variables: { ...formState },
      });
      console.log(`response token from server was`, data.signUp.token);
      AuthService.login(data.signUp.token);
    } catch (e) {
      console.error(e);
    }
  };
  
  if(loading){
    return (
      <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{minHeight: '10vh', paddingTop: '20px'}}>
            <Grid item xs>
                <Typography color="primary">
                  <h1>Thinking, don't rush me...</h1>
                </Typography>
            </Grid>
      </Grid>
    )
  }
  
  return (
    <div>
      {data ? (
        <p>
          Success! Welcome to Stance!
        </p>
      ) : (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{minHeight: '10vh', paddingTop: '20px'}}>
          <Grid item xs>
              <Typography color="primary">
                <h1>SIGN UP TO STANCE</h1>
              </Typography>
          </Grid>
          <Grid item xs>
            <TextField
              className="form-input"
              placeholder="Your username"
              name="username"
              type="text"
              label="Username"
              value={formState.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs>
            <TextField
              className="form-input"
              placeholder="Your email"
              name="email"
              type="email"
              label="Email"
              value={formState.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs>
            <TextField
              className="form-input"
              placeholder="******"
              name="password"
              type="password"
              label="Password"
              value={formState.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs>
            <Autocomplete
              disablePortal
              clearOnBlur
              selectOnFocus
              handleHomeEndKeys
              id="currency"
              name='currency'
              label="Currency"
              options={currencies}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              sx={{ width: 300 }}
              onChange={handleSelectCurrency()}
              renderInput={(props) => <TextField {...props} label="Currency" />}
            />
          </Grid>
          <Grid item md>
            <Button variant="outlined"
              style={{ cursor: 'pointer' }}
              type="submit"
              onSubmit={handleFormSubmit}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              href="/"
              style={{ cursor: 'pointer' }}
              type="cancel"
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs>
            <div id="error">
                {errors.map((error) => {
                    return <div>{error}</div>
                })}
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Signup;
