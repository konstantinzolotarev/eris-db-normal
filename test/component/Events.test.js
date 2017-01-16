'use strict'

const expect = require('chai').expect

describe('Events :: ', () => {

  let subscriptionId

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.events).to.be.an('object')
    })

  })

  describe('eventSubscribe() :: ', () => {

    it('reject without eventId', () => {
      return global.erisdb
        .events
        .eventSubscribe()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'EventId is required parameter')
        })
    })

    it('should subscribe to event', () => {
      const eventId = 'NewBlock'
      return global.erisdb
        .events
        .eventSubscribe(eventId)
        .then((newSubscriberId) => {
          expect(newSubscriberId).to.be.a('string')

          subscriptionId = newSubscriberId
        })
    })
  })

  describe('eventPoll() :: ', () => {

    it('reject without eventId', () => {
      return global.erisdb
        .events
        .eventPoll()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'SubscriptionId is required parameter')
        })
    })

    it('should not poll to not active event', () => {
      const eventId = 'NewBlock'
      return global.erisdb
        .events
        .eventPoll(eventId)
        .catch((err) => {
          expect(err).to.be.an('object')
            .and.to.have.property('message')
        })
    })

    it('should poll to event', () => {
      expect(subscriptionId).to.be.ok
      return global.erisdb
        .events
        .eventPoll(subscriptionId)
        .then((events) => {
          expect(events).to.be.an('array')
        })
    })
  })

  describe('eventUnsubscribe() :: ', () => {

    it('reject without eventId', () => {
      return global.erisdb
        .events
        .eventUnsubscribe()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'SubscriptionId is required parameter')
        })
    })

    it('should unsubscribe to event', () => {
      return global.erisdb
        .events
        .eventUnsubscribe(subscriptionId)
        .then((result) => {
          expect(result).to.be.true
        })
    })
  })

})
