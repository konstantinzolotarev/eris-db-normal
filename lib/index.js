'use strict'

const Request = require('./Request')

const Accounts = require('./components/Accounts')
const Network = require('./components/Network')
const Transactions = require('./components/Transactions')

/**
 * ErisDB RPC Client
 * @type {ErisDB}
 */
module.exports = class ErisDB {

  constructor(rpcUrl) {
    this.url = rpcUrl
    this.request = new Request(rpcUrl)

    this.network = new Network(this)
    this.accounts = new Accounts(this)
    this.transactions = new Transactions(this)
  }
}
