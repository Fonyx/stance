import React, {useState} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button} from '@mui/material'
import {QUERY_USER_ACCOUNTS} from '../utils/queries'
import { Link } from 'react-router-dom';
import BarChart from '../components/BarChart';



export default function Home() {

    const [testData, setBooks] = useState([ 2, 4, 2, 6, 8 ])

    const addBook = () => {
        let newData = Math.ceil(Math.random()*10)
        console.log('Adding Book');

        setBooks([...testData, newData]);
    }

    console.log('Test data is: ', testData)


    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});

    const userAccounts = data?.userAccounts || {};

    if(loading){
        return <div>Loading...</div>
    }
    
    return (
        <React.Fragment>
            <BarChart testData={testData} addBook={addBook}/>
            <div className="account-rows">
                {userAccounts && userAccounts.map((userAccount) => (
                    <div key={userAccount._id}>
                        <Button LinkComponent={Link} color="secondary" variant="contained" to={`/account/${userAccount._id}`}>{userAccount.name} {userAccount.balance}</Button>
                    </div>
                ))}
            </div> 
        </React.Fragment>
    )
}
