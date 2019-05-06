const path = require('path');

class EthApi {
  constructor() {
    this.etheriumtest = require('../src/workWithEthereum.js');
    const pathIndexpk = path.join(path.dirname(process.mainModule.filename), 'privateKey', 'privateKey.txt');
    const isprivatekeyexist = this.etheriumtest.fileExists(pathIndexpk);
    if (!isprivatekeyexist) {
      const adress = this.etheriumtest.generateWalleteAddress('7894523695148432');  //7894523695148432 partial privatekey
      this.etheriumtest.writeadress(pathIndexpk, adress);
    }
    console.log('Is folder exist: ', isprivatekeyexist);
  }

  getAddress() {
    return this.etheriumtest.readpublicadress();
  }
}


const EthApiController = new EthApi();

exports.provideAddress = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).json({ adress: EthApiController.getAddress() });
};
