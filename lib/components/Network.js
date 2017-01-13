'use strict'

const _ = require('lodash')
const util = require('../util')

/**
 * Network component
 * @type {ErisDB.Network}
 */
module.exports = class Network {

  constructor (eris) {
    this._eris = eris
  }

  /**
   * Get network info
   * @return {Promise}
   */
  getInfo () {
    return this._eris.request
      .call('getNetworkInfo')
  }

  /**
   * Get client version
   * @return {Promise}
   */
  getClientVersion () {
    return this._eris.request
      .call('getClientVersion')
  }

  /**
   * Get Moniker
   * @return {Promise}
   */
  getMoniker () {
    return this._eris.request
      .call('getMoniker')
  }

  /**
   * Check if is listening
   * @return {Promise}
   */
  isListening () {
    return this._eris.request
      .call('isListening')
      .then((resp) => {
        if (!_.isBoolean(resp.listening))
          return Promise.reject(new Error('Wrong RPC response'))

        return resp.listening
      })
  }

  /**
   * Load list of listeners
   * @return {Promise}
   */
  getListeners () {
    return this._eris.request
      .call('getListeners')
      .then((resp) => {
        if (!_.isArray(resp.listeners))
          return Promise.reject(new Error('Wrong RPC response'))

        return resp.listeners
      })
  }

  /**
   * Load list of listeners
   * @return {Promise}
   */
  getPeers () {
    // TODO: erisDB docs are not correct and
    // erisdb.getPeers don't return `{ peers: [<Peer>] }` response
    // it just returns array of peers ` [] `
    return this._eris.request
      .call('getPeers')

  }

  /**
   * Load peer for given address
   * @param {String|Address} address
   * @return {Promise}
   */
  getPeer (address) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    return this._eris.request
      .call('getPeer', { address: address })
  }
}
