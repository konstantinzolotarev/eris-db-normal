'use strict'

const expect = require('chai').expect
const solc = require('solc')
const config = require('../config')

describe('Transaction.sendTransaction :: ', () => {

  const SampleContract = `
contract SampleContract {
  function add(int a, int b) constant returns (int sum) {
    sum = a + b;
  }
}
  `

  const compiled = solc.compile(SampleContract, 1).contracts['SampleContract']
  // const abi = JSON.parse(compiled.interface)

  let tx
  let txForSigning

  before(() => {
    tx = {
      // data: new Buffer(JSON.stringify({
      //   value: 1000,
      //   data: compiled.bytecode.toUpperCase()
      // })).toString('hex').toUpperCase(),
      data: compiled.bytecode.toUpperCase(),
      input: {
        address: config.account.address
      }
    }
  })

  it('reject without tx', () => {
    return global.erisdb
      .transactions
      .sendTransaction()
      .then(() => Promise.reject())
      .catch((err) => {
        expect(err).to.be.an('error')
          .and.to.have.property('message', 'Transaction is required parameter')
      })
  })

  it('reject with wrong tx', () => {
    return global.erisdb
      .transactions
      .sendTransaction({})
      .then(() => Promise.reject())
      .catch((err) => {
        expect(err).to.be.an('error')
          .and.to.have.property('message', 'Transaction is required parameter')
      })
  })

  it('reject without privKey', () => {
    return global.erisdb
      .transactions
      .sendTransaction(tx)
      .then(() => Promise.reject())
      .catch((err) => {
        expect(err).to.be.an('error')
          .and.to.have.property('message', 'PrivKey is required parameter')
      })
  })

  it('reject with wrong privKey', () => {
    return global.erisdb
      .transactions
      .sendTransaction(tx, 'not-priv-key')
      .then(() => Promise.reject())
      .catch((err) => {
        expect(err).to.be.an('error')
          .and.to.have.property('message', 'PrivKey is required parameter')
      })
  })

  it('should send transaction', () => {
    return global.erisdb
      .transactions
      .sendTransaction(tx, config.account.privKey)
      .then((info) => {
        expect(info).to.be.an('object')
          .and.to.contain.all.keys([
            'call_data', 'tx_id', 'return', 'origin'
          ])

        expect(info.call_data).to.be.an('object')
          .and.to.contain.all.keys([
            'caller', 'callee', 'data', 'value', 'gas'
          ])

        expect(info.call_data.data).to.be
          .eq(compiled.bytecode.toUpperCase())
      })
  })
})
