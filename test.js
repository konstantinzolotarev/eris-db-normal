'use strict'

const ErisFactory = require('./index')

const eris = ErisFactory.createInstance('ws://127.0.0.1:1337/socketrpc')

setTimeout(() => {

  eris.events.on('Log/05E334C3F38C342DE397F8AB6D5B86F7CDFDD91A', (data) => {
    console.log('==========================')
    console.log(data)
    console.log('==========================')
  })

  eris.events.on('subscribed', (data) => {
    console.log('subscribed')
  })

  eris.events.on('errorSubscription', (data) => {
    console.log('Error subscription', data)
  })

}, 1000)
