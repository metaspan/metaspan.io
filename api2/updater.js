// worker to update the cache as needed

import axios from "axios"
import moment from 'moment-timezone'
import fs from 'fs'

import config from './config.js'
import { slog } from './utils.js'

async function update () {
  slog('updating...')
  Object.keys(config.updater.chains).forEach(async (chain) => {
    try {
      let resp = await axios.get(config.updater.chains[chain].candidates_url)
      if (resp.data) {
        if (resp.data.updatedAt) {
          // prob from testing...
          fs.writeFileSync(`./cache/${chain}-candidate-${config.cache}`, JSON.stringify(resp.data, null, 2), { encoding:'utf-8' })
        } else {
          // probably direct...
          fs.writeFileSync(`./cache/${chain}-candidate-${config.cache}`, JSON.stringify({updatedAt: moment(), candidates: resp.data}, null, 2), { encoding:'utf-8' })
        }
      }
      resp = await axios.get(config.updater.chains[chain].nominators_url)
      if (resp.data) {
        if (resp.data.updatedAt) {
          // prob from testing...
          fs.writeFileSync(`./cache/${chain}-nominator-${config.cache}`, JSON.stringify(resp.data, null, 2), { encoding:'utf-8' })
        } else {
          // probably direct...
          fs.writeFileSync(`./cache/${chain}-nominator-${config.cache}`, JSON.stringify({updatedAt: moment(), nominators: resp.data}, null, 2), { encoding:'utf-8' })
        }
      }
    } catch (err) {
      slog('Caught AXIOS error')
      console.error(err)
    } finally {
      slog('...done')
    }
  })
}

slog('starting...')
update()
setInterval(async () => {
  update()
}, config.updater.interval)
