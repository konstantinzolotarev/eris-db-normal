'use strict'

const _ = require('lodash')
const util = require('../util')

/**
 * Blockchain component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#blockchain}
 * @type {ErisDB.Blockchain}
 */
module.exports = class Blockchain {

  constructor (eris) {
    this._eris = eris
  }

  /**
   * Get blockchain info
   * @return {Promise}
   */
  getBlockchainInfo () {
    return this._eris.request
      .call('getBlockchainInfo')
  }

  /**
   * Get chain id
   * @return {Promise}
   */
  getChainId () {
    return this._eris.request
      .call('getChainId')
      .then((resp) => {
        if (!resp.chain_id)
          return Promise.reject(new Error('Wrong response received from RPC'))

        return resp.chain_id
      })
  }

  /**
   * Get genesis hash
   * @return {Promise}
   */
  getGenesisHash () {
    return this._eris.request
      .call('getGenesisHash')
      .then((resp) => {
        if (!resp.hash)
          return Promise.reject(new Error('Wrong response received from RPC'))

        return resp.hash
      })
  }

  /**
   * Get last block height
   * @return {Promise}
   */
  getLatestBlockHeight () {
    return this._eris.request
      .call('getLatestBlockHeight')
      .then((resp) => {
        if (!resp.height)
          return Promise.reject(new Error('Wrong response received from RPC'))

        return resp.height
      })
  }

  /**
   * Get last block
   * @return {Promise}
   */
  getLatestBlock () {
    return this._eris.request
      .call('getLatestBlock')
  }

  /**
   * Get blocks
   * @param {Array} [filters]
   * @return {Promise}
   */
  getBlocks (filters) {
    if (filters) {
      if (!_.isArray(filters))
        return Promise.reject(new Error('Wrong filters format'))

      for (let i = 0; i < filters.length; i++) {
        if (!util.isFilter(filters[i]))
          return Promise.reject(new Error('Wrong filters format'))
      }
    }

    return this._eris.request
      .call('getBlocks', { filters: filters || [] })
  }

  /**
   * Get block
   * @param {Number} height
   * @return {Promise}
   */
  getBlock (height) {
    if (!_.isNumber(height))
      return Promise.reject(new Error('Height is required parameter'))

    return this._eris.request
      .call('getBlock', { height: height })
  }
}
