'use strict'

const expect = require('chai').expect
const chance = new require('chance')() // eslint-disable-line

describe('Transactions :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.transactions).to.be.an('object')
    })

  })


})
