'use strict'

const ErisDB = require('./lib/index')

/**
 * ErisDB client library
 * @type {Object}
 * @author Konstantin Zolotarev <konstantin.zolotarev@gmail.com>
 */
module.exports = {

  /**
   * Will create a new instance of {@link ErisDB}
   */
  createInstance (rpcUrl) {
    if (!rpcUrl)
      throw new Error('No RPC URL passed')

    return new ErisDB(rpcUrl)
  }
}
