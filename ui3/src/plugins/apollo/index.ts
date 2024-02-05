
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client/core'
// import { provideApolloClient } from '@vue/apollo-composable'
import { createApolloProvider } from '@vue/apollo-option'
// import store from '../../store'
import { persistCacheSync, LocalStorageWrapper } from 'apollo3-cache-persist';

// import { gql } from '@apollo/client/core'
// import { resolvers } from './resolvers'
// import { typeDefs } from './type-defs'

// Create the apollo client
// https://v4.apollo.vuejs.org/guide-advanced/ssr.html#create-apollo-client
function createApolloClient (ssr = false) {

  const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: 'https://gql.metaspan.io/graphql', // TODO param this!
    // uri: process.env.API_BASEURL
    //   ? `${process.env.API_BASEURL}/graphql`
    //   : 'http://localhost:4000/graphql',
    // credentials: 'include', // this should send the Bearer token...? but breaks CORS?
  })

  const cache = new InMemoryCache({
    typePolicies: {
      Candidate: {
        keyFields: ['chain', 'stash']
      },
      CandidateScore: {
        keyFields: ['address']
      }
    }
  })

  if (ssr) {
    // we are on the server
    console.log('server: hello from ssr...!')
  } else {
    // If on the client, recover & injected state from browser

    // console.log('client: hello from ssr...!')
    persistCacheSync({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
    })
  }

  // // add the authorization to the headers
  // const authMiddleware = new ApolloLink((operation, forward) => {
  //   const token = store.state.token;
  //   operation.setContext({
  //     headers: {
  //       authorization: token ? `Bearer ${token}` : "",
  //     },
  //   });
  //   // console.debug('authMiddleware', token)
  //   return forward(operation);
  // });

  const apolloClient = new ApolloClient({
    link: httpLink,
    // resolvers,
    // typeDefs,
    cache,
    connectToDevTools: true,
  })

  return apolloClient  
}

// Create a provider
export const apolloProvider = createApolloProvider({
  defaultClient: createApolloClient(typeof window === 'undefined'),
})
