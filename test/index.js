'use strict'

const expect = require('chai').expect
const eris = require('../index')

describe('createInstance() :: ', () => {

  it('throw Error if no rpc url', () => {
    const func = () => {
      eris.createInstance()
    }
    expect(func).to.throw(Error, 'No RPC URL passed')
  })

  it('should create ErisDB class', () => {
    expect(eris.createInstance('http://localhost:1337/rpc')).to.be.an('object')
  })
})
