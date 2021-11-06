import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {QUERY_GET_ALL_CURRENCIES} from '../utils/queries';
import {Autocomplete, TextField} from '@mui/material';

import { useMutation, useQuery } from '@apollo/client';
import { SIGN_UP } from '../utils/mutations';

import AuthService from '../utils/auth';

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
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
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
    console.log(formState);
    
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
    return <div>Thinking, don't rush me...</div>
  }
  
  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <input
                  className="form-input"
                  placeholder="Your username"
                  name="username"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <Autocomplete
                  disablePortal
                  clearOnBlur
                  selectOnFocus
                  handleHomeEndKeys
                  id="currency"
                  name='currency'
                  options={currencies}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  sx={{ width: 300 }}
                  onChange={handleSelectCurrency()}
                  renderInput={(props) => <TextField {...props} label="Currency" />}
              />
                <button
                  className="btn btn-block btn-primary"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
