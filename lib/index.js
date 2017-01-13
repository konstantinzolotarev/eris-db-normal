'use strict'

const Request = require('./Request')

const Accounts = require('./components/Accounts')
const Network = require('./components/Network')
const Transactions = require('./components/Transactions')
const Blockchain = require('./components/Blockchain')
const Consensus = require('./components/Consensus')

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
    this.blockchain = new Blockchain(this)
    this.consensus = new Consensus(this)
  }
}
