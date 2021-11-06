import React, {useState, useEffect} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button, ButtonGroup} from '@mui/material'
import {QUERY_USER_ACCOUNTS} from '../utils/queries'
import { Link } from 'react-router-dom';
import BarChart from '../components/BarChart';
import ToggleButton from '../components/toggleButton';



export default function Home() {

    const [activeAccounts, setActiveAccounts] = useState([]);

    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});

    const userAccounts = data?.userAccounts || {};

    if(loading){
        return <div>Loading Your Accounts....</div>
    }


    const handleSelect = (e) => {
        e.preventDefault();
        console.log(e.target.value);
    }

    
    return (
        <React.Fragment>
            <BarChart accounts={userAccounts}/>
            
            <ButtonGroup>
                {userAccounts && userAccounts.map((userAccount) => (
                    <div key={userAccount._id}>
                        <ToggleButton 
                            name={userAccount.name} 
                            onClick={handleSelect} 
                            color="secondary" 
                            variant="contained"
                        >
                            {userAccount.name}
                        </ToggleButton>
                    </div>
                ))}
            </ButtonGroup>
            
                {userAccounts && userAccounts.map((userAccount) => (
                    <div key={userAccount._id}>
                        <Button LinkComponent={Link} name={userAccount.name} onClick={handleSelect} color="secondary" variant="contained" to={`/account/${userAccount._id}`}>{userAccount.name}</Button>
                    </div>
                ))}
        </React.Fragment>
    )
}
