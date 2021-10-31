import React from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button} from '@mui/material'
import {QUERY_ACCOUNT_TRANSACTIONS} from '../utils/queries'
import {slugify} from '../helpers/strings'
import { Link } from 'react-router-dom';
import {useParams} from 'react-router-dom';



export default function Account() {

    let {slug} = useParams();



    const {loading, data} = useQuery(QUERY_ACCOUNT_TRANSACTIONS, {
        // variables: {
        //     'accountId': id
        // }
    });

    const userAccountTransactions = data?.userAccountTransactions || {};

    if(loading){
        return <div>Loading...</div>
    }

    return (
        <div className="account-rows">
            {userAccountTransactions && userAccountTransactions.map((transaction) => (
                <div key={transaction._id}>
                    <Button LinkComponent={Link} color='primary' variant="contained" to={`/account/${slugify(transaction.name)}`}>{transaction.description} {transaction.amount}</Button>
                </div>
            ))}
        </div>
    )
}