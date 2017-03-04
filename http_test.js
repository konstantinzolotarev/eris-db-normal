'use strict'

const ErisFactory = require('./index')

const eris = ErisFactory.createInstance('http://127.0.0.1:1337/rpc')

eris.events.eventSubscribe('Log/05E334C3F38C342DE397F8AB6D5B86F7CDFDD91A')
  .then((subId) => {
    if (!subId)
      return

    setInterval(() => {
      eris.events.eventPoll(subId)
        .then(console.log)
    }, 1000)
  })
  .catch(console.warn)
