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
    mutation signUp($username: String!, $email: String!, $password: String!, $currencyCode: String!
    ){
        signUp(username: $username,email: $email,password: $password, currencyCode: $currencyCode
        ){
            token
            user{
                _id
                username
                currency{
                    code
                    name
                }
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

export const CREATE_ACCOUNT_FE = gql`
mutation createAccountFE(
    $name: String!
    $type: String!
    $openingBalance: Float!
    $interestRate: Float
    $compounds: String
    $party: String
    $currency: String
    $exchangeCode: String
    $assetCode: String
    $assetName: String
    $tags: String
    $goalAmount: Float
    $goalDate: String
  ){
    createAccountFE(
      input: {
        name: $name
        type: $type
        openingBalance: $openingBalance
        interestRate: $interestRate
        compounds: $compounds
        party: $party
        currency: $currency
        exchangeCode: $exchangeCode
        assetCode: $assetCode
        assetName: $assetName
        tags: $tags
        goalAmount: $goalAmount
        goalDate: $goalDate
      }
    ){
      user{
        username
      }
      name
      openingBalance
      balance
      type
      compounds
      party{
        name
      }
      currency{
        code
      }
      exchange{
        name
      }
    }
  }
`;