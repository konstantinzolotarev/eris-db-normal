'use strict'

const Request = require('./Request')

const Network = require('./components/network')

/**
 * ErisDB RPC Client
 * @type {ErisDB}
 */
module.exports = class ErisDB {

  constructor(rpcUrl) {
    this.url = rpcUrl
    this.request = new Request(rpcUrl)

    this.network = new Network(this)
  }
}
