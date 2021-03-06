async function getAdrressFromServer() {
  const response = await fetch('http://localhost:62001/restapi/getadress', {});
  const json = await response.json();
  return json.adress;
}


async function getUrlFromServer() {
  const response = await fetch('http://localhost:62001/restapi/getlink', {});
  const json = await response.json();
  return json.bookurl;
}

async function generateDownloadLink() {
  const link = await getUrlFromServer();
  console.log('link: ', link);
  const str = 'Press here to download';
  const result = str.link(link);
  document.getElementById('downloadlink').innerHTML = result;
  document.getElementById('downloadlink').style.visibility = 'visible';
  document.getElementById('downloadlinkdescription').style.visibility = 'visible';
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
      document.getElementById('transactionResultFromServer').innerText ='Verification from server :  ' + transactionResultS.toString();
      if (transactionResultS == 'Transaction approved by server') { generateDownloadLink() };
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
