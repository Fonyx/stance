import React from 'react'
import { useParams } from 'react-router-dom';
import {useQuery} from '@apollo/client'
import {QUERY_GET_TRANSACTION_SERIES} from '../utils/queries';
import {Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody} from '@mui/material';
import {convertStringToDateString} from '../helpers/formatter'

export default function Transaction() {

    
    let params = useParams();

    console.log(params.id);

    const {loading, data} = useQuery(QUERY_GET_TRANSACTION_SERIES, {
        variables: {
            'transactionId': params.id
        }
    });

    // really dirty filter for last 2 years of asset history
    if(data){
        var series = data.getTransactionSeries;
        var transaction = series[0];
        console.log('Series: ',series);
        var total = series.reduce((prev, curr) => {
            return prev + curr.amount
        }, 0)
    }


    if(loading){
        return (
            <Grid container>
                <Grid item>
                    <Typography variant='h3' color='primary'>Loading Asset history, lots of 1's and 0's in here!</Typography>
                </Grid>
            </Grid>
        )
    }

    return (
        <div>
            <Grid container justifyContent="center">
                <Grid item xs={12} textAlign="center">
                    <Typography variant="h3" color="primary" style={{textTransform: 'Capitalize'}}>{transaction.description}</Typography>
                </Grid>
                <Grid item xs={12}>
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
                            {series.map((transaction) => (
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
                                    <TableCell align="right">
                                        <Typography variant="p" color="primary">{transaction.toAccount.name}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="p" color="primary">{transaction.fromAccount.name}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right">{total.toFixed(4)}</TableCell>
                                <TableCell align="right">Currently: {transaction.toAccount.currency.symbol}{transaction.toAccount.valuation} {transaction.toAccount.currency.code}</TableCell>
                                <TableCell align="right">Currently: {transaction.fromAccount.currency.symbol}{transaction.fromAccount.valuation} {transaction.fromAccount.currency.code}</TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            

        </div>
    )
}