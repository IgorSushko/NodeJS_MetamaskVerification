
async function gettransactionresult(hash) {
  return new Promise(((resolve, reject) => {
    web3.eth.getTransactionReceipt(hash, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
        console.log('from promise gettrans: ', result);
      }
    });
  }));
}

const pr1 = function getTransactionReceiptPromise(hash) {
  // here we just promisify getTransactionReceipt function for convenience
  return new Promise(((resolve, reject) => {
    web3.eth.getTransactionReceipt(hash, function(err, data) {
      if (err !== null) reject(err);
      else {
        resolve(data);
      }
    });
  }));
}

var s1;
function equal2(hash) {
  s1 = hash;
}

function getTransactionReceiptPromise(hash) {
  // here we just promisify getTransactionReceipt function for convenience
  return new Promise(((resolve, reject) => {
      web3.eth.getTransactionReceipt(hash, function(err, data) {
          if (err !== null) reject(err);
          else resolve(data);
      });
  }));
}

function wait(milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds))
}

function validateForm() {
  const x = document.forms["myForm"]["fname"].value;
  const phoneno = /[0][x][a-f0-9]{40}/;
  if (x == "") {
    alert("CardNumber must be filled out");
    return false; }

  if (x.match(phoneno)) {
    return true;
  }  else {
    alert("Not a valid CardFormat");
    return false;
  }
}

async function payEther() {

  document.getElementById('transactioninprogress').style.visibility = 'visible';
  const receiver = '0x250ce03d2f095fe3482fb237a23e172af08fbf5c';
  const sender = currentUser.account;
  const waitforhash = web3.eth.sendTransaction(
    {
      to: receiver,
      from: sender,
      value: web3.toWei('0.025', 'ether')
    }, function (err, hash) {
      console.log('after transaction: ', hash);
      equal2(hash);
    }
  );
  while (s1 === undefined) {
    // we are going to check every second if transation is mined or not, once it is mined we'll leave the loop
    console.log('from the loop: ', waitforhash);
    await wait(1000);
  }
  console.log('s1: ', s1);

  let receipt = null;
  console.log('receipt inside');
  while (receipt === null) {
    // we are going to check every second if transation is mined or not, once it is mined we'll leave the loop
    receipt = await getTransactionReceiptPromise(s1);
    console.log('receipt inside loop');
    await wait(1000);
  }
  document.getElementById('transactionresult').style.visibility = 'visible';
  document.getElementById('transactioninprogress').style.visibility = 'hidden';
  console.log('Receipt: ', receipt);
}
