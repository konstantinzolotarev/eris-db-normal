'use strict'

const config = require('../config')
const expect = require('chai').expect
const Request = require('../../lib/request/HttpRequest')

describe('ErisDB.Request :: ', () => {

  let request

  before(() => {
    request = new Request(config.rpc)
    expect(request).to.be.an('object')
  })

  describe('transformResponse() :: ', () => {

    it('reject on non object', () => {
      return request
        .transformResponse()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong RPC response')
        })
    })

    it('reject on error', () => {
      return request
        .transformResponse({ error: 'This is error' })
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'This is error')
        })
    })

    it('reject on error as object', () => {
      return request
        .transformResponse({ error: { something: 1 } })
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('object')
            .and.to.have.property('something', 1)
        })
    })

    it('reject without result', () => {
      return request
        .transformResponse({})
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong RPC response')
        })
    })

    it('resolve only result', () => {
      return request
        .transformResponse({ result: true })
        .then((resp) => {
          expect(resp).to.be.true
        })
    })
  })

  describe('call() :: ', () => {

    it('should has call method', () => {
      expect(request.call).to.be.a('function')
    })

    it('reject if no method provided', () => {
      return request
        .call()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Please provide RPC method name')
        })
    })

    it('should return info', () => {
      return request
        .call('getNetworkInfo')
        .then((info) => {
          expect(info).to.be.an('object')
          expect(info).to.contain.all.keys([
            'client_version',
            'moniker'
          ])
        })
    })

  })

})
