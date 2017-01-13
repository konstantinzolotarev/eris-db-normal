'use strict'

const _ = require('lodash')
const util = require('../util')

/**
 * Unsafe component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#unsafe}
 * @type {ErisDB.Unsafe}
 */
module.exports = class Unsafe {

  constructor (eris) {
    this._eris = eris
  }

  /**
   * Convenience method for sending a transaction.
   * It will do the following things:
   *  - Use the private key to create a private account object (i.e. generate public key and address)
   *  - Use the other parameters to create a CallTx object
   *  - Sign the transaction.
   *  - Broadcast the transaction
   *
   * @param {String} privKey
   * @param {String} data should be in hex format
   * @param {String} [address]
   * @param {Number} [fee]
   * @param {Number} [gasLimit]
   * @return {Promise}
   */
  transact (privKey, data, address, fee, gasLimit) {
    if (!privKey || !util.isPrivKey(privKey))
      return Promise.reject(new Error('PrivKey is required parameter'))

    if (!data || !util.isHex(data))
      return Promise.reject(new Error('Data is required parameter'))

    if (address && !util.isAddress(address))
      return Promise.reject(new Error('Address should be a valid address'))

    const params = {
      priv_key: privKey,
      data: data,
      address: address || ''
    }
    if (fee && _.isNumber(fee))
      params.fee = fee

    if (gasLimit && _.isNumber(gasLimit))
      params.gasLimit = gasLimit

    return this._eris.request
      .call('transact', params)
  }

  /**
   * Convenience method for sending a transaction and holding until
   * it’s been committed (or not). It will do the following things:
   *  - Use the private key to create a private account object (i.e. generate public key and address)
   *  - Use the other parameters to create a CallTx object
   *  - Sign the transaction.
   *  - Broadcast the transaction
   *  - Wait until the transaction is fully processed
   *
   * @param {String} privKey
   * @param {String} data should be in hex format
   * @param {String} [address]
   * @param {Number} [fee]
   * @param {Number} [gasLimit]
   * @return {Promise}
   */
  transactAndHold (privKey, data, address, fee, gasLimit) {
    if (!privKey || !util.isPrivKey(privKey))
      return Promise.reject(new Error('PrivKey is required parameter'))

    if (!data || !util.isHex(data))
      return Promise.reject(new Error('Data is required parameter'))

    if (address && !util.isAddress(address))
      return Promise.reject(new Error('Address should be a valid address'))

    const params = {
      priv_key: privKey,
      data: data,
      address: address || ''
    }
    if (fee && _.isNumber(fee))
      params.fee = fee

    if (gasLimit && _.isNumber(gasLimit))
      params.gasLimit = gasLimit

    return this._eris.request
      .call('transactAndHold', params)
  }

  /**
   * Convenience method for sending a transaction to the name registry.
   * It will do the following things:
   *  - Use the private key to create a private account object (i.e. generate public key and address)
   *  - Use the other parameters to create a NameTx object
   *  - Sign the transaction
   *  - Broadcast the transaction
   *
   * @param {String} privKey
   * @param {String} data should be in hex format
   * @param {String} name
   * @param {Number} [amount]
   * @param {Number} [fee]
   * @return {Promise}
   */
  transactNameReg (privKey, data, name, amount, fee) {
    if (!privKey || !util.isPrivKey(privKey))
      return Promise.reject(new Error('PrivKey is required parameter'))

    if (!data || !util.isHex(data))
      return Promise.reject(new Error('Data is required parameter'))

    if (!_.isString(name) || !name.length)
      return Promise.reject(new Error('Name is required parameter'))

    const params = {
      priv_key: privKey,
      data: data,
      name: name
    }
    if (fee && _.isNumber(fee))
      params.fee = fee

    if (amount && _.isNumber(amount))
      params.amount = amount

    return this._eris.request
      .call('transactNameReg', params)
  }

  /**
   * Convenience method for generating a PrivAccount object,
   * which contains a private key and the corresponding public key and address
   * @return {Promise}
   */
  genPrivAccount () {
    return this._eris.request
      .call('genPrivAccount')
  }
}
