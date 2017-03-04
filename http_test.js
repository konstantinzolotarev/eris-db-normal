'use strict'

const ErisFactory = require('./index')

const eris = ErisFactory.createInstance('http://127.0.0.1:1337/rpc')

eris.events.eventSubscribe('NewBlock')
  .then((subId) => {
    if (!subId)
      return

    setInterval(() => {
      eris.events.eventPoll(subId)
        .then(console.log)
    }, 1000)
  })
  .catch(console.warn)
