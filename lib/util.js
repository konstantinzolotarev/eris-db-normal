'use strict'

const _ = require('lodash')

const hexRe = /^[0-9a-fA-F]*$/
const addrRe = /^[0-9a-fA-F]{40}$/
const pubRe = /^[0-9a-fA-F]{64}$/
const privRe = /^[0-9a-fA-F]{128}$/

const filterOperations = [
  '>', '<', '>=', '<=', '==', '!='
]

/**
 * Check if given Object is CallTx
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#calltx}
 * @param  {Object}  tx
 * @return {Boolean}
 */
function isCallTx (tx) {
  if (!_.isObject(tx))
    return false

  if (!isHex(tx.data))
    return false

  if (!_.isObject(tx.input))
    return false

  if (!isAddress(tx.input.address))
    return false

  return true
}

/**
 * Check if given operation allowed for Filters in RPC
 * @param  {String}  operation
 * @return {Boolean}
 */
function isFilterOp(operation) {
  return Boolean(~filterOperations.indexOf(operation))
}

/**
 * Check if given filter has correct format
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#queries-filters}
 * @param  {object}  filter
 * @return {Boolean}
 */
function isFilter(filter) {
  if (!_.isObject(filter))
    return false

  if (!filter.field || !isFilterOp(filter.op) || !filter.value)
    return false

  return true
}

/**
 * Check if string is proper hex.
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isHex(str) {
  return typeof(str) == 'string' && str.match(hexRe)
}

/**
 * Check if string is proper hex of length 40 (20 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isAddress(str) {
  return typeof(str) == 'string' && str.match(addrRe)
}

/**
 * Check if string is proper hex of length 64 (32 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isPubKey(str) {
  return typeof(str) == 'string' && str.match(pubRe)
}

/**
 * Check if string is proper hex of length 128 (64 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isPrivKey(str) {
  return typeof(str) == 'string' && str.match(privRe)
}

/**
 * Check is given obj is CallTx
 * @type {isCallTx}
 */
exports.isCallTx = isCallTx
/**
 * Filter operations
 * @type {filterOperations}
 */
exports.isFilterOp = isFilterOp
/**
 * @type {isFilter}
 */
exports.isFilter = isFilter
/**
 * @type {isHex}
 */
exports.isHex = isHex
/**
 * @type {isAddress}
 */
exports.isAddress = isAddress
/**
 * @type {isPubKey}
 */
exports.isPubKey = isPubKey
/**
 * @type {isPrivKey}
 */
exports.isPrivKey = isPrivKey
