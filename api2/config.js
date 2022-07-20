
const config = {
  cache: 'cache.json',
  // dateTimeFormat: 'YYYY.MM.DD HH:mm:ss',
  dateTimeFormat: 'YYYYMMDD-HHmmss',

  updater: {
    interval: 30 * 60 * 1000, // mins * secs * millis
    // url: 'https://api.metaspan.io/api/kusama/candidate',
    chains: {
      kusama: {
        candidates_url: 'https://kusama.w3f.community/candidates',
        nominators_url: 'https://kusama.w3f.community/nominators'
      },
      polkadot: {
        candidates_url: 'https://polkadot.w3f.community/candidates',
        nominators_url: 'https://polkadot.w3f.community/nominators'
      }
    }
  },

  server: {
    port: 1337,
  }
}

export default config
