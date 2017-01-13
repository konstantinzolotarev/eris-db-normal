'use strict'

const Request = require('./Request')

const Accounts = require('./components/Accounts')
const Network = require('./components/Network')
const Transactions = require('./components/Transactions')
const Blockchain = require('./components/Blockchain')
const Consensus = require('./components/Consensus')
const Events = require('./components/Events')
const Unsafe = require('./components/Unsafe')

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
    this.events = new Events(this)
    this.unsafe = new Unsafe(this)
  }
}
