import { gql } from '@apollo/client';

export const QUERY_USER_ACCOUNTS = gql`
    query {
        userAccounts{
            _id
            name
            type
            balance
            unitPrice
            currency{
                name
                usdValue
            }
        }
    }
`;

export const QUERY_ACCOUNT_TRANSACTIONS = gql`
    query userAccountTransactions(
        $accountId: String!
    ){
        userAccountTransactions(
        accountId: $accountId
        ){
            description
            amount
            date
        }
    }
`;