'use strict'

const HttpRequest = require('./request/HttpRequest')
const WsRequest = require('./request/WsRequest')

const Accounts = require('./components/Accounts')
const Network = require('./components/Network')
const Transactions = require('./components/Transactions')
const Blockchain = require('./components/Blockchain')
const Consensus = require('./components/Consensus')
const Events = require('./components/Events')
const Unsafe = require('./components/Unsafe')
const NameReg = require('./components/NameReg')

/**
 * ErisDB RPC Client
 * @type {ErisDB}
 */
module.exports = class ErisDB {

  constructor(rpcUrl) {
    this.url = rpcUrl
    if (this.url.indexOf('ws') == 0)
      this.request = new WsRequest(rpcUrl)
    else
      this.request = new HttpRequest(rpcUrl)

    this.network = new Network(this)
    this.accounts = new Accounts(this)
    this.transactions = new Transactions(this)
    this.blockchain = new Blockchain(this)
    this.consensus = new Consensus(this)
    this.events = new Events(this)
    this.unsafe = new Unsafe(this)
    this.namereg = new NameReg(this)
  }
}
