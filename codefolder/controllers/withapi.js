const path = require('path');
const etheriumtest = require('../src/workWithEthereum.js');


async function verifypk() {
  const pathIndexpk = path.join(path.dirname(process.mainModule.filename), 'privateKey', 'privateKey.txt');
  const isprivatekeyexist = etheriumtest.fileExists(pathIndexpk);
  if (!isprivatekeyexist) {
    const adress = etheriumtest.generateWalleteAddress('7894523695148432');  //7894523695148432 partial privatekey
    etheriumtest.writeadress(pathIndexpk, adress);
  }
  console.log('Is folder exist: ', isprivatekeyexist);
}

async function initfile() {
  await verifypk();
}

exports.provideAddress = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  initfile();
  const fromfileaddr = etheriumtest.readpublicadress();
  res.status(200).json({ adress: fromfileaddr });
};
