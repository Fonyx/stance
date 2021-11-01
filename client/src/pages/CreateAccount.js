import React, {useState}from 'react'
import {TextField, Divider} from '@mui/material';
import ExchangeAutoComplete from '../components/ExchangeAutoComplete';
import AccountTypeAutoComplete from '../components/AccountTypeAutoComplete';
import CurrencyAutoComplete from '../components/CurrencyAutoComplete';
import PartyAutoComplete from '../components/PartyAutoComplete';
import PartyAutoCompleteAdd from '../components/autocompleteDialog';
import AssetCode from '../components/AssetCode';
import Compound from '../components/Compound'

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

        } catch (e) {
        console.error(e);
        }

        // clear form values
        setFormState(initialFormState);
    };

    return (
        <div>
            <h2>NEW ACCOUNT</h2>
            <form onSubmit={handleFormSubmit}>
                <Divider>Core Fields</Divider>
                <AccountTypeAutoComplete onChange={handleChange}/>
                <TextField id="description" label="Description"></TextField>
                <TextField id="accountName" label="Account Name"></TextField>
                <TextField id="openingBalance" label="Balance"></TextField>
                <PartyAutoComplete />
                <PartyAutoCompleteAdd/>

                <Divider>Money Fields</Divider>
                <CurrencyAutoComplete />
                <TextField id="interestRate" label="Interest Rate" placeholder="3.5%"></TextField>
                <Compound />

                <Divider>Crypto and Stock Fields</Divider>
                <ExchangeAutoComplete />
                <AssetCode />

                <Divider>Subdocuments</Divider>
                <TextField id="tags" label="Tags"></TextField>
                <TextField id="Goal" label="Goal"></TextField>

            </form>
        </div>
    )
}
