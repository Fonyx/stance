import React from 'react'
import { useParams } from 'react-router-dom';
import {useQuery} from '@apollo/client'
import {QUERY_GET_ASSET_DETAILS} from '../utils/queries';
import AssetChart from '../components/AssetChart';

export default function Asset() {


    let params = useParams();

    console.log(params.id);

    const {loading, data} = useQuery(QUERY_GET_ASSET_DETAILS, {
        variables: {
            'accountId': params.id
        }
    });

    if(loading){
        return <div>Loading...</div>
    }

    // console.log(data.assetEODDetails);

    return (
        <AssetChart data={data.assetEODDetails.history}/>
    )
}