'use strict'

const expect = require('chai').expect

describe('Events :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.events).to.be.an('object')
    })

  })

})
