import React, {useState, useEffect} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button, ButtonGroup} from '@mui/material'
import {QUERY_USER_ACCOUNTS} from '../utils/queries'
import { Link } from 'react-router-dom';
import BarChart from '../components/BarChart';
import ToggleButton from '../components/toggleButton';



export default function Home() {

    const [inactiveAccounts, setInactiveAccounts] = useState([]);

    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});

    const userAccounts = data?.userAccounts || {};

    console.log('InactiveAccount state: ', inactiveAccounts);

    if(loading){
        return <div>Loading Your Accounts....</div>
    }


    const handleSelect = (e, pressedState) => {
        e.preventDefault();

        let pressedAccount = e.target.textContent;

        console.log(pressedAccount);
        console.log(pressedState);

        // if the UI has this account as active, add it to the activeAccounts state
        if(pressedState){
            setInactiveAccounts([
                ...inactiveAccounts,
                pressedAccount
            ])
        // if the UI has it listed as inactive, remove it from the activeAccounts
        }else if(!pressedState){

            let otherAccounts = inactiveAccounts.filter((account) => {
                return account !== pressedAccount
            })

            setInactiveAccounts([
                ...otherAccounts
            ])
        }
    }
    
    return (
        <React.Fragment>
            <BarChart accounts={userAccounts}/>
            
            <ButtonGroup>
                {userAccounts && userAccounts.map((userAccount) => (
                    <div key={userAccount._id}>
                        <ToggleButton 
                            name={userAccount.name} 
                            handleSelect={handleSelect} 
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
