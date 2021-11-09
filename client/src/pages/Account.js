import React from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {QUERY_ACCOUNT_AND_TRANSACTIONS} from '../utils/queries'
import { useParams} from 'react-router-dom';
import { Grid, Typography} from '@mui/material'
import LineChart from '../components/LineChart';
import accumulateTransactions from '../helpers/accumulator';

export default function Account() {

    let params = useParams();

    const {loading, data} = useQuery(QUERY_ACCOUNT_AND_TRANSACTIONS, {
        variables: {
            'accountId': params.id
        }
    });

    const account = data?.userAccountAndTransactions.account || [];
    const credits = data?.userAccountAndTransactions.credits || [];
    const debits = data?.userAccountAndTransactions.debits || [];
    const userCurrValuation = data?.userAccountAndTransactions.userCurrValuation || 0

    if(loading){
        return (
            <Grid container>
                <Grid item>
                    <Typography variant='h3' color='primary'>Drilling down into your account details</Typography>
                </Grid>
            </Grid>
        )
    }

    let accumulatedData = accumulateTransactions(account.balance, credits, debits);


    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} lg={6}>
                <Typography variant="h2" color="primary" style={{textTransform: "capitalize"}}>{account.name}: {account.assetName}</Typography>
                {account.type !== 'money' &&
                    <div>
                        <Typography variant="h4" color="primary">Balance: {account.balance}</Typography>
                        <Typography variant="h4" color="primary">Current Value: {account.currency.symbol}{userCurrValuation.toFixed(4)} {account.currency.code}</Typography>
                        <Typography variant="h4" color="primary">Unit Price: {account.unitPrice}{account.currency.code}</Typography>
                    </div>
                }
                {account.type === 'money' &&
                    <div>
                        <Typography variant="h4" color="primary">Balance: {account.currency.symbol}{account.balance} {account.currency.code}</Typography>
                    </div>
                }
            </Grid>
            <Grid item xs={12} lg={6}>
                <LineChart accumulatedData={accumulatedData}/>
            </Grid>
        </Grid>
    )
}