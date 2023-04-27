import gql from 'graphql-tag'

export const GET_CANDIDATE_VIEW = gql`
  query getCandidate ($chain: String!, $accountId: String!, $stashes: [String]) {
    Candidate (chain: $chain, accountId: $accountId) {
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

export const GET_CANDIDATE = gql`
  query getCandidate ($chain: String!, $accountId: String!) {
    Candidate (chain: $chain, accountId: $accountId) {
      accountId
      controllerId
      targets {
        stash
      }
    }
  }
`

export const GET_CANDIDATES = gql`
  query getCandidates ($chain: String!, $stashes: [String], $offset: Int, $limit: Int) {
    Candidates (chain: $chain, stashes: $stashes, offset: $offset, limit: $limit) {
      # Fields to retrieve
      chain
      stash
      name
      identity {
        info {
          display
        }
      }
      valid
      active
      rank
      score
    }
  }
`
// export const GET_CANDIDATE_NAMES = gql`
//   query getCandidateNames ($chain: String!, $stashes: [String]) {
//     Candidates (chain: $chain, stashes: $stashes) {
//       # Fields to retrieve
//       stash
//       shortStash
//       name
//     }
//   }
// `
