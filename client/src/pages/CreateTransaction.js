import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_USER_ACCOUNTS } from '../utils/queries';
import { CREATE_TRANSACTION } from '../utils/mutations';
import {Autocomplete, TextField} from '@mui/material';

const initialFormState = {
    toAccount: '',
    fromAccount: '',
    description: '',
    date: Date.now(),
    amount: 0,
    frequency: 'once',
    endRecurrence: null,
}

export default function CreateTransaction() {

    const [formState, setFormState] = useState(initialFormState);

    // get the accounts for the user
    const {loadingAccounts, accountData} = useQuery(QUERY_USER_ACCOUNTS, {});
    const userAccounts = accountData?.userAccounts || {};

    const [createTransaction, { error, transactionData }] = useMutation(CREATE_TRANSACTION);

    if(loadingAccounts){
        return <div>Loading Your Accounts</div>
    }

    // update state based on form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    // submit form
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log(formState);
        try { 
            const {transactionData} = await createTransaction({
                variables: { ...formState },
            });

            console.log(`response token from server was`, transactionData.createTransaction);
        } catch (e) {
        console.error(e);
        }

        // clear form values
        setFormState(initialFormState);
    };

    var accounts = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 }
    ]


    return (
        <div>
            <h1>TEST</h1>
            <form onSubmit={handleFormSubmit}>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={accounts}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="To Account" />}
            />
            <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                value={formState.toAccount}
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
            <button
                className="btn btn-block btn-primary"
                style={{ cursor: 'pointer' }}
                type="submit"
            >
                Submit
            </button>
            </form>
  
            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
        </div>
    )
}