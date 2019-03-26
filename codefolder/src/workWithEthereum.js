module.paths.push('/usr/lib/node_modules');
//const bip39 = require('bip39');
//const hdkey = require('ethereumjs-wallet/hdkey');
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const fs = require('fs');

// Generate pseudorandom part that based on CardNumber
function makeBankRandom(bankCardNumber) {
  const bankCardNumberStr = bankCardNumber.toString();
  const bankValue2 = bankCardNumberStr.split('').reverse().join('');
  const bankSum = bankCardNumber + bankValue2;
  return bankSum;
}


module.exports.fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

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
//https://medium.com/@piyopiyo/generating-an-ethereum-wallet-with-an-existing-private-key-5cda690a8eb8