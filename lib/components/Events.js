'use strict'

const _ = require('lodash')

/**
 * Events component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#events}
 * @type {ErisDB.Events}
 */
module.exports = class Events {

  constructor (eris) {
    this._eris = eris
  }

  /**
   * Subscribe to a given type of event
   * @param {String} eventId
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
