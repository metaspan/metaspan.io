import gql from 'graphql-tag'

// search for ids
export const GET_IDENTITIES = gql`
  query getIdentities ($chain: String!, $ids: [String], $search: String, $offset: Int, $limit: Int) {
    Identities (chain: $chain, ids: $ids, search: $search, offset: $offset, limit: $limit) {
      accountId
      chain
      identity {
        deposit
        info {
          display
          email
          legal
          riot
          twitter
          web
        }
        judgements { any }
        parent
        sub
        children
      }
    }
  }
`
// export const GET_CANDIDATE_NAMES = gql`
//   query getCandidateNames ($chain: String!, $stashes: [String]) {
//     Identities (chain: $chain, stashes: $stashes) {
//       # Fields to retrieve
//       stash
//       shortStash
//       name
//     }
//   }
// `

// export const GET_CANDIDATE_VIEW = gql`
//   query getCandidate ($chain: String!, $accountId: String!, $stashes: [String]) {
//     Candidate (chain: $chain, accountId: $accountId) {
//       accountId
//       controllerId
//       # targets
//     }
//     Validators (chain: $chain, stashes: $stashes) {
//       stash
//       name
//       shortStash
//       nominators {
//         accountId
//       }
//     }
//   }
// `

// export const GET_CANDIDATE = gql`
//   query getCandidate ($chain: String!, $accountId: String!) {
//     Candidate (chain: $chain, accountId: $accountId) {
//       accountId
//       controllerId
//       targets {
//         stash
//       }
//     }
//   }
// `
