var globalhash;

function makehashglobal(hash) {
  globalhash = hash;
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

async function payEther() {
  document.getElementById('transactioninprogress').style.visibility = 'visible';
  const datas = document.getElementById('hiddenadress').textContent;
  console.log('adress from page', datas);
  //const receiver = '0x250ce03d2f095fe3482fb237a23e172af08fbf5c';
  const sender = currentUser.account;
  const waitforhash = web3.eth.sendTransaction(
    {
      to: datas,
      from: sender,
      value: web3.toWei('0.025', 'ether')
    }, function (err, hash) {
      console.log('after transaction: ', hash);
      makehashglobal(hash);
    }
  );
  while (globalhash === undefined) {
    // we are going to check every second if transation is mined or not, once it is mined we'll leave the loop
    console.log('from the loop: ', waitforhash);
    await wait(1000);
  }
  console.log('globalhash: ', globalhash);

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
}
