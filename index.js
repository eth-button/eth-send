function getAccounts(rpc) {
  return rpc.sendAsync({
    method: "eth_accounts"
  });
}

function sendTransaction(rpc, from, to, value, options) {
  options = options || {};
  const params = {
    from: from,
    to: to,
    value: value
  };
  if (options.gas) {
    params.gas = options.gas;
  }
  if (options.gasPrice) {
    params.gasPrice = options.gasPrice;
  }
  if (options.data) {
    if (typeof options.data === "function") {
      params.data = options.data();
    } else {
      params.data = options.data;
    }
  }
  return rpc.sendAsync({
    method: "eth_sendTransaction",
    params: [params]
  });
}

function wait(delay) {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

function waitForTransaction(rpc, txid) {
  return rpc
    .sendAsync({
      method: "eth_getTransactionReceipt",
      params: [txid]
    })
    .then(function(res) {
      if (!res) {
        // poll every 1000 ms
        // TODO: timeout?
        return wait(1000).then(function() {
          return waitForTransaction(rpc, txid);
        });
      } else {
        return res;
      }
    });
}

/**
 * Sends the specified amount of Ether from the primary account to the
 * specified destination account.
 *
 * Additional options can be configured to provide better defaults to
 * the underlying rpc.  These are generally treated as defaults--MetaMask,
 * for example, provides the ability to override these when confirming
 * the transaction.
 *
 * @param  {web3} rpc       An rpc provider, such as `web3` or `ethjs-rpc`
 * @param  {String} to      The destination account address.  Should always
 *                          be a string with a leading `0x`
 * @param  {String} value   The value, in wei, to send.  As a string, it should
 *                          be in base 16 with a leading `0x`.
 * @param  {Object} options Additional options for customization:
 * @param  {String} options.gas            Default amount of gas to provide
 * @param  {String} options.gasPrice       Gas price to pay for the transaction
 * @param  {String|Function} options.data  Data to include in the transaction.
 *                                         If this is a function, this expects
 *                                         the function to return a string
 *                                         value.
 * @return {Promise}        A Promise that resolves when the transaction has
 *                          been mined, or rejects when any step in the process
 *                          fails.  The resolved value will be the
 *                          transaction's receipt.
 */
export default function ethSend(rpc, to, value, options) {
  return getAccounts(rpc)
    .then(function(accounts) {
      return sendTransaction(rpc, accounts[0], to, value, options);
    })
    .then(function(txid) {
      return waitForTransaction(rpc, txid);
    });
}
