import React, {useState} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button, ButtonGroup} from '@mui/material'
import {QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS} from '../utils/queries'
import { Link } from 'react-router-dom';
// import BarChart from '../components/BarChart';
import ToggleButton from '../components/toggleButton';


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

    const [selectedAccount, setSelectedAccount] = useState('');

    const {loading, data} = useQuery(QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS, {});


    if(data?.allUserAccountsAndTransactions){
        var accountData = data.allUserAccountsAndTransactions;
        var userAccounts = accountData.map((payload) => {
            return payload.account.name
        });
        var debits = getDebitsFromPayload(accountData);
        var credits = getCreditsFromPayload(accountData);
        var valuation = getAccumulatedValuation(accountData);
        console.log(userAccounts);
    } else {
        var userAccounts = []
        var credits = []
        var debits = []
        var valuation = 0
    }


    console.log('Selected Account: ', selectedAccount);

    if(loading){
        return <div>Loading Your Account Details....They are very detailed</div>
    }


    const handleSelect = (e) => {
        e.preventDefault();

        let pressedAccount = e.target.textContent;

        console.log(pressedAccount);

        setSelectedAccount(pressedAccount);

        console.log(selectedAccount);
    }
    
    return (
        <React.Fragment>

            <h1>Your Positions</h1>
            

                {accountData && accountData.map((element) => (
                    <div key={element.account._id}>
                        <Button 
                            LinkComponent={Link}
                            color="primary" 
                            variant="outlined" 
                            to={`/account/${element.account._id}`}
                        >
                            update
                        </Button>
                        <ToggleButton 
                            name={element.account.name} 
                            color={element.account.name === selectedAccount?'primary': 'secondary'}
                            handleSelect={handleSelect} 
                            variant="contained"
                        >
                        </ToggleButton>
                    </div>
                ))}
            
                <div>
                    
                </div>
        </React.Fragment>
    )
}
