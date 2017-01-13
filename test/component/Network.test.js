'use strict'

const expect = require('chai').expect

describe('Network component :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.network).to.be.an('object')
    })

  })

  describe('getInfo() :: ', () => {

    it('should load info', () => {
      return global.erisdb.network
        .getInfo()
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'client_version',
              'moniker'
            ])
        })
    })
  })

  describe('getClientVersion() :: ', () => {

    it('shuold return client version', () => {
      return global.erisdb
        .network
        .getClientVersion()
        .then((version) => {
          expect(version).to.be.an('object')
            .and.to.have.property('client_version')
        })
    })

  })

  describe('getMoniker() :: ', () => {

    it('should fetch moniker', () => {
      return global.erisdb
        .network
        .getMoniker()
        .then((moniker) => {
          expect(moniker).to.be.an('object')
            .and.to.have.property('moniker')
        })
    })
  })

  describe('isListening() :: ', () => {

    it('should fetch listening', () => {
      return global.erisdb
        .network
        .isListening()
        .then((listening) => {
          expect(listening).to.be.a('boolean')
        })
    })
  })

  describe('getListeners() :: ', () => {

    it('should load array', () => {
      return global.erisdb
        .network
        .getListeners()
        .then((listeners) => {
          expect(listeners).to.be.an('array')
        })
    })

  })

  describe('getPeers() :: ', () => {

    it('should load array', () => {
      return global.erisdb
        .network
        .getPeers()
        .then((peers) => {
          expect(peers).to.be.an('array')
        })
    })

  })

  describe('getPeer() :: ', () => {

    let address = '1431A2D608CF9F1462C21E1FE749A7FA13F3B137'

    it('reject without address', () => {
      return global.erisdb
        .network
        .getPeer()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    xit('should load peer', () => {
      return global.erisdb
        .network
        .getPeer(address)
        .then((peer) => {
          expect(peer).to.be.an('object')
            .and.to.contain.all.keys([
              'is_outbound',
              'moniker',
              'chain_id',
              'version',
              'host',
              'p2p_port',
              'rpc_port'
            ])
        })
    })
  })
})
