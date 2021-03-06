import { gql } from '@apollo/client';

export const QUERY_USER_ACCOUNTS = gql`
    query {
        userAccounts{
            _id
            name
            type
            balance
            unitPrice
            valuation
            currency{
                name
                usdValue
                symbol
                code
            }
        }
    }
`;

export const QUERY_GET_ASSET_DETAILS = gql`
query assetEODDetails(
    $accountId: String!
  ){
    assetEODDetails(
      accountId: $accountId
    ){
        account{
            name
            assetCode
            assetName
            currency{
                code
                name
                symbol
            }
        }
        history {
            date
            open
            high
            low
            close
            adjusted_close
            volume
        }
        current {
            code
            timestamp
            gmtoffset
            open
            high
            low
            close
            volume
            previousClose
            change
            change_p
        }
    }
  }
`

export const QUERY_ACCOUNT_AND_TRANSACTIONS = gql`
    query userAccountTransactions(
        $accountId: String!
    ){
        userAccountAndTransactions(
            accountId: $accountId
          ){
            userCurrValuation
            account{
              _id
              name
              balance
              openingBalance
              unitPrice
              valuation
              assetName
              currency{
                  name
                  symbol
                  code
              }
              tags{
                name
              }
            }
            credits{
              date
              amount
              description
            }
            debits{
              date
              amount
              description
            }
          }
    }
`;

export const QUERY_ALL_ACCOUNTS_AND_TRANSACTIONS = gql`
    query{
        allUserAccountsAndTransactions{
        userCurrValuation
        account{
            _id
            name
            balance
            openingBalance
            valuation
            unitPrice
            assetName
            assetCode
            currency{
                name
                symbol
                code
            }
            tags{
                name
            }
            
        }
        credits{
            _id
            date
            amount
            description
            toAccount{
                name
            }
            fromAccount{
            name
            }
        }
        debits{
            _id
            date
            amount
            description
            toAccount{
                name
            }
            fromAccount{
            name
            }
        }
        }
    }
`;

export const QUERY_GET_ALL_PARTIES = gql`
    query{
        allParties{
            _id
            name
            type
            user{
                username
            }
            description
            website
            logo
            style {
                color
                shade
            }
        }
    }
`;

export const QUERY_GET_ALL_CURRENCIES = gql`
    query{
        allCurrencies{
            _id
            code
            name
            symbol
            usdValue
        }
    }
`;

export const QUERY_GET_ALL_EXCHANGES = gql`
    query{
        allExchanges{
            _id
            code
            name
        }
    }
`;

export const QUERY_GET_ALL_PRIMITIVES = gql`
query{
    getAllPrimitives{
        currencies{
          _id
          name
          code
        }
        exchanges{
          _id
          name
          code
        }
        parties {
          _id
          name
        }
        cryptos{
            Code
            Name
        }
    }
}
`;

export const QUERY_STOCK_CHECK = gql`
    query checkStockCode(
        $assetCode: String!
        $exchangeCode: String!
    ){
        checkStockCode(
        assetCode: $assetCode
        exchangeCode: $exchangeCode
        ){
            exists
            unitPrice
            name
        }
    }
`;

export const QUERY_GET_TRANSACTION_SERIES = gql`
query getTransactionSeries(
    $transactionId: String!
  ){
    getTransactionSeries(
      transactionId: $transactionId
    ){
      fromAccount{
        name
        valuation
        balance
        currency{
            code
            name
        }
      }
      toAccount{
        name
        valuation
        balance
        currency{
            code
            name
        }
      }
      description
      amount
      date
      frequency
    }
  }
`