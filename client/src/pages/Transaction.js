import React from 'react'
import { useParams } from 'react-router-dom';
import {useQuery} from '@apollo/client'
import {QUERY_GET_TRANSACTION_SERIES} from '../utils/queries';
import {Grid, Typography} from '@mui/material'

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
        console.log('Series: ',series);
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
            <h1>Your transaction {params.id}</h1>
        </div>
    )
}