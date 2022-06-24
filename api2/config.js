
const config = {
  cache: 'cache.json',
  // dateTimeFormat: 'YYYY.MM.DD HH:mm:ss',
  dateTimeFormat: 'YYYYMMDD-HHmmss',

  updater: {
    interval: 30 * 60 * 1000, // mins * secs * millis
    // url: 'https://api.metaspan.io/api/kusama/candidate',
    url: 'https://kusama.w3f.community/candidates'
  },

  server: {
    port: 3000,
  }
}

export default config
