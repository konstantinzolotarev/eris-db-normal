'use strict'

const expect = require('chai').expect

describe('Events :: ', () => {

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
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.have.property('sub_id')
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
            .and.to.have.property('message', 'EventId is required parameter')
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

    xit('should poll to event', () => {
      const eventId = 'NewBlock'
      return global.erisdb
        .events
        .eventPoll(eventId)
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.have.property('events')
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
            .and.to.have.property('message', 'EventId is required parameter')
        })
    })

    it('should unsubscribe to event', () => {
      const eventId = 'NewBlock'
      return global.erisdb
        .events
        .eventUnsubscribe(eventId)
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.have.property('result')
        })
    })
  })

})
