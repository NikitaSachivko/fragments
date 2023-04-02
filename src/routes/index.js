// src/routes/index.js

const express = require('express')

// version and author from package.json
const { version, author } = require('../../package.json')

// Create a router that we can use to mount our API
const router = express.Router()

// Our authentication middleware
const { authenticate } = require('../authorization/index')

// Our module for creating responses
const { createSuccessResponse } = require('../response')

const { hostname } = require('os')

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), require('./api'))

router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.status(200).json(
    createSuccessResponse({
      author: author,
      githubUrl: 'https://github.com/nsachivko/fragments',
      version,
      // Include the hostname in the response
      hostname: hostname(),
    })
  )
})

module.exports = router
