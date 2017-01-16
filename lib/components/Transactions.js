'use strict'

const _ = require('lodash')
const util = require('../util')
const crypto = require('tendermint-crypto')

/**
 * Transactions component
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
   * Will wait for transaction will be validated
   * @param {Object} tx CallTx object
   * @param {Object} result broadcastTx result
   * @return {Promise}
   */
  _waitForConfirmation (tx, result) {
    console.log('==========================')
    console.log(result)
    console.log('==========================')
    return new Promise((resolve, reject) => {
      const checkBlock = (step = 0) => {
        setTimeout(() => {
          this._eris
            .blockchain
            .getLatestBlock()
            .then((block) => {
              if (block.data.txs && block.data.txs.length > 0)
                  console.log(new Buffer(block.data.txs[0], 'hex').toString())
              console.log('==========================')
              console.log(block)
              console.log('==========================')
              step++
              if (step > 2)
                resolve(block)
              else
                checkBlock(step)
            })
            .catch(reject)
        }, 500)
      }

      checkBlock()
    })
  }

  /**
   * System will try to set all missing fields for given tx
   *  - Use the other parameters to create a CallTx object
   *  - Sign the transaction.
   *  - Broadcast the transaction
   *  - Wait until the transaction is fully processed
   *
   * @param {Object} tx
   * @param {String} privKey
   * @return {Promise}
   */
  sendTransaction (tx, privKey) {
    if (!tx || !util.isCallTx(tx))
      return Promise.reject(new Error('Transaction is required parameter'))

    if (!privKey || !util.isPrivKey(privKey))
      return Promise.reject(new Error('PrivKey is required parameter'))

    let chainId
    let account

    return this._eris
      .blockchain
      .getChainId()
      .then((currentChainId) => {
        chainId = currentChainId

        return this._eris
          .accounts
          .getAccount(tx.input.address)
      })
      .then((loadedAccount) => {
        account = loadedAccount
        if (!tx.address)
          tx.address = ''

        if (!tx.input.sequence)
          tx.input.sequence = (account && account.sequence) ? account.sequence + 1 : 1

        if (!tx.fee)
          tx.fee = 0

        if (!tx.gas_limit)
          tx.gas_limit = 100000

        if (!tx.input.amount)
          tx.input.amount = 10

        // Sign transaction
        const txForSigning = {
          chain_id: chainId,
          tx: [
            2, {
              address: tx.address,
              data: tx.data,
              fee: tx.fee,
              gas_limit: tx.gas_limit,
              input: {
                address: tx.input.address,
                amount: tx.input.amount,
                sequence: tx.input.sequence
              }
            }
          ]
        }

        return this.sign(txForSigning, privKey)
      })
      .then((signed) => {
        tx.input.signature = signed
        tx.input.pub_key = account.pub_key

        return this.broadcastTx(tx)
      })
      .then((info) => {
        if (!info.tx_hash)
          return Promise.reject(new Error('No tx_hash received'))

        return this._waitForConfirmation(tx, info)
      })
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
