'use strict'

const Request = require('./Request')
const _ = require('lodash')
const WebSocket = require('ws')

/**
 * WS request class for ErisDB
 * @type {ErisDB.WsRequest}
 */
module.exports = class WsRequest extends Request {

  constructor (rpcUrl) {
    super(rpcUrl)
    this._ws = null
    // List of promises with it's requests
    // Will be resolved/rejected on server response
    this._promises = {}
    // Init connection
    this._connect()
  }

  /**
   * Generate random ID for request
   * @return {String}
   */
  reqId () {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Connect to WS
   * @return {Promise}
   */
  _connect () {
    this._ws = new WebSocket(this.url, {
      perMessageDeflate: false
    })
    this._ws.on('open', () => {
      // WS opned
      console.log('Opened connection')
    })
    this._ws.once('close', this.onClose.bind(this))
    this._ws.on('message', this.onMessage.bind(this))
    this._ws.on('error', this.onError.bind(this))
  }

  /**
   * Handle WS close event
   */
  onClose () {
    // Ws Closed
    console.log('Closed connection')
  }

  /**
   * handle error from WS
   */
  onError (err) {
    //Handle error
    console.log('==============================')
    console.log(err)
    console.log('==============================')
  }

  /**
   * Handle WS message from server
   * @param {Stirng} message
   * @return {*}
   */
  onMessage (message) {
    // No need to check non existing message
    if (!message || !_.isString(message))
      return

    try {
      const json = JSON.parse(message)
      // Ignore wrong response
      if (!_.isObject(json) || !json.id || !_.isString(json.id))
        return
      // Ignore if no promise exist
      if (!this._promises[json.id])
        return

      this.transformResponse(json)
        .then((data) => {
          this._promises[json.id].resolve(data)
          delete this._promises[json.id]
        })
    }
    catch (err) {
      // Ignore error
    }
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

    if (_.isUndefined(response.result))
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
    if (!this._ws || this._ws.readyState != WebSocket.OPEN)
      return Promise.reject(new Error('No connection to server'))

    if (!_.isString(method))
      return Promise.reject(new Error('Please provide RPC method'))

    method = method.replace('erisdb.', '')
    const reqId = this.reqId()
    const options = {
      jsonrpc: '2.0',
      method: `erisdb.${method}`,
      id: reqId,
      params: params || {}
    }

    return new Promise((resolve, reject) => {
      // Note that promise will be rejected later in {@link WsRequest.onMessage}
      this._promises[reqId] = { resolve, reject }
      try {
        this._ws.send(JSON.stringify(options))
      }
      catch (err) {
        reject(err)
        delete this._promises[reqId]
      }
    })
  }
}
