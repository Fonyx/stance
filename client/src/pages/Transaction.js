import React from 'react'
import { useParams } from 'react-router-dom';
import {useQuery} from '@apollo/client'
// import {QUERY_GET_ASSET} from '../utils/queries';

export default function Transaction() {

    
    let params = useParams();

    console.log(params.id);

    return (
        <div>
            <h1>Your transaction {params.id}</h1>
        </div>
    )
}