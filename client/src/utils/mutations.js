import { gql } from '@apollo/client';

export const SIGN_IN = gql`
    mutation signIn($email: String!, $password: String!){
        signIn(email: $email, password: $password){
            token
            user{
                _id
                username
            }
        }
    }
`;

export const SIGN_UP = gql`
    mutation signUp($username: String!, $email: String!, $password: String!
    ){
        signUp(username: $username,email: $email,password: $password
        ){
            token
            user{
                _id
                username
            }
        }
    }
`;

export const CREATE_TRANSACTION = gql`
    mutation createTransaction(
        $toAccount: String!,
        $fromAccount: String!,
        $description: String!,
        $date: String!,
        $amount: Float,
        $frequency: String!,
        $endRecurrence: String
    ){
        createTransaction(
        input: {
            toAccount: $toAccount,
            fromAccount: $fromAccount,
            description: $description,
            date: $date,
            amount: $amount,
            frequency: $frequency,
            endRecurrence: $endRecurrence
        }
        ) {
        fromAccount{
            name
        }
        toAccount{
            name
        }
        }
    }
`;