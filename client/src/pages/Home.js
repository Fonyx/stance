import React from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button} from '@mui/material'
import {QUERY_USER_ACCOUNTS} from '../utils/queries'
import { Link } from 'react-router-dom';



export default function Home() {

    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});

    const userAccounts = data?.userAccounts || {};

    if(loading){
        return <div>Loading...</div>
    }

    return (
        <div className="account-rows">
            {userAccounts && userAccounts.map((userAccount) => (
                <div key={userAccount._id}>
                    <Button LinkComponent={Link} color="secondary" variant="contained" to={`/account/${userAccount._id}`}>{userAccount.name} {userAccount.balance}</Button>
                </div>
            ))}
        </div>
    )
}
