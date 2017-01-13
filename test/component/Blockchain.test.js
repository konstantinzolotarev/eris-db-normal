'use strict'

const expect = require('chai').expect
const chance = new require('chance')() // eslint-disable-line

describe('Blockchain :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.blockchain).to.be.an('object')
    })

  })

  describe('getBlockchainInfo() :: ', () => {

    it('should load info', () => {
      return global.erisdb
        .blockchain
        .getBlockchainInfo()
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'chain_id', 'genesis_hash',
              'latest_block', 'latest_block_height'
            ])
        })
    })

  })

  describe('getChainId() :: ', () => {

    it('should load chain id', () => {
      return global.erisdb
        .blockchain
        .getChainId()
        .then((info) => {
          expect(info).to.be.an('string')
            .and.to.have.length.above(1)
        })
    })

  })

  describe('getGenesisHash() :: ', () => {

    it('should load info', () => {
      return global.erisdb
        .blockchain
        .getGenesisHash()
        .then((info) => {
          expect(info).to.be.an('string')
            .and.to.have.length.above(1)
        })
    })

  })

  describe('getLatestBlockHeight() :: ', () => {

    it('should load height', () => {
      return global.erisdb
        .blockchain
        .getLatestBlockHeight()
        .then((info) => {
          expect(info).to.be.an('number')
        })
    })

  })

  describe('getLatestBlock() :: ', () => {

    it('should load last block', () => {
      return global.erisdb
        .blockchain
        .getLatestBlock()
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'header', 'data'
            ])
        })
    })

  })

  describe('getBlocks() :: ', () => {

    it('reject on wrong filters', () => {
      return global.erisdb
        .blockchain
        .getBlocks([{}])
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong filters format')
        })
    })

    it('should load blocks', () => {
      return global.erisdb
        .blockchain
        .getBlocks()
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'min_height', 'max_height', 'block_metas'
            ])

          expect(info.block_metas).to.be.an('array')
            .and.to.have.length.above(0)
        })
    })

  })

  describe('getBlock() :: ', () => {

    it('reject without height', () => {
      return global.erisdb
        .blockchain
        .getBlock()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Height is required parameter')
        })
    })

    it('shuold load block', () => {
      return global.erisdb
        .blockchain
        .getBlock(1)
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'header', 'data'
            ])
        })
    })
  })

})
