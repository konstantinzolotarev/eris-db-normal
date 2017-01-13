'use strict'

const expect = require('chai').expect

describe('Consensus :: ', () => {

  describe('component :: ', () => {

    it('should exist', () => {
      expect(global.erisdb.consensus).to.be.an('object')
    })

  })

  describe('getConsensusState() :: ', () => {

    it('should load current state', () => {
      return global.erisdb
        .consensus
        .getConsensusState()
        .then((state) => {
          expect(state).to.be.an('object')
            .and.to.contain.all.keys([
              'height', 'round', 'step', 'start_time',
              'commit_time', 'validators', 'proposal'
            ])

          expect(state.validators).to.be.an('array')
        })
    })

  })

  describe('getValidators() :: ', () => {

    it('should load list of validators', () => {
      return global.erisdb
        .consensus
        .getValidators()
        .then((validators) => {
          // TODO: recheck later.
          // {@link https://monax.io/docs/documentation/db/latest/specifications/api/#get-validators}
          expect(validators).to.be.an('array')
        })
    })
  })

})
