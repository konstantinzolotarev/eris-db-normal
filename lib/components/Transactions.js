'use strict'

const _ = require('lodash')
const util = require('../util')
const crypto = require('tendermint-crypto')

/**
 * Accounts component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#broadcast-tx}
 * @type {ErisDB.Transactions}
 */
module.exports = class Transactions {

  constructor (eris) {
    this._eris = eris
  }

  /**
   * Sign helper for transactions
   * @param {Object} tx
   * @param {String} privKey private key in hex format
   * @return {Promise}
   */
  sign (tx, privKey) {
    if (!_.isObject(tx))
      return Promise.reject(new Error('Transaction is required parameter'))

    if (!util.isPrivKey(privKey))
      return Promise.reject(new Error('PrivKey is required parameter'))

    try {
      const PrivKeyEd25519 = crypto.PrivKeyEd25519
      const key = new PrivKeyEd25519(new Buffer(privKey, 'hex'))
      return Promise.resolve(key.signString(JSON.stringify(tx)).toJSON())
    }
    catch (err) {
      return Promise.reject(err)
    }
  }

  /**
   * Broadcast a given (signed) transaction to the node.
   * It will be added to the tx pool if there are no issues, and if it is
   * accepted by all validators it will eventually be committed to a block.
   * WARNING: BroadcastTx will not be useful until we add a client-side signing solution.
   * @param {Object} tx
   * @return {Promise}
   */
  broadcastTx (tx) {
    if (!_.isObject(tx))
      return Promise.reject(new Error('Transaction is required parameter'))

    return this._eris.request
      .call('broadcastTx', tx)
  }

  /**
   * Get list of unconfirmed transactions
   * @return {Promise}
   */
  getUnconfirmedTxs () {
    return this._eris.request
      .call('getUnconfirmedTxs')
      .then((data) => {
        if (!data || !data.txs)
          return Promise.reject(new Error('Wrong response received from RPC'))

        return data.txs
      })
  }

  /**
   * Call a given (contract) account to execute its code with the given in-data.
   * @param {String} address
   * @param {String} data
   * @return {Promise}
   */
  call (address, data) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    if (!data || !util.isHex(data))
      return Promise.reject(new Error('Data is required parameter'))

    return this._eris.request
      .call('call', { address: address, data: data })
  }

  /**
   * Pass contract code and tx data to the node and have it executed in the virtual machine.
   * This is mostly a dev feature.
   * @param {String} address
   * @param {String} data
   * @return {Promise}
   */
  callCode (address, data) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    if (!data || !util.isHex(data))
      return Promise.reject(new Error('Data is required parameter'))

    return this._eris.request
      .call('callCode', { address: address, data: data })
  }
}
