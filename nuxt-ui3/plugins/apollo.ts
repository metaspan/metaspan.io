import { provideApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('apollo:error', (error) => {
    console.error(error)
    // Handle different error cases
  })
  const apollo = useApollo()
  if (apollo && apollo.clients && apollo.clients.default) {
    provideApolloClient(apollo.clients.default)
  }
})
