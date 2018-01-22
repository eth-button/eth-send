# eth-send

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

An extremely compact library for sending Ethereum.

## `ethSend`

`ethSend` is has a very simple API, that manages creating and sending a transaction on the Ethereum network (via MetaMask or Mist).

`ethSend(rpc, to, value, options)`

* `rpc` - An instance of a `web3` or compatible rpc client.
* `to` - The destination address.  This should be a properly formatted Ethereum address, with leading `0x`
  * Example: `0xd2f4668D0e752e95a8CE01014233458471DDbA4B`
* `value` - The value to send, in wei.  This should be a `String`.  The underlying number should be converted to hexadecimal (base 16) and have a leading `0x`
* `options` - A hash of extra options for the transaction.
  * `options.gas` - The default amount of gas to send with the transaction.  For a simple send, this defaults to `21000`
  * `options.gasPrice` - The default price to pay for gas.  When using Mist or MetaMask, the user should have the option of overriding this.
  * `options.data` - *(advanced usage)* Data to send with the transaction.  When interacting with a contract, this contains the information necessary to call functions and pass information to the contract.  For simple sends (sends to basic addresses), this data is ignored.  See [web3#sendTranaction](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction) for more information.

## Example Usage

```
import ethSend from 'eth-send';
import Web3 from 'web3';
import BigNumber from "bignumber.js";

const web3 = new Web3(window.web3.currentProvider);
const ETHER = new BigNumber("1000000000000000000");

ethSend(
  web3,
  '0xd2f4668D0e752e95a8CE01014233458471DDbA4B',
  ['0x', new BigNumber('0.5').times(ETHER).floor().toStringn(16)].join(''),
  {
    gas: '21000',
    gasPrice: '1000000000',
    data: 'Donation!'
  }
);
```
