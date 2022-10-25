import gql from 'graphql-tag'

export const GET_NOMINATOR_VIEW = gql`
  query getNominator ($chain: String!, $accountId: String!, $stashes: [String]) {
    Nominator (chain: $chain, accountId: $accountId) {
      accountId
      controllerId
      # targets
    }
    Validators (chain: $chain, stashes: $stashes) {
      stash
      name
      shortStash
      nominators {
        accountId
      }
    }
  }
`

export const GET_NOMINATOR = gql`
  query getNominator ($chain: String!, $accountId: String!) {
    Nominator (chain: $chain, accountId: $accountId) {
      accountId
      controllerId
      targets {
        stash
      }
    }
  }
`

export const GET_NOMINATORS = gql`
  query getNominators ($chain: String!, $ids: [String], $offset: Int, $limit: Int) {
    Nominators (chain: $chain, ids: $ids, offset: $offset, limit: $limit) {
      # Fields to retrieve
      accountId
      identity {
        info {
          display
        }
      }
      targets {
        stash
      }
    }
  }
`
// export const GET_NOMINATOR_NAMES = gql`
//   query getNominatorNames ($chain: String!, $stashes: [String]) {
//     Nominators (chain: $chain, stashes: $stashes) {
//       # Fields to retrieve
//       stash
//       shortStash
//       name
//     }
//   }
// `
