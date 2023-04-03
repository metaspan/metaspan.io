import gql from 'graphql-tag'

export const GET_CHAIN_PROPERTIES = gql`
  query Query ($chain: String!) {
    ChainProperties(chain: $chain) {
      chain
      ss58Format
      tokenDecimals
      tokenSymbol
    }
  }
`
