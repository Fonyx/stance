import React, {useState} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button} from '@mui/material'
import {QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS} from '../utils/queries'
import { Link } from 'react-router-dom';
// import BarChart from '../components/BarChart';
import ToggleButton from '../components/toggleButton';
import LineChart from '../components/LineChart';
import accumulateTransactions from '../helpers/accumulator';

/**
 * Function that filters out an account package from the accountData mega object, return shape: {valuation, accountObj, credits, debits}
 * @param {*} stateAccount 
 * @param {*} accountData 
 * @returns 
 */
function getFilteredDataFromState(accountName, accountData){
    console.log('Filtering out: ', accountName, 'from', accountData)
    let accountPackage = accountData.find(element => element.account.name === accountName);
    console.log('account package after filtering: ', accountPackage)
    return accountPackage
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

    const [selectedAccount, setSelectedAccount] = useState('');

    const {loading, data} = useQuery(QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS, {});


    if(data?.allUserAccountsAndTransactions){
        var accountData = data.allUserAccountsAndTransactions;

    } else {
        var accountData = null
    }

    console.log('Selected Account: ', selectedAccount);

    if(loading){
        return <div>Loading Your Account Details....They are very detailed</div>
    }

    /**
     * Updates selectedAccount and filters accumulated data for line chart
     * @param {eventObject} e 
     */
    const handleSelect = (e) => {
        e.preventDefault();

        // refresh the accountData after the filtering
        accountData = data.allUserAccountsAndTransactions;

        console.log(e);

        let pressedAccount = e.target.id;

        console.log('User clicked on: ',pressedAccount);

        var {userCurrValuation, account, credits, debits} = getFilteredDataFromState(pressedAccount, accountData);

        var accumulatedData = accumulateTransactions(account.balance, credits, debits);

        let statePackage = {
            accountName: pressedAccount,
            userCurrValuation,
            accumulatedData
        }

        setSelectedAccount(statePackage);

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
                            color={element.account.name === selectedAccount.accountName? 'primary': 'secondary'}
                            handleSelect={handleSelect} 
                            variant="contained"
                        >
                        </ToggleButton>
                    </div>
                ))}
                {selectedAccount && 
                    <div id="chart-section">
                        <div>{selectedAccount.userCurrValuation}</div>
                        <div>
                            <LineChart accumulatedData={selectedAccount.accumulatedData}/>
                        </div>
                    </div>
                }
        </React.Fragment>
    )
}
