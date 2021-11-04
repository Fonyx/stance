import React from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button} from '@mui/material'
import {QUERY_ACCOUNT_TRANSACTIONS} from '../utils/queries'
import { Link, useParams } from 'react-router-dom';
import LineChart from '../components/LineChart';

export default function Account() {

    let params = useParams();

    console.log(params.id);


    const {loading, data} = useQuery(QUERY_ACCOUNT_TRANSACTIONS, {
        variables: {
            'accountId': params.id
        }
    });

    if(loading){
        return <div>Loading Account Information...</div>
    }

    const userAccountTransactions = data?.userAccountTransactions || [];


    return (
        <React.Fragment>
            <LineChart transactions={userAccountTransactions}/>
            <div className="account-rows">
                {userAccountTransactions && userAccountTransactions.map((transaction) => (
                    <div key={transaction._id}>
                        <Button LinkComponent={Link} color='primary' variant="contained" to={`/transaction/${(transaction._id)}`}>{transaction.description} {transaction.amount} {transaction.date}</Button>
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}