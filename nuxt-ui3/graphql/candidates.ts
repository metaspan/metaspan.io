import gql from 'graphql-tag'

export const QUERY_CANDIDATE = gql`
query Data($chain: String!, $stash: String) {
  Candidate(chain: $chain, stash: $stash) {
    stash
    active
    commission
    # councilStake
    # councilVotes
    # democracyVotes
    location
    region
    country
    faults
    name
    rank
    nominated_1kv
    provider
    valid
    version
    rewardDestination
    total
    identity {
      info {
        display
        email
        legal
        riot
        twitter
        web
      }
      judgements
      subId
      parentIdentity {
        chain
        accountId
        deposit
        subId
        info {
          display
          email
          legal
          riot
          twitter
          web
        }
        judgements
      }
    }
    score {
      address
      aggregate
      bonded
      councilStake
      country
      delegations
      democracy
      discovered
      faults
      inclusion
      location
      nominated
      nominatorStake
      offline
      openGov
      openGovDelegations
      provider
      randomness
      rank
      region
      session
      spanInclusion
      total
      unclaimed
      updated
    }
    validity {
      valid
      type
      details
      updated
    }
  }
}`

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
