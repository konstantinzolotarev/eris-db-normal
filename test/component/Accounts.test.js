'use strict'

const expect = require('chai').expect

describe('Accounts :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.accounts).to.be.an('object')
    })

  })

  describe('getAccounts() :: ', () => {

    it('should load all accounts')

    it('should add filters')

  })

  describe('getAccount() :: ', () => {

    it('reject without address')

    it('reject with non existing address')

    it('should load account details')

  })

  describe('getStorage() :: ', () => {

    it('reject without address')

    it('reject with non existing account')

    it('should load storage for account')

  })

  describe('getStorageAt() :: ', () => {

    it('reject without address')

    it('reject with non existing address')

    it('reject without key')

    it('should load for address/key')

  })
})
