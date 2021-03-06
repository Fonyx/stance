import React from 'react'
import { useParams } from 'react-router-dom';
import {useQuery} from '@apollo/client'
import {QUERY_GET_ASSET_DETAILS} from '../utils/queries';
import {Grid, Container, Typography} from '@mui/material'
import AssetChart from '../components/AssetChart';

export default function Asset() {


    let params = useParams();

    console.log(params.id);

    const {loading, error, data} = useQuery(QUERY_GET_ASSET_DETAILS, {
        variables: {
            'accountId': params.id
        }
    });

    if(loading){
        return (
            <Container>
                <Grid container paddingTop="40px">
                    <Grid item>
                        <Typography variant='h3' color='primary'>Loading Asset history, lots of 1's and 0's in here!</Typography>
                    </Grid>
                </Grid>
            </Container>
        )
    }

    if (error) {
        // since the apollo client returns a weird error derivative we need custom logging
        console.log(JSON.stringify(error, null, 2));
        // console.log(accountReturn.error.networkError.result.errors)
    };
    
    console.log(data.assetEODDetails);

    // really dirty filter for last 2 years of asset history
    if(data){
        var {account, current, history} = data.assetEODDetails;
        var lastTwoYears =history.filter((element) => {
            return(element.date > '2018-1-1');
        });
    }

    console.log('last two years: ',lastTwoYears);
    console.log('account: ',account);
    console.log('current market details: ',current);


    return (
        <Container>
            <Grid container paddingTop="40px">
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" color="primary">{account.assetCode}</Typography>
                    <Typography variant="h5" color="primary">{account.currency.symbol}{current.open? current.open : current.previousClose} {account.currency.code}</Typography>
                    <Typography variant="h5" color="primary">{current.change_p}% In the 30 minutes</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    {data && 
                        <AssetChart data={lastTwoYears}/>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}