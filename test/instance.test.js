'use strict'

const expect = require('chai').expect
const eris = require('../index')
const config = require('./config')

describe('createInstance() :: ', () => {

  it('throw Error if no rpc url', () => {
    const func = () => {
      eris.createInstance()
    }
    expect(func).to.throw(Error, 'No RPC URL passed')
  })

  it('should create ErisDB class', () => {
    expect(eris.createInstance(config.rpc)).to.be.an('object')
  })
})
