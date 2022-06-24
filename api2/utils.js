
import moment from 'moment-timezone'
import config from './config.js'

export function slog (t) {
  console.log(`${moment().format(config.dateTimeFormat)}: ${t}`)
}
