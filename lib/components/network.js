'use strict'

/**
 * Network component
 * @type {ErisDB.Network}
 */
module.exports = class Network {

  coinstructor (eris) {
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
}
