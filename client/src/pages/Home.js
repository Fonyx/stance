import React, {useState} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button, ButtonGroup} from '@mui/material'
import {QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS} from '../utils/queries'
import { Link } from 'react-router-dom';
// import BarChart from '../components/BarChart';
import ToggleButton from '../components/toggleButton';
import LineChart from '../components/LineChart';
import accumulateTransactions from '../helpers/accumulator';


function filterInactiveAccounts(inactiveAccounts, payload){
    let filteredPayload = payload.filter((element) => (!inactiveAccounts.includes(element.account.name)))
    return filteredPayload
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

export default function Home() {

    const [inactiveAccounts, setInactiveAccounts] = useState([]);

    const {loading, data} = useQuery(QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS, {});



    if(data?.allUserAccountsAndTransactions){
        var userAccounts = data.allUserAccountsAndTransactions.map((payload) => {
            return payload.account.name
        });
        var filteredPayload = filterInactiveAccounts(inactiveAccounts, data.allUserAccountsAndTransactions)
        var debits = getDebitsFromPayload(filteredPayload);
        var credits = getCreditsFromPayload(filteredPayload);
        var valuation = getAccumulatedValuation(filteredPayload);

        var accumulatedData = accumulateTransactions(valuation, credits, debits);
        
    } else {
        console.log('No Data');
        var userAccounts = []
        var credits = []
        var debits = []
        var valuation = 0
    }


    console.log('InactiveAccount state: ', inactiveAccounts);

    if(loading){
        return <div>Loading Your Account Details....They are very detailed</div>
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
            <LineChart accumulatedData={accumulatedData}/>
            
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
