const axios = require('axios')
const moment = require('moment-timezone')

const cfg = sails.config.api_cache
console.debug('config', cfg)

const CACHE_URL = cfg.url || 'https://kusama.w3f.community/nominators'
const CACHE_VALIDITY = cfg.validity || 10 * 60 // 10 mins * 60 seconds
const DATETIME_FORMAT = cfg.dateTimeFormat || 'YYYY.MM.DD HH:mm:ss'

var updatedAt = moment().add(-1, 'day')
var cache = [
  {}
]
var loading = false

module.exports = {
  inputs: {
    stash: {
      type: 'string',
      required: false
    }
  },
  exits: {},
  async fn (inputs, exits, env) {
    sails.log.debug('starting... loading = ', loading)
    if (moment().diff(updatedAt, 'seconds') > CACHE_VALIDITY && !loading) {
      sails.log.debug('kusama/nominator.js: updating cache')
      loading = true
      try {
        let result = await axios.get(CACHE_URL)
        if (result.data) {
          cache = result.data.updatedAt ? result.data.candidates : result.data
          updatedAt = moment()
        }
      } catch (err) {
        sails.log.error(err)
        // return exits.error({text: 'upstream server error', statusCode: err.res.statusCode, statusMessage: err.res.statusMessage})
      } finally {
        loading = false
      }
    } else {
      sails.log.debug('kusama/nominator.js: serving from cache - ' + updatedAt.toString()) //.format(DATETIME_FORMAT)
    }

    if (inputs.stash) {
      return exits.success({
        updatedAt,
        nominator: cache.find(f => f.stash === inputs.stash)
      })
    } else {
      return exits.success({updatedAt, nominators: cache})
    }
  }
}
