'use strict'

const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()

myEmitter.on('newListener', (event, listener) => {
  console.log('==========================')
  console.log(event)
  console.log('==========================')
})

myEmitter.on('removeListener', (event) => {
  console.log('==========================')
  console.log('end', event)
  console.log('==========================')
})

setTimeout(() => {
  myEmitter.on('test', console.log)

  myEmitter.emit('test', 'teststes')

  myEmitter.removeAllListeners('test')
}, 1000)
