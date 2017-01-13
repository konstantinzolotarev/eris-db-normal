'use strict'

const _ = require('lodash')
const util = require('../util')

/**
 * NameReg component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#get-namereg-entry}
 * @type {ErisDB.NameReg}
 */
module.exports = class NameReg {

  constructor (eris) {
    this._eris = eris
  }

  /**
   * Get a namereg entry by its key.
   * @param {String} name
   * @return {Promise}
   */
  getNameRegEntry (name) {
    if (!_.isString(name) || !name.length)
      return Promise.reject(new Error('Name is required parameter'))

    return this._eris.request
      .call('getNameRegEntry', { name: name })
  }

  /**
   * This will return a list of name reg entries. Filters may be used.
   * @param {Array} filters
   * @return {Promise}
   */
  getNameRegEntries (filters) {
    if (filters) {
      if (!_.isArray(filters))
        return Promise.reject(new Error('Wrong filters format'))

      for (let i = 0; i < filters.length; i++) {
        if (!util.isFilter(filters[i]))
          return Promise.reject(new Error('Wrong filters format'))
      }
    }
    return this._eris.request
      .call('getNameRegEntries', { filters: filters || [] })
  }

}
