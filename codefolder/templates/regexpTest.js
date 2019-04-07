var globalhash;

function makehashglobal(hash) {
  globalhash = hash;
}

/* function getAdrressFromServer() {
  var adr = '';
  fetch('http://localhost:62001/restapi/getadress')
       .then(res => res.json())
       .then((resData) => {adr = resData})
       .catch(err => console.log('ResData Error: ', err));
       return adr;
}  */

async function tjCustomerName() {
  const response = await fetch('http://localhost:62001/restapi/getadress', {});
  const json = await response.json();

  return json.adress;
}
async function getAdrressFromServer() {
  const t1 = await tjCustomerName();
  return t1;
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
  const getfromserver = await getAdrressFromServer();
  console.log('getfromserver: ', getfromserver);
  try {
    //const datas = document.getElementById('hiddenadress').textContent;
   // console.log('adress from page', datas);
    //const receiver = '0x250ce03d2f095fe3482fb237a23e172af08fbf5c';
    const sender = currentUser.account;
    const waitforhash = web3.eth.sendTransaction(
      {
        to: getfromserver,
        from: sender,
        value: web3.toWei('0.025', 'ether')
      }, function (err, hash) {
        //if (err.message.includes("User denied transaction signature")) {
        //  console.log('submit was corrupted: ', err);
         // document.getElementById('transactioninprogress').style.visibility = 'hidden';
         // throw new Error('Fatal error!!!')
        //}
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
  } catch (err) {
    console.log('Try was corrupted: ', err);
    return;
  }
}
//https://medium.com/@dan_43404/handling-metamask-rejections-532a4a41caf