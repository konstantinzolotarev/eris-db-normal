'use strict'

const Request = require('./Request')
const BaseComponent = require('./BaseComponent')

const Network = require('./definitions/network')

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
