'use strict'

const _ = require('lodash')
const util = require('../util')

/**
 * Accounts component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#get-accounts}
 * @type {ErisDB.Accounts}
 */
module.exports = class Accounts {

  constructor (eris) {
    this._eris = eris
  }

  getAccounts () {}

  getAccount (address) {}

  getStorage (address) {}

  getStorageAt (address, key) {}
}
