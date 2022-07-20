import express from 'express'
// import bodyParser from 'body-parser'
import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUI from 'swagger-ui-express'
import cors from 'cors'
import fs from 'fs'
import { dirname } from 'path'

var app = express()
app.use(cors())

const swagger_options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "metaspan.io API",
      version: "0.1.0",
      description:
        "API/Tools documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "metaspan",
        url: "https://metaspan.com",
        email: "hello@metaspan.com",
      },
    },
    servers: [
      {url: "http://localhost:1337"},
      {url: "http://api.metaspan.io"},
    ],
  },
  apis: ["./server.js"],
}
const specs = swaggerJSDoc(swagger_options)
app.use(
  "/api-docs",
  SwaggerUI.serve,
  SwaggerUI.setup(specs)
)

import config from './config.js'
import { slog } from './utils.js'

app.get('/', function(req, res){
  res.sendFile('./static/index.html', { root: dirname('./') });
})

// 1KV CANDIDATES
/**
 * @swagger
 *   /api/{chain}/candidate:
 *     get:
 *       description: Returns list of candidates for {chain}
 *       parameters:
 *         - in: path
 *           name: chain
 *           schema:
 *             type: string
 *           required: true
 *           description: kusama | polkadot
 *       responses:
 *         200:
 *           description: list of candidates for {chain}
 */
app.get('/api/:chain/candidate', function(req, res) {
  const chain = req.params.chain
  slog(`GET /api/${chain}/candidate`)
  const cache = fs.readFileSync(`./cache/${chain}-candidate-${config.cache}`, 'utf-8')
  res.json(JSON.parse(cache))
})

/**
 * @swagger
 *   /api/{chain}/candidate/{stash}:
 *     get:
 *       summary: get candidate by stash
 *       tags: []
 *       parameters:
 *         - in: path
 *           name: chain
 *           schema:
 *             type: string
 *           required: true
 *           description: kusama | polkadot
 *         - in: path
 *           name: stash
 *           schema:
 *             type: string
 *           required: true
 *           description: the candidate stash
 *       responses:
 *         200:
 *           description: the candidate for {chain} {stash}
 *         404:
 *           description: not found
 */
app.get('/api/:chain/candidate/:stash', function(req, res) {
  const chain = req.params.chain
  const stash = req.params.stash
  slog(`GET /api/${chain}/candidate/${stash}`)
  var cache = fs.readFileSync(`./cache/${chain}-candidate-${config.cache}`, 'utf-8')
  cache = JSON.parse(cache)
  const c = cache.candidates.find(f => f.stash === stash)
  if (c) {
    res.json(c)
  } else {
    res.status(404).send(stash)
  }
})

// 1KV NOMINATORS
/**
 * @swagger
 *   /api/{chain}/nominator:
 *     get:
 *       description: Returns list of nominators for {chain}
 *       parameters:
 *         - in: path
 *           name: chain
 *           schema:
 *             type: string
 *           required: true
 *           description: kusama | polkadot
 *       responses:
 *         200:
 *           description: list of nominators for {chain}
 */
 app.get('/api/:chain/nominator', function(req, res) {
  const chain = req.params.chain
  slog(`GET /api/${chain}/nominator`)
  const cache = fs.readFileSync(`./cache/${chain}-nominator-${config.cache}`, 'utf-8')
  res.json(JSON.parse(cache))
})

/**
 * @swagger
 *   /api/{chain}/nominator/{id}:
 *     get:
 *       summary: get nominator by id
 *       tags: []
 *       parameters:
 *         - in: path
 *           name: chain
 *           schema:
 *             type: string
 *           required: true
 *           description: kusama | polkadot
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: the nominator
 *       responses:
 *         200:
 *           description: the nominator for {chain} {id}
 *         404:
 *           description: not found
 */
 app.get('/api/:chain/nominator/:id', function(req, res) {
  const chain = req.params.chain
  const id = req.params.id
  slog(`GET /api/${chain}/nominator/${id}`)
  var cache = fs.readFileSync(`./cache/${chain}-nominator-${config.cache}`, 'utf-8')
  cache = JSON.parse(cache)
  const c = cache.nominators.find(f => f._id === id)
  if (c) {
    res.json(c)
  } else {
    res.status(404).send({id, error: 'Not found'})
  }
})

/**
 * @swagger
 *   /api/{chain}/nominators_for/{stash}:
 *     get:
 *       summary: get nominators for validator stash
 *       tags: []
 *       parameters:
 *         - in: path
 *           name: chain
 *           schema:
 *             type: string
 *           required: true
 *           description: kusama | polkadot
 *         - in: path
 *           name: stash
 *           schema:
 *             type: string
 *           required: true
 *           description: the validator stash
 *       responses:
 *         200:
 *           description: the nominators for {chain} validator {stash}
 *         404:
 *           description: not found
 */
 app.get('/api/:chain/nominators_for/:stash', function(req, res) {
  const chain = req.params.chain
  const stash = req.params.stash
  slog(`GET /api/${chain}/nominators_for/${stash}`)
  var cache = fs.readFileSync(`./cache/${chain}-nominator-${config.cache}`, 'utf-8')
  cache = JSON.parse(cache)
  var noms = []
  cache.nominators.forEach(nom => {
    var cs = nom.current.filter(f => f.stash === stash)
    if (cs.length > 0) {
      nom.current = cs
      noms.push(nom)
    }
  })
  if (noms) {
    res.json(noms)
  } else {
    res.status(404).send({stash, error: 'Not found'})
  }
})

// POOLS
app.get('/api/:chain/pool', function(req, res) {
  const chain = req.params.chain
  slog(`GET /api/${chain}/pool`)
  const cache = []
  try {
    fs.readFileSync(`./cache/${chain}-pools.json`, 'utf-8')
  } catch (err) {
    console.debug(err)
  }
  res.json(JSON.parse(cache))
})

process.on('SIGINT', function() {
  console.log('\nCaught SIGINT, terminating')
  process.exit()
})

app.listen(config.server.port, () => {
  console.log('\nRunning on http://localhost:'+config.server.port+'\n')
})
