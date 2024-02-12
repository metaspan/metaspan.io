import type { NuxtConfig } from '@nuxt/types'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    '@/plugins/vuetify',
  ],
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/plausible',
    // '@nuxt/typescript-build',
    '@nuxtjs/apollo',
  ],
  plausible: {
    domain: 'metaspan.io',
    hashMode: true,
    trackLocalhost: true,
    apiHost: 'https://click.metaspan.io',
  },
  apollo: {
    autoImports: true,
    authType: 'Bearer',
    authHeader: 'Authorization',
    tokenStorage: 'cookie',
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: 'https://gql.metaspan.io/graphql',
        connectToDevTools: true,
        inMemoryCacheOptions: {
          typePolicies: {
            Candidate: {
              keyFields: ['chain', 'stash']
            },
            CandidateScore: {
              keyFields: ['address']
            },
            Pool: {
              keyFields: ['chain', 'id']
            }
          }
        },
      },
    },
  },
  build: {
    transpile: [
      'vuetify',
      // 'vuex-module-decorators',
    ],
  },
  nitro: {
    esbuild: {
      options: {
        // https://github.com/nuxt/nuxt/issues/14348 # support bigint
        target: 'esnext',    
      }
    },
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/robots.txt']
    }
  },
  devServer: {
    port: 8080,
  },
  devtools: { enabled: true },
  // buildModules: ['@nuxt/typescript-build'],
  // app: {
  //   pageTransition: { name: 'page', mode: 'out-in' }
  // },
})
