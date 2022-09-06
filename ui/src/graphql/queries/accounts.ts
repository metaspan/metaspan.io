import gql from 'graphql-tag'

export const GET_ACCOUNT_CARD = gql`
  query getAccount ($chain: String!, $accountId: String!) {
    Account (chain: $chain, accountId: $accountId) {
      accountId
      #controllerId
      # targets
      data {
        free
        reserved
        miscFrozen
        feeFrozen
      }
      identity {
        deposit
        info {
          display
        }
        sub_id
        parent_identity {
          deposit
          info {
            display
          }
        }
      }
    }
  }
`
