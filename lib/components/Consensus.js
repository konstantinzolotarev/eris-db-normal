'use strict'

const _ = require('lodash')

/**
 * Consensus component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#consensus}
 * @type {ErisDB.Consensus}
 */
module.exports = class Consensus {

  constructor (eris) {
    this._eris = eris
  }

  /**
   * Get the current consensus state
   * @return {Promise}
   */
  getConsensusState () {
    return this._eris.request
      .call('getConsensusState')
  }

  /**
   * Get list of validators
   * @return {Promise}
   */
  getValidators (height) {
    return this._eris.request
      .call('getValidators')
  }
}
