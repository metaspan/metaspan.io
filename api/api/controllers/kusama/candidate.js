const axios = require('axios')
const moment = require('moment-timezone')

const CACHE_URL = 'https://kusama.w3f.community/candidates'
const CACHE_VALIDITY = 10 * 60 // 10 mins * 60 seconds
const DATETIME_FORMAT = 'YYYY.MM.DD HH:mm:ss'

var updatedAt = moment().add(-1, 'day')
var cache = [
  {}
]

module.exports = {
  inputs: {
    stash: {
      type: 'string',
      required: false
    }
  },
  exits: {},
  async fn (inputs, exits, env) {
    if (moment().diff(updatedAt, 'seconds') > CACHE_VALIDITY) {
      sails.log.debug('candidate.js: updating cache')
      try {
        let result = await axios.get(CACHE_URL)
        if (result.data) {
          cache = result.data
          updatedAt = moment()
        }
      } catch (err) {
        sails.log.error(err)
        // return exits.error({text: 'upstream server error', statusCode: err.res.statusCode, statusMessage: err.res.statusMessage})
      }
    } else {
      sails.log.debug('candidate.js: serving from cache - ' + updatedAt.toString()) //.format(DATETIME_FORMAT)
    }

    if (inputs.stash) {
      return exits.success({
        updatedAt,
        candidate: cache.find(f => f.stash === inputs.stash)
      })
    } else {
      return exits.success({updatedAt, candidates: cache})
    }
  }
}
