'use strict'

const ErisFactory = require('./index')

const eris = ErisFactory.createInstance('ws://127.0.0.1:1337/socketrpc')

setTimeout(() => {
  eris.accounts.getAccounts()
    .then(console.log)
}, 1000)
