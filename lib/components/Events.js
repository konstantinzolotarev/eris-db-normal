'use strict'

const _ = require('lodash')
const EventEmitter = require('events')

const EVENTS = [
  'Acc',
  'Log',
  'NewBlock',
  'Fork',
  'Bond',
  'Unbond',
  'Rebond',
  'Dupeout'
]

/**
 * Events component
 * @see {@link https://monax.io/docs/documentation/db/latest/specifications/api/#events}
 * @type {ErisDB.Events}
 */
module.exports = class Events extends EventEmitter {

  constructor (eris) {
    super()
    this._eris = eris
    // List of binded events listeners
    this._bevents = {}
    this._bindEvents()
  }

  /**
   * Will bind events that needed for events
   */
  _bindEvents () {
    this.on('newListener', this._onNewListener.bind(this))
    this.on('removeListener', this._onRemoveListener.bind(this))
    this._eris.request.on('event', (data) => {
      if (data.event)
        this.emit(data.event, data.data)
    })
  }

  /**
   * Check if given event name is related to blockchain events
   * @param {String} event
   */
  _isBlockChainEvent (event) {
    return Boolean(_.find(EVENTS, (ev) => _.startsWith(event, ev)))
  }

  /**
   * Handler for new listener
   * @private
   * @param {String} event
   */
  _onNewListener (event) {
    // Check if event is from blockchain
    if (!this._isBlockChainEvent(event))
      return

    // If we do have such event subscription no need to add another one
    if (_.isObject(this._bevents[event]))
      return

    this.eventSubscribe(event)
      .then((subId) => {
        this._bevents[event] = subId
        this._eris.request.addSubscription(subId, event)
        this.emit('subscribed', { event, subId })
      })
      .catch((err) => this.emit('errorSubscription', { event }))
  }

  /**
   * Handler for remove listener from event
   * @private
   * @param {String} event
   */
  _onRemoveListener (event) {
    if (!this._isBlockChainEvent(event))
      return

    if (!this._bevents[event])
      return
    // Do not remove subscription
    if (this.listenerCount(event) > 0)
      return

    this.eventUnsubscribe(this._bevents[event])
      .catch((err) => this.emit('errorUnsubscription', {
        event,
        subId: this._bevents[event]
      }))
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
