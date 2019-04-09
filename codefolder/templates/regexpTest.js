async function getAdrressFromServer() {
  const response = await fetch('http://localhost:62001/restapi/getadress', {});
  const json = await response.json();
  return json.adress;
}

function getTransactionReceiptPromise(hash) {
  // here we just promisify getTransactionReceipt function for convenience
  return new Promise(((resolve, reject) => {
    web3.eth.getTransactionReceipt(hash, (err, data) => {
      if (err !== null) reject(err);
      else resolve(data);
    });
  }));
}

function wait(milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds));
}

function sendTransaction(getfromserver) {
  return new Promise((resolve, reject) => {
    const sender = currentUser.account;
    const waitforhash = web3.eth.sendTransaction(
      {
        to: getfromserver,
        from: sender,
        value: web3.toWei('0.025', 'ether'),
      }, (err, hash) => {
        if (err) {
          reject(err);
        }
        console.log('after transaction: ', hash);
        resolve(hash);
      },
    );
  });
}

async function payEther() {
  document.getElementById('transactionError').style.visibility = 'visible';
  document.getElementById('transactioninprogress').style.visibility = 'visible';
  const getfromserver = await getAdrressFromServer();
  console.log('getfromserver: ', getfromserver);
  try {
    const globalhash = await sendTransaction(getfromserver);
    let receipt = null;
    console.log('receipt inside');
    while (receipt === null) {
      // we are going to check every second if transation is mined or not, once it is mined we'll leave the loop
      receipt = await getTransactionReceiptPromise(globalhash);
      console.log('receipt inside loop');
      await wait(1000);
    }
    document.getElementById('transactionresult').style.visibility = 'visible';
    document.getElementById('transactioninprogress').style.visibility = 'hidden';
    console.log('Receipt: ', receipt);
  } catch (err) {
    console.log('Try was corrupted: ', err);
    document.getElementById('transactioninprogress').style.visibility = 'none';
    document.getElementById('transactionError').style.visibility = 'visible';
    document.getElementById('transactionError').innerText = err.toString();
  }
}
// https://medium.com/@dan_43404/handling-metamask-rejections-532a4a41caf
