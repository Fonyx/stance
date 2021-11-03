import React, {useState} from 'react'
// import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {Button} from '@mui/material'
import {QUERY_USER_ACCOUNTS} from '../utils/queries'
import { Link } from 'react-router-dom';
import BarChart from '../components/BarChart';



export default function Home() {

    const initialBooks = [
        {
            name: "Harry Potter and the Philosophers Stone",
            author: "J. K. Rowling",
            genre: "fantasy"
        },{
            name: "The Pedagogy of Freedom",
            author: "Bell hooks",
            genre: "non-fiction"
        },{
            name: "Harry Potter and the Chamber of Secrets",
            author: "J. K. Rowling",
            genre: "fantasy"
        },{
            name: "Gilgamesh",
            author: "Derrek Hines",
            genre: "poetry"
        }
    ]
    const [books, setBooks] = useState(initialBooks)

    const addBook = () => {
        let newBook = {
            name: "The moon is a harsh mistress",
            author: "Robert heinlein",
            genre: "sci-fi"
        }
        console.log('Adding Book');

        setBooks([...books, newBook]);
    }

    console.log('Books are: ', books)


    const {loading, data} = useQuery(QUERY_USER_ACCOUNTS, {});

    const userAccounts = data?.userAccounts || {};

    if(loading){
        return <div>Loading...</div>
    }
    
    return (
        <React.Fragment>
            <BarChart books={books} addBook={addBook}/>
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
