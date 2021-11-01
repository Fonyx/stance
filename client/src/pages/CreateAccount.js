import React, {useState, useEffect}from 'react'
import {CREATE_ACCOUNT} from '../utils/mutations';
import {
    QUERY_GET_ALL_CURRENCIES, QUERY_GET_ALL_PARTIES, QUERY_GET_ALL_EXCHANGES
} from '../utils/queries';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import {Autocomplete, TextField, Button} from '@mui/material';

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

    // build queries and mutations
    // const [createAccount, { error, transactionData }] = useMutation(CREATE_ACCOUNT);

    const {loading, data} = useQuery(QUERY_GET_ALL_EXCHANGES, {});

    const exchanges = data?.allExchanges || [];

    if(loading) return <div>Loading Exchanges...</div>


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

    var types = [
        { label: 'Money'},
        { label: 'Crypto'},
        { label: 'Stock'}
    ]

    return (
        // <div>
        //     <h2>NEW ACCOUNT</h2>
        //     <form>
        //         <Autocomplete
        //             disablePortal
        //             id="type"
        //             options={types}
        //             sx={{ width: 300 }}
        //             renderInput={
        //                 (params) => <TextField {...params} label="type" />
        //             }
        //         />
        //     </form>
        // </div>
        <div className="account-rows">
            {exchanges && exchanges.map((exchange) => (
                <div key={exchange._id}>
                    <Button color="secondary" variant="contained">{exchange.code} {exchange.name}</Button>
                </div>
            ))}
        </div>
    )
}
