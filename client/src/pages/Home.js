import React, {useState} from 'react'
import { useQuery } from '@apollo/client';
import {Grid, Button, Chip, Container, IconButton, Typography, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody} from '@mui/material';
import {QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS} from '../utils/queries'
import {ToggleButton, StateToggleButton} from '../components/toggleButton'
import LineChart from '../components/LineChart';
import accumulateTransactions from '../helpers/accumulator';
import {truncate} from '../helpers/strings';
import Navbar from '../components/Navbar';
import {convertStringToDateString} from '../helpers/formatter'
import AddIcon from '@mui/icons-material/Add'



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

/**
 * Get all the tag names from the users account package
 * @param {[accountPackage]} accountData 
 */
function getTagsFromPackage(accountData){
    let tags = [];

    for (let i =0; i< accountData.length; i++){
        let packet = accountData[i];
        let packetTags = packet.account.tags;
        if(packetTags){
            for(let tagObj of packetTags){
                tags.push(tagObj.name);
            }
        }
    }
    
    return tags
}

export default function Home() {

    const [selectedAccount, setSelectedAccount] = useState('');

    const {loading, data} = useQuery(QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS, {});

    var accountData = null;
    var userTags = [];
    var tickers = [];

    if(data?.allUserAccountsAndTransactions){

        accountData = data.allUserAccountsAndTransactions;
        userTags = getTagsFromPackage(accountData)
        tickers = getTickers(accountData);
    }

    if(loading){
        return (
            <Container>
                <Grid container paddingTop="40px">
                    <Grid item>
                    <Typography variant='h3' color='primary'>Loading Your Account Details...Updating their valuations.....You can't rush art...</Typography>
                    </Grid>
                </Grid>
            </Container>
        )
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

        var creditTotal = credits.reduce((prev, curr) => {
            return prev + curr.amount
        }, 0);

        var debitTotal = debits.reduce((prev, curr) => {
            return prev + curr.amount
        }, 0);

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
            debits,
            creditTotal,
            debitTotal
        }
        setSelectedAccount(statePackage);
    }

    console.log(selectedAccount);

    return (
        <div>
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container padding="10px">
                            <Grid item>
                                <Typography variant="h3" color="primary">Your Accounts</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton color="secondary" href="/createAccount">
                                    <AddIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} padding="10px">
                        {accountData && accountData.map((element) => (
                            <ToggleButton 
                                name={element.account.name} 
                                key={element.account._id}
                                color={element.account.name === selectedAccount.accountName? 'primary': 'secondary'}
                                handleSelect={handleSelect} 
                                variant="contained"
                            >
                            </ToggleButton>
                        ))}
                    </Grid>
                    <Grid item xs={12} padding="10px">
                        <Typography variant='h3' color="primary">Tickers</Typography>
                        {tickers && tickers.map((element) => (
                            <Chip label={truncate(element.assetName, 25)}
                                component='a'
                                key={element._id}
                                color="primary" 
                                variant="outlined" 
                                href={`/asset/${element._id}`}
                                clickable/>
                        ))}
                    </Grid>
                    <Grid item xs={12} padding="10px">
                        <Typography variant="h3" color="primary">
                            Tags
                        </Typography>
                        <Grid item container xs={12} direction="row">
                            {userTags && userTags.map((tag, index) => (
                                <StateToggleButton 
                                    key={index}
                                    name={tag}  
                                    variant="contained"
                                />
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container xs={12} lg={12} >
                    <Grid item>
                        {selectedAccount && 
                            <div id="chart-section">
                                <Button variant="text" color="primary" to={`/account/${selectedAccount.account._id}`}>
                                    <Typography variant="h3" color="primary" style={{textTransform: 'capitalize'}}>{selectedAccount.accountName}</Typography>
                                </Button>
                                <Grid container alignItems="center">
                                    <Grid item xs={12}>
                                        <IconButton>
                                            <Typography variant="h5">Current Valuation: {selectedAccount.account.currency.symbol}{selectedAccount.userCurrValuation.toFixed(4)} {selectedAccount.account.currency.code}</Typography>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <LineChart accumulatedData={selectedAccount.accumulatedData}/>
                            </div>
                        }
                    </Grid>
                </Grid>
                <Grid container xs={12} textAlign="center" justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" color="primary">Transactions</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton color="secondary" href="/createTransaction">
                            <AddIcon/>
                        </IconButton>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 400 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left">
                                    <Typography variant="h6" color="primary">Date</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" color="primary">Amount</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" color="primary">To</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" color="primary">From</Typography>
                                </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {selectedAccount && selectedAccount.credits.map((transaction) => (
                                <TableRow
                                key={transaction._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        <Typography variant="p" color="primary">{convertStringToDateString(transaction.date)}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="p" color="primary">{transaction.amount}</Typography>
                                    </TableCell>
                                    {transaction?.toAccount && 
                                        <TableCell align="right">
                                            <Typography variant="p" color="primary">{transaction.toAccount.name}</Typography>
                                        </TableCell>
                                    }
                                    {transaction?.fromAccount && 
                                        <TableCell align="right">
                                            <Typography variant="p" color="primary">{transaction.fromAccount.name}</Typography>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))}
                            {selectedAccount && <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right">{selectedAccount.creditTotal.toFixed(4)}</TableCell>
                            </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Container>
        </div>
    )
}
