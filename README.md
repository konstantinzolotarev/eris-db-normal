# ErisDB Promise JS lib (Alpha)

This is JavaScript JSON-RPC 2.0 client library for ErisDB

## Installation

### Prerequisites
You will need `ErisDB` installed and running
Also this library is using ES6 so you will have to use node.js > `4.0.0`

### Installing node module

```bash
$ npm i --save eris-db-promise
```

## Usage

Finding out ErisDB IP
```bash
$ eris chains inspect <name of ErisDB server> NetworkSettings.IPAddress
```

After that you will be able to create new instance of library:

```javascript
const erisFactory = require('eris-db-promise')
// For base HTTP JSON RPC
const erisDb = erisFactory.createInstance('http://<Your IP Address>:1337/rpc')
// For WebSocket RPC client
const erisDb = erisFactory.createInstance('ws://<Your IP Address>:1337/socketrpc')
```

This library uses `Promise` so all methods will return promises:

```javascript
erisDb.accounts
  .getAccounts()
  .then((list) => {
    // working with list of accounts
  })
```

## API Reference

Library contains this components:

| Component Name | Accessor |
| :------------- | :------- |
| Accounts | [ErisDB.accounts](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/Accounts.js) |
| Blockchain | [ErisDB.blockchain](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/Blockchain.js) |
| Consensus | [ErisDB.consensus](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/Consensus.js) |
| Events | [ErisDB.events](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/Events.js) |
| NameReg | [ErisDB.namereg](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/NameReg.js) |
| Network | [ErisDB.network](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/Network.js) |
| Transactions | [ErisDB.transactions](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/Transactions.js) |
| Unsafe | [ErisDB.unsafe](https://github.com/konstantinzolotarev/eris-db-promise/blob/master/lib/components/Unsafe.js) |


All methods are made using documentation [here](https://monax.io/docs/documentation/db/latest/specifications/api/)

All methods usages are described in [tests](https://github.com/konstantinzolotarev/eris-db-promise/tree/master/test/component)

## Browser usage

This library has browser version into `dist/index.js` you could download it and use in browser.
Example of usage is into `dist/index.html`

## Signing transactions
This library includes transaction signing mechanism.

Sample:

```javascript
const tx = {
  inputs: [
    {
      address: user.address,
      amount: 101,
      sequence: 1,
      pub_key: user.pub_key
    }
  ],
  outputs: [
    {
      address: other_account.address,
      amount: 100
    }
  ]
}
const txForSign = {
  chain_id: 'chainIdHere',
  tx: [
    2,
    _.cloneDeep(tx)
  ]
}
erisdb.transactions
  .sign(txForSign, config.account.privKey)
  .then((signed) => {
    tx.inputs[0].signature = signed
  })
  .then(() => {
    return global.erisdb
      .transactions
      .broadcastTx(tx)
  })
```
