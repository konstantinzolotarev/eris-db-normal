'use strict'

const _ = require('lodash')
const util = require('../util')

/**
 * Accounts component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#broadcast-tx}
 * @type {ErisDB.Transactions}
 */
module.exports = class Transactions {

  constructor (eris) {
    this._eris = eris
  }

  broadcastTx (tx) {}

  getUnconfirmedTxs () {}

  call () {}

  callCode () {}
}
