import React, {useState}from 'react'
import {CREATE_ACCOUNT} from '../utils/mutations';
import {QUERY_GET_ALL_CURRENCIES, QUERY_GET_ALL_PARTIES} from '../utils/queries';
import { useQuery } from '@apollo/client';
import ExchangeAutoComplete from '../components/ExchangeAutoComplete'

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
                <ExchangeAutoComplete />
            </form>
        </div>
        // <div className="account-rows">
        //     {exchanges && exchanges.map((exchange) => (
        //         <div key={exchange._id}>
        //             <Button color="secondary" variant="contained">{exchange.code} {exchange.name}</Button>
        //         </div>
        //     ))}
        // </div>
    )
}
