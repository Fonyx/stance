import React, {useState}from 'react'
import {CREATE_ACCOUNT} from '../utils/mutations';
import { useMutation } from '@apollo/client';
import {TextField, Divider} from '@mui/material';
import ExchangeAutoComplete from '../components/ExchangeAutoComplete';
import AccountTypeAutoComplete from '../components/AccountTypeAutoComplete';
import CurrencyAutoComplete from '../components/CurrencyAutoComplete';
import PartyAutoComplete from '../components/PartyAutoComplete';
import PartyAutoCompleteAdd from '../components/autocompleteDialog';

const initialFormState = {
    type: 'money',
    name: 'My account',
    openingBalance: 0,
    interestRate: 0,
    compounds: 'monthly',
    party: null,
    currencyCode: 'AUD',
    exchange: null,
}

export default function CreateAccount() {

    const [formState, setFormState] = useState(initialFormState);


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
        try { 
            // const {transactionData} = await createAccount({
            //     variables: { ...formState },
            // });

        } catch (e) {
        console.error(e);
        }

        // clear form values
        setFormState(initialFormState);
    };

    return (
        <div>
            <h2>NEW ACCOUNT</h2>
            <form>
                <TextField id="description" label="Description"></TextField>
                <TextField id="accountName" label="Account Name"></TextField>
                <TextField id="openingBalance" label="Balance"></TextField>
                <AccountTypeAutoComplete />

                <Divider></Divider>
                <ExchangeAutoComplete />
                <CurrencyAutoComplete />


                <Divider></Divider>
                <PartyAutoComplete />
                <PartyAutoCompleteAdd/>
            </form>
        </div>
    )
}
