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