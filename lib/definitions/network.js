'use strict'

const definition = {

  getInfo: {
    method: 'getNetworkInfo'
  }

}

module.exports = class Network {

  coinstructor (eris) {
    this._eris = eris
  }
}
