'use strict'

// const _ = require('lodash')

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
  }

  /**
   * Unsubscribe to an event type
   * @param {String} eventID
   * @return {Promise}
   */
  eventUnsubscribe (eventId) {
    if (!eventId || !eventId.length)
      return Promise.reject(new Error('EventId is required parameter'))

    return this._eris.request
      .call('eventUnsubscribe', { event_id: eventId })
  }

  /**
   * Poll a subscription.
   * Note this cannot be done if using websockets,
   * because then the events will be passed automatically over the socket
   * @param {String} eventId
   * @return {Promise}
   */
  eventPoll (eventId) {
    if (!eventId || !eventId.length)
      return Promise.reject(new Error('EventId is required parameter'))

    return this._eris.request
      .call('eventPoll', { event_id: eventId })
  }

}
