'use strict'

const ErisFactory = require('./index')

const eris = ErisFactory.createInstance('ws://127.0.0.1:1337/socketrpc')

setTimeout(() => {

  eris.events
    .addEventListener('Log/05E334C3F38C342DE397F8AB6D5B86F7CDFDD91A', (data) => {
      console.log('==========================')
      console.log(data)
      console.log('==========================')
    })
    .then(() => console.log('Subscribed'))
    .catch((err) => console.warn(err))

}, 1000)
