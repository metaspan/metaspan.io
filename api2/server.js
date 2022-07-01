import express from 'express'
import cors from 'cors'
import fs from 'fs'

var app = express()
app.use(cors())

import config from './config.js'
import { slog } from './utils.js'

app.get('/', function(req, res){
  res.send('Hello')
})

app.get('/api/:chain/candidate', function(req, res) {
  const chain = req.params.chain
  slog(`GET /api/${chain}/candidate`)
  const cache = fs.readFileSync(`${chain}-${config.cache}`, 'utf-8')
  res.json(JSON.parse(cache))
})

app.get('/api/:chain/candidate/:stash', function(req, res) {
  const chain = req.params.chain
  const stash = req.params.stash
  slog(`GET /api/${chain}/candidate/${stash}`)
  var cache = fs.readFileSync(`${chain}-${config.cache}`, 'utf-8')
  cache = JSON.parse(cache)
  const c = cache.candidates.find(f => f.stash === stash)
  if (c) {
    res.json(c)
  } else {
    res.status(404).send(stash)
  }
})

process.on('SIGINT', function() {
  console.log('\nCaught SIGINT, terminating')
  process.exit()
})

app.listen(config.server.port, () => {
  console.log('\nRunning on http://localhost:'+config.server.port+'\n')
})
