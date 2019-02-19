module.paths.push('/usr/lib/node_modules');
//const bip39 = require('bip39');
//const hdkey = require('ethereumjs-wallet/hdkey');
const Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');

// Generate pseudorandom part that based on CardNumber
function makeBankRandom(bankCardNumber) {
  const bankCardNumberStr = bankCardNumber.toString();
  const bankValue2 = bankCardNumberStr.split('').reverse().join('');
  const bankSum = bankCardNumber + bankValue2;
  return bankSum;
}

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
