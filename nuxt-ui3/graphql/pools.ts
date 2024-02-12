import gql from 'graphql-tag'

export const GET_POOL_VIEW = gql`
  query getPoolView ($chain: String!, $poolId: Int!) {
    Pool (chain: $chain, id: $poolId) {
      id
      state
      points
      claimable
      name
      members {
        accountId
        points
      }
    }
  }
`

export const GET_POOL_MEMBERS = gql`
  #query getPoolMembers ($chain: String!, $id: Int!, $ids: [String]) {
  query getPoolMembers ($chain: String!, $id: Int!) {
    Pool (chain: $chain, id: $id) {
      id
      state
      points
      claimable
      name
      members {
        accountId
        points
      }
    }
    #Nominators(chain: $chain, ids: $ids) {
    #  accountId
    #    sub_id
    #  identity {
    #    parent_identity {
    #      info {
    #        display
    #        email
    #        twitter
    #        web
    #      }
    #    }
    #    info {
    #      display
    #      email
    #      twitter
    #      web
    #    }
    #  }
    #  targets
    #}
  }
`

export const GET_POOLS = gql`
  query getPools ($chain: String!, $ids: [Int]) {
    Pools(chain: $chain, ids: $ids) {
      members {
        points
        accountId
      }
      id
      name
      state
      points
      claimable
    }
  }
`

export const GET_POOL = gql`
  query getPool ($chain: String!, $id: Int) {
    Pool(chain: $chain, id: $id) {
      members {
        points
        accountId
      }
      id
      name
      state
      points
      claimable
    }
  }
`

// export const GET_NOMINATOR = gql`
//   query getNominator ($chain: String!, $accountId: String!) {
//     Nominator (chain: $chain, accountId: $accountId) {
//       accountId
//       controllerId
//       targets
//     }
//   }
// `

// export const GET_NOMINATORS = gql`
//   query getNominators ($chain: String!, $ids: [String], $offset: Int, $limit: Int) {
//     Nominators (chain: $chain, ids: $ids, offset: $offset, limit: $limit) {
//       # Fields to retrieve
//       accountId
//       identity {
//         info {
//           display
//         }
//       }
//       targets
//     }
//   }
// `
