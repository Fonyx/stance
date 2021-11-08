import React, {useState} from 'react'
import { useQuery } from '@apollo/client';
import {Button, Grid, IconButton, Typography} from '@mui/material'
import {QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS} from '../utils/queries'
import { Link } from 'react-router-dom';
import ToggleButton from '../components/toggleButton';
import LineChart from '../components/LineChart';
import accumulateTransactions from '../helpers/accumulator';
import { readableDate} from '../helpers/formatter';
import {truncate} from '../helpers/strings';

/**
 * Function that filters out an account package from the accountData mega object, return shape: {valuation, accountObj, credits, debits}
 * @param {*} stateAccount 
 * @param {*} accountData 
 * @returns 
 */
function getFilteredDataFromState(accountName, accountData){
    // console.log('Filtering out: ', accountName, 'from', accountData)
    let accountPackage = accountData.find(element => element.account.name === accountName);
    // console.log('account package after filtering: ', accountPackage)
    return accountPackage
}

// function getCreditsFromPayload(payload){
//     let credits = [];
//     for(let i = 0; i < payload.length; i++){
//         let element = payload[i];
//         credits.push(element.credits)
//     }
//     return credits
// }

// function getDebitsFromPayload(payload){
//     let debits = [];
//     for(let i = 0; i < payload.length; i++){
//         let element = payload[i];
//         debits.push(element.debits)
//     }
//     return debits
// }

// function getAccumulatedValuation(payload){

//     let valuation = payload.reduce((previous, current) => {
//         return previous + current.userCurrValuation
//     }, 0);
//     return valuation
// }

/**
 * Get the ticker list for a customer
 * @param {[accountPackage]} accountData 
 */
function getTickers(accountData){
    let tickerList = [];
    let assetList = [];
    
    for(let i = 0; i < accountData.length; i++){
        let accountPackage = accountData[i];
        let assetCode = accountPackage.account.assetCode;
        if(assetCode){

            if(!assetList.includes(accountPackage.account.assetCode)){
            // if it is an asset
    
                assetList.push(accountPackage.account.assetCode);
    
                tickerList.push({
                    assetCode: accountPackage.account.assetCode,
                    unitPrice: accountPackage.account.unitPrice,
                    assetName: accountPackage.account.assetName,
                    _id: accountPackage.account._id
                });
            }
        }
    }

    return tickerList;
}

export default function Home() {

    const [selectedAccount, setSelectedAccount] = useState('');

    const {loading, data} = useQuery(QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS, {});

    var accountData = null
    var tickers = [];

    if(data?.allUserAccountsAndTransactions){
        accountData = data.allUserAccountsAndTransactions;
        tickers = getTickers(accountData);
    }

    if(loading){
        return <Typography variant='h3' color='primary'>Loading Your Account Details....They are very detailed</Typography>
    }

    /**
     * Updates selectedAccount and filters accumulated data for line chart
     * @param {eventObject} e 
     */
    const handleSelect = (e) => {
        e.preventDefault();

        let pressedAccount = e.target.id;

        var {userCurrValuation, account, credits, debits} = getFilteredDataFromState(pressedAccount, accountData);

        var accumulatedData = accumulateTransactions(account.balance, credits, debits);

        // limit the number of transactions to display, first 10
        // var credits = credits.slice(0, 10);
        // var debits = credits.slice(0, 10);

        let statePackage = {
            accountName: pressedAccount,
            account,
            userCurrValuation,
            accumulatedData,
            tickers,
            credits,
            debits
        }
        setSelectedAccount(statePackage);
    }


    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4} lg={3} xl={2}>
                <Grid container >
                    <Grid item xs={6} sm={12}>
                        <Typography variant='h4' color="primary">Your Accounts</Typography>
                        {accountData && accountData.map((element) => (
                            <div key={element.account._id}>
                                <ToggleButton 
                                    name={element.account.name} 
                                    color={element.account.name === selectedAccount.accountName? 'primary': 'secondary'}
                                    handleSelect={handleSelect} 
                                    variant="contained"
                                >
                                </ToggleButton>
                            </div>
                        ))}
                        <Button color="secondary" variant="contained" href="/createAccount">Create Account</Button>
                    </Grid>
                    <Grid item xs={6} sm={12}>
                    <Typography variant='h4' color="primary">Your Tickers</Typography>
                        {tickers && tickers.map((element) => (
                            <div key={element._id}>
                                <Button 
                                    LinkComponent={Link}
                                    color="primary" 
                                    variant="outlined" 
                                    to={`/asset/${element.assetCode}`}
                                >
                                    {truncate(element.assetName, 25) + ' : ' + element.unitPrice}
                                    {/* {element.assetName + ' : ' + element.unitPrice} */}
                                </Button>
                            </div>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} lg={6} xl={8} textAlign="center">
                {selectedAccount && 
                    <div id="chart-section">
                        <div>
                            <Typography variant="h3" color="primary">{selectedAccount.accountName}</Typography>
                            <Grid container alignItems="center">
                                <Grid item xs={8}>
                                    <IconButton>
                                        <Typography variant="h5">Current Valuation: {selectedAccount.account.currency.symbol}{selectedAccount.userCurrValuation}</Typography>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button 
                                        LinkComponent={Link}
                                        color="primary" 
                                        variant="outlined" 
                                        to={`/account/${selectedAccount.account._id}`}
                                    >
                                        update
                                    </Button>
                                </Grid>
                            </Grid>
                            <LineChart accumulatedData={selectedAccount.accumulatedData}/>
                        </div>
                    </div>
                }
            </Grid>
            <Grid item xs={12} lg={3} xl={2} textAlign="center">
                <Typography variant="h6" color="secondary">
                    Transactions
                </Typography>
                <Button color="secondary" variant="contained" href="/createTransaction">Add</Button>
                <Typography variant='h4' color="primary">Incoming</Typography>
                {selectedAccount?.credits && 
                    <Typography variant='h5' color="primary">Credits: {selectedAccount.credits.length}</Typography>
                }
                {selectedAccount && selectedAccount.credits.map((transaction) => (
                    <div key={transaction._id}>
                        <Button 
                            LinkComponent={Link}
                            color="primary" 
                            variant="outlined" 
                            to={`/asset/${transaction.date.amount}`}
                        >
                            {readableDate(new Date(transaction.date*1)) + ' : ' + transaction.amount + ' : ' +  transaction.description }
                        </Button>
                    </div>
                ))}
                <Typography variant='h4' color="primary">Outgoing</Typography>
                {selectedAccount?.debits && 
                    <Typography variant='h4' color="primary">Debits: {selectedAccount.debits.length}</Typography>
                }
                {selectedAccount && selectedAccount.debits.map((transaction) => (
                    <div key={transaction._id}>
                        <Button 
                            LinkComponent={Link}
                            color="primary" 
                            variant="outlined" 
                            to={`/asset/${transaction.date.amount}`}
                        >
                            {readableDate(new Date(transaction.date*1)) + ' : ' + transaction.amount + ' : ' +  transaction.description}
                        </Button>
                    </div>
                ))}
            </Grid>
        </Grid>
    )
}
