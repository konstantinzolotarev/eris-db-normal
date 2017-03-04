'use strict'

const EventEmitter = require('events')

/**
 * Base Request interface for RPC calls to Eris
 * @type {ErisDB.Request}
 */
module.exports = class Request extends EventEmitter {

  constructor (rpcUrl) {
    super()
    this.url = rpcUrl
    // List of event subscriptions
    this._subscriptions = {}
  }

  /**
   * Add a new event subscription for listen
   * @param {String} subId
   * @param {String} event Event name
   */
  addSubscription (subId, event) {
    if (!this._subscriptions[subId])
      this._subscriptions[subId] = event
  }

  /**
   * Remove an event subscription
   * @param {String} subId subscription Id
   */
  removeSubscription (subId) {
    delete this._subscriptions[subId]
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
