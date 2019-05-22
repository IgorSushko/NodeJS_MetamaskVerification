module.paths.push('/usr/lib/node_modules');
//const bip39 = require('bip39');
//const hdkey = require('ethereumjs-wallet/hdkey');
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const path = require('path');
const fs = require('fs');
const Web3 = require('web3');

//const web3js = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/e8d1850447dd4e02940cd50f7f043f0b"));
const web3js = new Web3("https://ropsten.infura.io/v3/e8d1850447dd4e02940cd50f7f043f0b");

// Generate pseudorandom part that based on CardNumber
function makeBankRandom(bankCardNumber) {
  const bankCardNumberStr = bankCardNumber.toString();
  const bankValue2 = bankCardNumberStr.split('').reverse().join('');
  const bankSum = bankCardNumber + bankValue2;
  return bankSum;
}

/**
 * @param {String} path to file
 * @returns {bool} Verify is file exist or not.
 */
module.exports.fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

/**
 * @param {String} path to file
 * @param {String} value with public adress
 * @returns {void} Write to file
 */
module.exports.writeadress = (filePath, adress) => {
  try {
    fs.appendFileSync(filePath, adress);
    console.log('The "data to append" was appended to file!');
  } catch (err) {
    console.log('writetofile something goes wrong');
  }
};

/**
 * @param {String} bankCardNumber
 * @returns {String} WalleteAddress
 */
module.exports.generateWalleteAddress = (bankCardNumber) => {
  const randomBytes = makeBankRandom(bankCardNumber);
  const privateKeyBuffer = EthUtil.toBuffer(randomBytes.toString('hex'));
  const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

  const publicKey = wallet.getPublicKeyString();
  console.log(publicKey);
  const address = wallet.getAddressString();
  console.log('igorSu Adress :'+ address);
  return address;
};

/**
 * @param {void}
 * @returns {String} value with public adress of generated wallet
 */
module.exports.readpublicadress = () => {
  try {
    const pathIndexpks = path.join(path.dirname(process.mainModule.filename), 'privateKey', 'privateKey.txt');
    var contentadress = fs.readFileSync(pathIndexpks,'utf8');
  } catch (error) {
    console.log('Readfile error privateKey.txt');
    return {};
  }

  return contentadress;
};

function wait(milleseconds) {
  return new Promise(resolve => setTimeout(resolve, milleseconds));
}


/*  function getTransactionReceiptPromise(hash) {
  // here we just promisify getTransactionReceipt function for convenience
  return new Promise(((resolve, reject) => {
    web3js.eth.getTransaction(hash, (err, data) => {
      if (err !== null) reject(err);
      else resolve(data);
    });
  }));
}  */

async function getBalance(address) {
  return new Promise((resolve, reject) => {
    web3js.eth.getBalance(address, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

async function getBalanceCorrect() {
  const balance = await getBalance("0x250ce03d2f095fe3482fb237a23e172af08fbf5c");
  const ether = parseFloat(web3js.utils.fromWei(balance, 'ether'));
  console.log(`Ether balance: ${ether}`);
  return ether;
}

/*  async function getTransactionCorrect(transHash) {
  let receipt = null;
  try {
    while (receipt === null) {
      // we are going to check every second if transation is mined or not, once it is mined we'll leave the loop
      receipt = await getTransactionReceiptPromise(transHash);
      console.log('receipt inside loop');
      await wait(1000);
    }
  } catch (err) {
    console.log(err);
  }
  console.log('from function result', receipt);
  return receipt;
}     */

//module.exports.returnTransDetails = transactionHash => getTransactionCorrect(transactionHash);
module.exports.returnBalance = () => getBalanceCorrect();

module.exports.readTransactionCorrect = hash => new Promise((resolve, reject) => {
  web3js.eth.getTransaction(hash, (err, data) => {
    if (err !== null) {reject(err);
    console.log('inside promise readtransaction') }
    else resolve(data);
  });
});

module.exports.readTransactionCorrectBlock = (hashStringOrNumber, index) => new Promise((resolve, reject) => {
  web3js.eth.getTransactionFromBlock(hashStringOrNumber, index, (err, data) => {
    if (err) {
      reject({err: err, data: data});
      console.log('inside promise readTransactionCorrectBlock Reject');
    } else {
      resolve(data);
    }
  });
});

//https://medium.com/@piyopiyo/generating-an-ethereum-wallet-with-an-existing-private-key-5cda690a8eb8
//https://medium.com/coinmonks/ethereum-tutorial-sending-transaction-via-nodejs-backend-7b623b885707
