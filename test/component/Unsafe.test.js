'use strict'

const expect = require('chai').expect
const chance = new require('chance')() // eslint-disable-line
const solc = require('solc')
const config = require('../config')

describe('Unsafe :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.unsafe).to.be.an('object')
    })

  })

  describe('genPrivAccount() :: ', () => {

    it('should generate new private account', () => {
      return global.erisdb
        .unsafe
        .genPrivAccount()
        .then((account) => {
          expect(account).to.be.an('object')
            .and.to.contain.all.keys([
              'address', 'pub_key', 'priv_key'
            ])
        })
    })
  })

  describe('transact() :: ', () => {

    let account

    before(() => {
      return global.erisdb
        .unsafe
        .genPrivAccount()
        .then((newAcc) => {
          expect(newAcc).to.be.an('object')
            .and.to.contain.all.keys([
              'address', 'pub_key', 'priv_key'
            ])

          account = newAcc
        })
    })

    it('reject without privKey', () => {
      return global.erisdb
        .unsafe
        .transact()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'PrivKey is required parameter')
        })
    })

    it('reject without data', () => {
      return global.erisdb
        .unsafe
        .transact(account.priv_key[1])
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Data is required parameter')
        })
    })

    it('reject with not address', () => {
      return global.erisdb
        .unsafe
        .transact(account.priv_key[1], new Buffer('somedata').toString('hex'), 'I am not address')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address should be a valid address')
        })
    })

    it('should make a transaction', () => {
      const contract = `
      contract Sample {
        function add(int a, int b) constant returns (int sum) {
            sum = a + b;
        }
      }
      `
      const compiled = solc.compile(contract, 1).contracts['Sample']
      return global.erisdb
        .unsafe
        .transact(config.account.privKey, compiled.bytecode, '')
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'tx_hash', 'creates_contract', 'contract_addr'
            ])
        })
    })
  })

  describe('transactAndHold() :: ', () => {

    let account

    before(() => {
      return global.erisdb
        .unsafe
        .genPrivAccount()
        .then((newAcc) => {
          expect(newAcc).to.be.an('object')
            .and.to.contain.all.keys([
              'address', 'pub_key', 'priv_key'
            ])

          account = newAcc
        })
    })

    it('reject without privKey', () => {
      return global.erisdb
        .unsafe
        .transactAndHold()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'PrivKey is required parameter')
        })
    })

    it('reject without data', () => {
      return global.erisdb
        .unsafe
        .transactAndHold(account.priv_key[1])
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Data is required parameter')
        })
    })

    it('reject with not address', () => {
      return global.erisdb
        .unsafe
        .transactAndHold(account.priv_key[1], new Buffer('somedata').toString('hex'), 'I am not address')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address should be a valid address')
        })
    })

    xit('should make a transaction', () => {
      const contract = `
      contract Sample {
        function add(int a, int b) constant returns (int sum) {
            sum = a + b;
        }
      }
      `
      const compiled = solc.compile(contract, 1).contracts['Sample']
      return global.erisdb
        .unsafe
        .transactAndHold(config.account.privKey, compiled.bytecode, config.account.address)
        .then((info) => {
          console.log('==========================')
          console.log(info)
          console.log('==========================')
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'tx_hash', 'creates_contract', 'contract_addr'
            ])
        })
    })
  })

  describe('transactNameReg() :: ', () => {

    let account

    before(() => {
      return global.erisdb
        .unsafe
        .genPrivAccount()
        .then((newAcc) => {
          expect(newAcc).to.be.an('object')
            .and.to.contain.all.keys([
              'address', 'pub_key', 'priv_key'
            ])

          account = newAcc
        })
    })

    it('reject without privKey', () => {
      return global.erisdb
        .unsafe
        .transactNameReg()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'PrivKey is required parameter')
        })
    })

    it('reject without data', () => {
      return global.erisdb
        .unsafe
        .transactNameReg(account.priv_key[1])
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Data is required parameter')
        })
    })

    it('reject without name', () => {
      return global.erisdb
        .unsafe
        .transactNameReg(account.priv_key[1], new Buffer('somedata').toString('hex'), '')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Name is required parameter')
        })
    })

    xit('should make a transaction', () => {
      const contract = `
      contract Sample {
        function add(int a, int b) constant returns (int sum) {
            sum = a + b;
        }
      }
      `
      const compiled = solc.compile(contract, 1).contracts['Sample']
      return global.erisdb
        .unsafe
        .transactNameReg(config.account.privKey, compiled.bytecode, 'test', 10)
        .then((info) => {
          console.log('==========================')
          console.log(info)
          console.log('==========================')
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'tx_hash', 'creates_contract', 'contract_addr'
            ])
        })
    })
  })
})
