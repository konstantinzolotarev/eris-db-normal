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

  /**
   * Load accounts from ErisDB
   * @param {Array} [filters]
   * @return {Promise}
   */
  getAccounts (filters) {
    if (filters) {
      if (!_.isArray(filters))
        return Promise.reject(new Error('Wrong filters format'))

      for (let i = 0; i < filters.length; i++) {
        if (!util.isFilter(filters[i]))
          return Promise.reject(new Error('Wrong filters format'))
      }
    }

    return this._eris.request
      .call('getAccounts', { filters: filters || [] })
      .then((resp) => {
        if(!_.isArray(resp.accounts))
          return Promise.reject(new Error('Wrong response received from RPC'))

        return resp.accounts
      })
  }

  /**
   * Load account details
   * @param {String} address
   * @return {Promise}
   */
  getAccount (address) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    return this._eris.request
      .call('getAccount', { address: address })
  }

  /**
   * Get the complete storage of a contract account. Non-contract accounts has no storage.
   * @param {String} address
   * @return {Promise}
   */
  getStorage (address) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    return this._eris.request
      .call('getStorage', { address: address })
  }

  /**
   * Get a particular entry in the storage of a contract account. Non-contract accounts has no storage.
   * @param {String} address
   * @param {String} key
   * @return {Promise}
   */
  getStorageAt (address, key) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    if (!key || !key.length || !util.isHex(key))
      return Promise.reject(new Error('Key is required parameter'))

    return this._eris.request
      .call('getStorageAt', { address: address, key: key })
  }
}
