const currentUser = {
  account: '',
  publicKey: 'loading',
  privateKey: 'loading',
};

async function init() {
  if (typeof web3 !== 'undefined') {
    console.log('web3 is enabled');
    document.getElementById('vermetamask').className = 'green-text';
    document.getElementById('vermetamask').innerHTML = 'Metamask already installed';
    document.getElementById('decisionpic').src = 'OKgreen.png';
    if (web3.currentProvider.isMetaMask === true) {
      console.log('MetaMask is active');
    } else {
      console.log('MetaMask is not available');
    }
  } else {
    console.log('web3 is not found');
  }

  await ethereum.enable();
  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      console.error(err);
    } else if (!accounts || accounts.length == 0 || !accounts[0]) {
      console.log('accounts', accounts);
    } else {
      web3.version.getNetwork((errn, network) => {
        if (errn) {
          console.error(errn);
        } else if (network != 3) {
          console.log('network', network);
        } else {
          console.log('Network :', network);
          document.getElementById('vermetamasknet').className = 'green-text';
          document.getElementById('vermetamasknet').innerHTML = 'Ropsten Testnet already selected';
          document.getElementById('decisionpicrop').src = 'OKgreen.png';
          currentUser.account = accounts[0];
          console.log(`Wallet address: ${currentUser.account}`);
          document.getElementById('vermetamaskaddr').className = 'green-text';
          document.getElementById('vermetamaskaddr').innerHTML = `Wallet address: ${currentUser.account}`;
          document.getElementById('decisionpicaddr').src = 'OKgreen.png';

          getBalance(currentUser.account).then((result) => {
            const ether = parseFloat(web3.fromWei(result, 'ether'));
            console.log(`Ether balance: ${ether}`);
            document.getElementById('vermetamaskball').className = 'green-text';
            document.getElementById('vermetamaskball').innerHTML = `Ether balance: ${ether}`;
            document.getElementById('decisionpicball').src = 'OKgreen.png';
          });

        }});
    }
  });

  const getBalance = (address) => {
    return new Promise (function (resolve, reject) {
      web3.eth.getBalance(address, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
          }
      })
    })
  };
}
