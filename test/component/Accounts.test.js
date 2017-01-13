'use strict'

const expect = require('chai').expect
const chance = new require('chance')() // eslint-disable-line

describe('Accounts :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.accounts).to.be.an('object')
    })

  })

  describe('getAccounts() :: ', () => {

    it('should load all accounts', () => {
      return global.erisdb
        .accounts
        .getAccounts()
        .then((accounts) => {
          expect(accounts).to.be.an('array')
            .and.to.have.length.above(0)

          expect(accounts[0]).to.be.an('object')
            .and.to.have.property('address', '0000000000000000000000000000000000000000')

          expect(accounts[0]).to.contain.all.keys([
            'address', 'pub_key', 'sequence', 'balance',
            'code', 'storage_root', 'permissions'
          ])
        })
    })

    it('reject if wrong filters passed', () => {
      return global.erisdb
        .accounts
        .getAccounts({})
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong filters format')
        })
    })

    it('reject if one filter is incorrect', () => {
      const filters = [
        { field: 'balance', 'op': '>', 'value': '0' },
        { field: 'balance', 'op': '>' }
      ]
      return global.erisdb
        .accounts
        .getAccounts(filters)
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong filters format')
        })
    })

    it('should add filters', () => {
      const filters = [
        { field: 'balance', 'op': '>', 'value': '1000' }
      ]
      return global.erisdb
        .accounts
        .getAccounts(filters)
        .then((accounts) => {
          expect(accounts).to.be.an('array')
            .and.to.have.length.above(0)

          expect(accounts[0]).to.be.an('object')
            .and.to.have.property('address', '0000000000000000000000000000000000000000')

          expect(accounts[0]).to.contain.all.keys([
            'address', 'pub_key', 'sequence', 'balance',
            'code', 'storage_root', 'permissions'
          ])

          expect(accounts[0].balance).to.be.above(1000)
        })
    })

  })

  describe('getAccount() :: ', () => {

    let account

    before(() => {
      return global.erisdb
        .accounts
        .getAccounts()
        .then((accounts) => {
          expect(accounts).to.be.an('array')
            .and.to.have.length.above(0)

          account = accounts[0]

          expect(account).to.contain.all.keys([
            'address', 'pub_key', 'sequence', 'balance',
            'code', 'storage_root', 'permissions'
          ])
        })
    })

    it('reject without address', () => {
      return global.erisdb
        .accounts
        .getAccount()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    it('should return obj with non existing address', () => {
      const wrongAccount = chance.string({ length: 40, 'pool': 'abcdef1234567890' })
      return global.erisdb
        .accounts
        .getAccount(wrongAccount)
        .then((obj) => {
          expect(obj).to.be.an('object')
            .and.to.contain.all.keys([
              'address', 'pub_key', 'sequence', 'balance',
              'code', 'storage_root', 'permissions'
            ])
        })
    })

    it('should load account details', () => {
      return global.erisdb
        .accounts
        .getAccount(account.address)
        .then((obj) => {
          expect(obj).to.be.an('object')
            .and.to.contain.all.keys([
              'address', 'pub_key', 'sequence', 'balance',
              'code', 'storage_root', 'permissions'
            ])
        })
    })

  })

  describe('getStorage() :: ', () => {

    let account

    before(() => {
      return global.erisdb
        .accounts
        .getAccounts()
        .then((accounts) => {
          expect(accounts).to.be.an('array')
            .and.to.have.length.above(0)

          account = accounts[0]

          expect(account).to.contain.all.keys([
            'address', 'pub_key', 'sequence', 'balance',
            'code', 'storage_root', 'permissions'
          ])
        })
    })

    it('reject without address', () => {
      return global.erisdb
        .accounts
        .getStorage()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    it('should return empty storage with non existing account', () => {
      const wrongAccount = chance.string({ length: 40, 'pool': 'abcdef1234567890' })
      return global.erisdb
        .accounts
        .getStorage(wrongAccount)
        .then((storage) => {
          expect(storage).to.be.an('object')
            .and.to.contain.all.keys([
              'storage_root', 'storage_items'
            ])

          expect(storage.storage_root).to.be.a('string')
          expect(storage.storage_items).to.be.a('array')
        })
    })

    it('should load storage for account', () => {
      return global.erisdb
        .accounts
        .getStorage(account.address)
        .then((storage) => {
          expect(storage).to.be.an('object')
            .and.to.contain.all.keys([
              'storage_root', 'storage_items'
            ])

          expect(storage.storage_root).to.be.a('string')
          expect(storage.storage_items).to.be.a('array')
        })
    })

  })

  describe('getStorageAt() :: ', () => {

    let account

    before(() => {
      return global.erisdb
        .accounts
        .getAccounts()
        .then((accounts) => {
          expect(accounts).to.be.an('array')
            .and.to.have.length.above(0)

          account = accounts[0]

          expect(account).to.contain.all.keys([
            'address', 'pub_key', 'sequence', 'balance',
            'code', 'storage_root', 'permissions'
          ])
        })
    })

    it('reject without address', () => {
      return global.erisdb
        .accounts
        .getStorageAt()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    it('reject without key', () => {
      return global.erisdb
        .accounts
        .getStorageAt(account.address)
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Key is required parameter')
        })
    })

    it('reject with non hex key', () => {
      return global.erisdb
        .accounts
        .getStorageAt(account.address, 'test')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Key is required parameter')
        })
    })

    it('should load for non existing address/key', () => {
      const wrongAccount = chance.string({ length: 40, 'pool': 'abcdef1234567890' })
      const key = new Buffer('test').toString('hex')
      return global.erisdb
        .accounts
        .getStorageAt(wrongAccount, key)
        .then((data) => {
          expect(data).to.be.an('object')
            .and.to.contain.all.keys([
              'key', 'value'
            ])

          expect(data.key).to.be.eql(key)
          expect(data.value).to.be.a('string')
        })
    })

    it('should load for address/key', () => {
      const key = new Buffer('test').toString('hex')
      return global.erisdb
        .accounts
        .getStorageAt(account.address, key)
        .then((data) => {
          expect(data).to.be.an('object')
            .and.to.contain.all.keys([
              'key', 'value'
            ])

          expect(data.key).to.be.eql(key)
          expect(data.value).to.be.a('string')
        })
    })

  })
})
