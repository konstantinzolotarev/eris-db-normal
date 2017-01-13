'use strict'

const eris = require('../index')
const config = require('./config')

before(() => {
  global.erisdb = eris.createInstance(config.rpc)
})
