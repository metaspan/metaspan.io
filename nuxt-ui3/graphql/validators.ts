import gql from 'graphql-tag'

export const GET_VALIDATOR_VIEW = gql`
  query getValidatorView ($chain: String!, $stash: String) {
    Validator (chain: $chain, stash: $stash) {
      stash
      name
      shortStash
      nominators {
        accountId
        account {
          data {
            free
            reserved
            miscFrozen
            feeFrozen
          }
          #nonce
          #consumers
          #providers
          #sufficients
        }
        is1kv {
          bonded
          avgStake
        }
        targetIds
      }
    }
  }
`

export const GET_VALIDATOR = gql`
  query getValidator ($chain: String!, $stash: String!) {
    Validator (chain: $chain, stash: $stash) {
      # Fields to retrieve
      stash
      shortStash
      name
      identity {
        info {
          display
        }
        sub_id
        parent_identity {
          info {
            display
            email
            legal
            twitter
            riot
            web
          }
        }
      }
      nominators {
        accountId
      }
      updatedAt
    }
  }
`

export const GET_VALIDATOR_NOMINATORS = gql`
  query ValidatorNominators($chain: String!, $stash: String) {
    Candidate(chain: $chain, stash: $stash) {
      stash
      chain
      nominators {
        accountId
        is1kv {
          address
        }
        identity {
          info {
            display
          }
        }
        account {
          data {
            free
            reserved
            miscFrozen
            feeFrozen
          }
        }
      }
    }
  }
`

export const GET_VALIDATORS = gql`
  query getValidators ($chain: String!, $stashes: [String], $search: String, $offset: Int, $limit: Int) {
    ValidatorCount(chain: $chain, search: $search)
    Validators (chain: $chain, stashes: $stashes, search: $search, offset: $offset, limit: $limit) {
      # Fields to retrieve
      stash
      shortStash
      name
      prefs {
        commission
      }
      nominators {
        accountId
      }
      is1kv {
        name
        active
      }
    }
  }
`
export const GET_VALIDATOR_NAMES = gql`
  query getValidatorNames ($chain: String!, $stashes: [String]) {
    Validators (chain: $chain, stashes: $stashes) {
      # Fields to retrieve
      stash
      shortStash
      name
    }
  }
`
