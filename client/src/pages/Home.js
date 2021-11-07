import React, {useState} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button, Grid, IconButton, Typography} from '@mui/material'
import {QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS} from '../utils/queries'
import { Link } from 'react-router-dom';
// import BarChart from '../components/BarChart';
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

function getCreditsFromPayload(payload){
    let credits = [];
    for(let i = 0; i < payload.length; i++){
        let element = payload[i];
        credits.push(element.credits)
    }
    return credits
}

function getDebitsFromPayload(payload){
    let debits = [];
    for(let i = 0; i < payload.length; i++){
        let element = payload[i];
        debits.push(element.debits)
    }
    return debits
}

function getAccumulatedValuation(payload){

    let valuation = payload.reduce((previous, current) => {
        return previous + current.userCurrValuation
    }, 0);
    return valuation
}

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


    if(data?.allUserAccountsAndTransactions){
        var accountData = data.allUserAccountsAndTransactions;
        var tickers = getTickers(accountData);
    } else {
        var accountData = null
        var tickers = [];
    }

    // console.log('Selected Account: ', selectedAccount);

    if(loading){
        return <div>Loading Your Account Details....They are very detailed</div>
    }

    /**
     * Updates selectedAccount and filters accumulated data for line chart
     * @param {eventObject} e 
     */
    const handleSelect = (e) => {
        e.preventDefault();

        let pressedAccount = e.target.id;

        // console.log('User clicked on: ',pressedAccount);

        var {userCurrValuation, account, credits, debits} = getFilteredDataFromState(pressedAccount, accountData);

        var accumulatedData = accumulateTransactions(account.balance, credits, debits);

        // limit the number of transactions to display, first 10
        var creditLimit = credits.slice(0, 10);
        var debitLimit = credits.slice(0, 10);

        let statePackage = {
            accountName: pressedAccount,
            account,
            userCurrValuation,
            accumulatedData,
            tickers,
            credits: creditLimit,
            debits: debitLimit
        }
        setSelectedAccount(statePackage);
    }

    console.log(selectedAccount)

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4} lg={3} xl={2}>
                <Grid container >
                    <Grid item xs={6} sm={12}>
                        <h1>Your Accounts</h1>
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
                        <h1>Your Tickers</h1>
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
                                        <Typography variant="h5">Current Valuation: {selectedAccount.userCurrValuation}</Typography>
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
                            {selectedAccount?.credits && 
                                <h2>Credits: {selectedAccount.credits.length}</h2>
                            }
                            {selectedAccount?.debits && 
                                <h2>Debits: {selectedAccount.debits.length}</h2>
                            }
                        </div>
                    </div>
                }
            </Grid>
            <Grid item xs={12} lg={3} xl={2} textAlign="center">
                <Typography variant="h6" color="secondary">
                    Transactions
                </Typography>
                <Button color="secondary" variant="contained" href="/createTransaction">Add</Button>
                <h1>Incoming</h1>
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
            </Grid>
            <Grid item xs={6} textAlign="center">
                <h1>Outgoing</h1>
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
