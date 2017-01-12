'use strict'

const _ = require('lodash')

/**
 * Base Component for ErisDB RPC
 * @type {ErisDB.BaseComponent}
 */
module.exports = class BaseComponent {

  constructor (request, definition) {
    this._request = request
  }

}
