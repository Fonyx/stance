import React from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {QUERY_ACCOUNT_AND_TRANSACTIONS} from '../utils/queries'
import { useParams, Link } from 'react-router-dom';
import {Button} from '@mui/material'
import LineChart from '../components/LineChart';
import accumulateTransactions from '../helpers/accumulator';

export default function Account() {

    let params = useParams();

    console.log(params.id);


    const {loading, data} = useQuery(QUERY_ACCOUNT_AND_TRANSACTIONS, {
        variables: {
            'accountId': params.id
        }
    });

    const account = data?.userAccountAndTransactions.account || [];
    const credits = data?.userAccountAndTransactions.credits || [];
    const debits = data?.userAccountAndTransactions.debits || [];

    if(loading){
        return <div>Loading Account Information...</div>
    }

    let plotData = accumulateTransactions(account, credits, debits);
    console.log(plotData);

    return (
        <React.Fragment>
            {account && 
                <h1>{account.name}</h1>
            }
            <LineChart data={credits}/>
            <div className="account-rows">
                {credits && credits.map((transaction) => (
                    <div key={transaction._id}>
                        <Button LinkComponent={Link} color='primary' variant="contained" to={`/transaction/${(transaction._id)}`}>{transaction.description} {transaction.amount} {transaction.date}</Button>
                    </div>
                ))}
            </div>
            <div className="account-rows">
                {debits && debits.map((transaction) => (
                    <div key={transaction._id}>
                        <Button LinkComponent={Link} color='primary' variant="contained" to={`/transaction/${(transaction._id)}`}>{transaction.description} {transaction.amount} {transaction.date}</Button>
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}