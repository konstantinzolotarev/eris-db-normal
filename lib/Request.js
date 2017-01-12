'use strict'

const request = require('request-promise')
const _ = require('lodash')

/**
 * Requester for all calls
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
    if (!_.isObject(response))
      return Promise.reject(new Error('Wrong RPC response'))

    if (response.error)
      return Promise.reject(_.isString(response.error) ? new Error(response.error) : response.error)

    if (!response.result)
      return Promise.reject(new Error('Wrong RPC response'))

    return Promise.resolve(response.result)
  }

  /**
   * Makes a call to RPC
   * @param {String} method
   * @param {Object} [params]
   * @return {Promise}
   */
  call (method, params) {
    if (!_.isString(method))
      return Promise.reject(new Error('Please provide RPC method name'))
    // no need to repeat it
    method = method.replace('erisdb.', '')
    //
    const options = {
      method: 'POST',
      uri: this.url,
      json: true,
      body: _.defaults({
        jsonrpc: '2.0',
        method: `erisdb.${method}`
      }, params || {})
    }
    return request(options)
      .then(this.transformResponse)
  }
}
