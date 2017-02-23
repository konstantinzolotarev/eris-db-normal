'use strict'

/**
 * Base Request interface for RPC calls to Eris
 * @type {ErisDB.Request}
 */
module.exports = class Request {

  constructor (rpcUrl) {
    this.url = rpcUrl
  }

  /**
   * Handle RPC response
   * @param {Object} response
   * @return {Promise}
   */
  transformResponse (response) {
    return Promise.reject(new Error('Not implemented yet !'))
  }

  /**
   * Makes a call to RPC
   * @param {String} method
   * @param {Object} [params]
   * @return {Promise}
   */
  call (method, params) {
    return Promise.reject(new Error('Not implemented yet !'))
  }
}
