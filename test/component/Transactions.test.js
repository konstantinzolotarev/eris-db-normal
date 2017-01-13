'use strict'

const expect = require('chai').expect
const chance = new require('chance')() // eslint-disable-line
const crypto = require('tendermint-crypto')
const config = require('../config')
const _ = require('lodash')

describe('Transactions :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.transactions).to.be.an('object')
    })

  })

  describe('sign() :: ', () => {

    const wrongAccount = chance.string({ length: 40, 'pool': 'abcdef1234567890' })

    it('reject without tx', () => {
      return global.erisdb
        .transactions
        .sign()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Transaction is required parameter')
        })
    })

    it('reject without privateKey', () => {
      return global.erisdb
        .transactions
        .sign({})
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'PrivKey is required parameter')
        })
    })

    it('should return signed tx', () => {
      const privKey = crypto.genPrivKeyEd25519()
      const tx = { test: 1 }
      return global.erisdb
        .transactions
        .sign(tx, privKey.toJSON()[1])
        .then((signed) => {
          expect(signed).to.be.a('array')
            .and.to.have.lengthOf(2)

          expect(signed[0]).to.be.eql(0x01)
          expect(signed[1]).to.be.a('string')

          const sig = new crypto.SignatureEd25519(new Buffer(signed[1], 'hex'))
          const pubKey = privKey.makePubKey()
          expect(pubKey.verifyString(JSON.stringify(tx), sig)).to.be.true
        })
    })
  })

  describe('broadcastTx() :: ', () => {

    let accounts
    let chainId
    let user

    before(() => {
      return global.erisdb
        .unsafe
        .genPrivAccount()
        .then((newAcc) => {
          expect(newAcc).to.be.an('object')
            .and.to.contain.all.keys([
              'address', 'pub_key', 'priv_key'
            ])

          user = newAcc
        })
    })

    before(() => {
      return global.erisdb
        .accounts
        .getAccounts()
        .then((list) => {
          expect(list).to.be.an('array')
            .and.to.have.length.above(1)

          accounts = list
        })
        .then(() => global.erisdb.blockchain.getChainId())
        .then((chain) => {
          expect(chain).to.be.a('string')
          chainId = chain
        })
    })

    it('reject without transaction', () => {
      return global.erisdb
        .transactions
        .broadcastTx()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Transaction is required parameter')
        })
    })

    xit('should broadcast tx', () => {
      const tx = {
        inputs: [
          {
            address: user.address,
            amount: 101,
            sequence: 1,
            pub_key: user.pub_key
          }
        ],
        outputs: [
          {
            address: accounts[0].address,
            amount: 100
          }
        ]
      }
      const txForSign = {
        chain_id: chainId,
        tx: [
          2,
          _.cloneDeep(tx)
        ]
      }
      return global.erisdb
        .transactions
        .sign(txForSign, config.account.privKey)
        .then((signed) => {
          tx.inputs[0].signature = signed
        })
        .then(() => {
          return global.erisdb
            .transactions
            .broadcastTx(tx)
        })
        .then((data) => {
          expect(data).to.be.an('object')
            .and.to.contain.all.keys([
              'tx_hash',
              'creates_contract',
              'contract_addr'
            ])
        })
    })

  })

  describe('getUnconfirmedTxs() :: ', () => {

    it('load list of unconfirmed transactions', () => {
      return global.erisdb
        .transactions
        .getUnconfirmedTxs()
        .then((list) => {
          expect(list).to.be.an('array')
        })
    })

  })

  describe('call() :: ', () => {

    it('reject without address', () => {
      return global.erisdb
        .transactions
        .call()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    it('reject without data', () => {
      return global.erisdb
        .transactions
        .call(chance.string({ length: 40, 'pool': 'abcdef1234567890' }))
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Data is required parameter')
        })
    })

    it('reject with non HEX data', () => {
      return global.erisdb
        .transactions
        .call(chance.string({ length: 40, 'pool': 'abcdef1234567890' }), 'test')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Data is required parameter')
        })
    })

    it('should make a call')

  })

  describe('callCode() :: ', () => {

    it('reject without address', () => {
      return global.erisdb
        .transactions
        .callCode()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    it('reject without data', () => {
      return global.erisdb
        .transactions
        .callCode(chance.string({ length: 40, 'pool': 'abcdef1234567890' }))
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Data is required parameter')
        })
    })

    it('reject with non HEX data', () => {
      return global.erisdb
        .transactions
        .callCode(chance.string({ length: 40, 'pool': 'abcdef1234567890' }), 'test')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Data is required parameter')
        })
    })
  })

})
