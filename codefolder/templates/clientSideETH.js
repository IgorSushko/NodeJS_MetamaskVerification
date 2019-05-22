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
/*  function include(url) {
  var script = document.createElement('script');
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
  }  */

function parseBalance(data) {
  const t1 = JSON.stringify(data.Balance);
  const obj = JSON.parse(t1);
  return obj;
}

function parseTransaction(data) {
  const t1 = JSON.stringify(data.TransactionDetails);
  const obj = JSON.parse(t1);
  return obj;
}

async function initIO() {
  const socket = io.connect('http://localhost:62001');
  return socket;
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
        value: web3.toWei('0.0025', 'ether'),
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

async function testServer() {
  const socket = await initIO();
  socket.on('TransactionDetails', function (data) {
    console.log('SOCKET TransactionData from ServerSide :', data);
    let transactionResultS = parseTransaction(data);
    document.getElementById('transactionResultFromServer').style.visibility = 'visible';
    document.getElementById('transactionResultFromServer').innerText ='TransactionResult from Server :' + transactionResultS.toString();
  })
  const testReceipt = {
    blockHash: "0x2a799e8be4f0e62fe540966605e6c675aa968212b173877dedbd0ba425def182",
    blockNumber: 5648440,
    contractAddress: null,
    cumulativeGasUsed: 2190990,
    from: "0xc61a35fc5ca15d5ccb7038238771d90fd7a3d0c4",
    gasUsed: 21000,
    status: "0x1",
    to: "0x250ce03d2f095fe3482fb237a23e172af08fbf5c",
    transactionHash: "0x3396aab60a1eb23286643330c5dc421a5743414d254e6cee2cf14724c36d2bda",
    transactionIndex: 26
  }
  socket.emit('Receipt', { Receipt: testReceipt });
}
async function payEther() {
  document.getElementById('transactionError').style.visibility = 'visible';
  document.getElementById('transactioninprogress').style.visibility = 'visible';
  const getfromserver = await getAdrressFromServer();
  console.log('getfromserver: ', getfromserver);
  const socket = await initIO();

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
    //socket.on('news', function (data) {
     // console.log(data);

    //});
    socket.on('Balance', function (data) {
      console.log('SOCKET BalanceFromClient: ', data);
      let balanceResult = parseBalance(data);
      document.getElementById('transactionError').style.visibility = 'visible';
      document.getElementById('transactionError').innerText ='Balance on remote wallet :' + balanceResult.toString();
    })

    socket.on('TransactionDetails', function (data) {
      console.log('SOCKET TransactionData from ServerSide :', data);
      let transactionResultS = parseTransaction(data);
      document.getElementById('transactionResultFromServer').style.visibility = 'visible';
      document.getElementById('transactionResultFromServer').innerText ='TransactionResult from Server :' + transactionResultS.toString();
    })

    socket.emit('Receipt', { Receipt: receipt });
    console.log('SOCKET Receipt: ', receipt);

  } catch (err) {
    console.log('Try was corrupted: ', err);
    document.getElementById('transactioninprogress').style.visibility = 'hidden';
    document.getElementById('transactionError').style.visibility = 'visible';
    document.getElementById('transactionError').innerText = err.toString();
  }
}
// https://medium.com/@dan_43404/handling-metamask-rejections-532a4a41caf
