'use strict'

const expect = require('chai').expect

describe('NameReg :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.namereg).to.be.an('object')
    })

  })

  describe('getNameRegEntry() :: ', () => {

    it('reject without name', () => {
      return global.erisdb
        .namereg
        .getNameRegEntry()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Name is required parameter')
        })
    })

    it('reject on non existing name', () => {
      const name = 'test'

      return global.erisdb
        .namereg
        .getNameRegEntry(name)
        .catch((err) => {
          expect(err).to.be.an('object')
            .and.to.have.property('message', 'Entry test not found')
        })
    })

    xit('should load info', () => {
      const name = 'test'

      return global.erisdb
        .namereg
        .getNameRegEntry(name)
        .then((info) => {
          console.log('==========================')
          console.log(info)
          console.log('==========================')
        })
    })
  })

  describe('getNameRegEntries() :: ', () => {

    it('reject on wrong filters', () => {
      return global.erisdb
        .namereg
        .getNameRegEntries([{}])
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Wrong filters format')
        })
    })

    it('load list of entries', () => {
      return global.erisdb
        .namereg
        .getNameRegEntries()
        .then((entries) => {
          expect(entries).to.be.an('object')
            .and.to.contain.all.keys([
              'block_height', 'names'
            ])

          expect(entries.names).to.be.an('array')
        })
    })

  })
})
