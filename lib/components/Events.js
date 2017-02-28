'use strict'

const _ = require('lodash')
const EventEmitter = require('events')

/**
 * Events component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#events}
 * @type {ErisDB.Events}
 */
module.exports = class Events extends EventEmitter {

  constructor (eris) {
    super()
    this._eris = eris
    this._bindEvents()
  }

  /**
   * Will bind events that needed for events
   */
  _bindEvents () {
    this.on('newListener', this._onNewListener.bind(this))
    this.on('removeListener', this._onRemoveListener.bind(this))
  }

  /**
   * Handler for new listener
   * @private
   * @param {String} event
   */
  _onNewListener (event) {
    // TODO: check event and if it's from blockchain
    // need to add listener
    // or ignore if it's not from blockchain
  }

  /**
   * Handler for remove listener from event
   * @private
   * @param {String} event
   */
  _onRemoveListener (event) {
    // Check if we have listener for this event
    // than have to unsubscribe
  }

  /**
   * Subscribe to a given type of event
   * @param {String} eventId
   * @param {Function} callback
   */
  eventSubscribe (eventId) {
    if (!eventId || !eventId.length)
      return Promise.reject(new Error('EventId is required parameter'))

    return this._eris.request
      .call('eventSubscribe', { event_id: eventId })
      .then((info) => {
        if (!_.isObject(info) || !info.sub_id)
          return Promise.reject(new Error('Wrong RPC response received'))

        return info.sub_id
      })
  }

  /**
   * Unsubscribe to an event type
   * @param {String} subscriptionId
   * @return {Promise}
   */
  eventUnsubscribe (subscriptionId) {
    if (!subscriptionId || !subscriptionId.length)
      return Promise.reject(new Error('SubscriptionId is required parameter'))

    return this._eris.request
      .call('eventUnsubscribe', { sub_id: subscriptionId })
      .then((info) => {
        if (!_.isObject(info) || !info.result)
          return Promise.reject(new Error('Wrong RPC response received'))

        return info.result
      })
  }

  /**
   * Poll a subscription.
   * Note this cannot be done if using websockets,
   * because then the events will be passed automatically over the socket
   * @param {String} subscriptionId
   * @return {Promise}
   */
  eventPoll (subscriptionId) {
    if (!subscriptionId || !subscriptionId.length)
      return Promise.reject(new Error('SubscriptionId is required parameter'))

    return this._eris.request
      .call('eventPoll', { sub_id: subscriptionId })
      .then((info) => {
        if (!_.isObject(info) || !info.events)
          return Promise.reject(new Error('Wrong RPC response received'))

        return info.events
      })
  }

}
