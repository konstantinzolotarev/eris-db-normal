'use strict'

const _ = require('lodash')

// const EVENTS = [
//   'Acc',
//   'Log',
//   'NewBlock',
//   'Fork',
//   'Bond',
//   'Unbond',
//   'Rebond',
//   'Dupeout'
// ]

/**
 * Events component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#events}
 * @type {ErisDB.Events}
 */
module.exports = class Events {

  constructor (eris) {
    this._eris = eris
    // List of binded events listeners
    this._subscriptions = {}
    this._bindEvents()
  }

  /**
   * Will bind events that needed for events
   */
  _bindEvents () {
    this._eris.request.on('event', (data) => {
      if (data.subId && _.isObject(this._subscriptions[data.subId]))
        this._subscriptions[data.subId].listener(data.data)
    })
  }

  /**
   * Add event Listener
   * @param {String} event
   * @param {Function} listener
   * @return {Promise}
   */
  addEventListener (event, listener) {
    if (!_.isString(event) || _.isEmpty(event))
      return Promise.reject(new Error('No event passed'))

    // No need to bind something without lisstener
    if (!_.isFunction(listener))
      return Promise.resolve()

    return this.eventSubscribe(event)
      .then((subId) => {
        this._subscriptions[subId] = {subId, event, listener}
        this._eris.request.addSubscription(subId, event)
        return Promise.resolve(subId)
      })
  }

  /**
   * Removes listener from event
   * @param {String} event
   * @param {Function} [listener]
   * @return {Promise}
   */
  removeEventListener (event, listener) {
    const toRemove = []
    for (const subId in this._subscriptions) {
      if (!this._subscriptions[subId] || !this._subscriptions[subId].event)
        continue

      if (this._subscriptions[subId].event == event) {
        if (_.isFunction(listener)) {
          if (this._subscriptions[subId].listener == listener)
            toRemove.push(subId)
        }
        else {
          toRemove.push(subId)
        }
      }
    }

    if (!toRemove.length)
      return Promise.resolve()

    return Promise
      .all(toRemove.map((subId) => this
        .eventUnsubscribe(subId)
        .catch((err) => { /* ... */ })
      ))
      .then(() => {
        // Clear listeners
        toRemove.forEach((subId) => {
          delete this._subscriptions[subId]
        })
        return Promise.resolve()
      })
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
