
import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

const httpLink = new HttpLink({
  // // uri: process.env.VUE_APP_GRAPHQL_ENDPOINT || 'http://192.168.1.82:4000/graphql'
  // uri: 'http://192.168.1.82:4000'
  // uri: 'http://192.168.1.91:4000'
  // // uri: 'http://localhost:4000'
  uri: 'https://gql.metaspan.io/graphql'
})
console.log(httpLink)

// Error Handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  }
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

// Install the Vue plugin

Vue.use(VueApollo)

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})
