const currentUser = {
  account: '',
};

const okSrc = './img/ok.png';


async function getBalance(address) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

async function getNetwork() {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((err, network) => {
      if (err) {
        reject(err);
      } else {
        resolve(network);
      }
    });
  });
}


async function getAccounts() {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        reject(err);
      } else {
        resolve(accounts);
      }
    });
  });
}

async function init() {
  if (typeof web3 === 'undefined') {
    console.log('web3 is not found');
    return false; // do nothing more
  }
  console.log('web3 is enabled');
  document.getElementById('vermetamask').className = 'green-text';
  document.getElementById('vermetamask').innerHTML = 'Metamask already installed';
  document.getElementById('vermetamask_pic').src = okSrc;
  if (web3.currentProvider.isMetaMask === true) {
    console.log('MetaMask is active');
  } else {
    console.log('MetaMask is not available');
  }

  await ethereum.enable();

  const accounts = await getAccounts();
  if (!accounts || accounts.length === 0 || !accounts[0]) {
    console.log('accounts', accounts);
    return false;
  }

  const network = await getNetwork();

  if (network.toString() !== '3') {
    console.log('network', network);
    return false;
  }

  console.log('Network :', network);
  document.getElementById('vermetamask_net').className = 'green-text';
  document.getElementById('vermetamask_net').innerHTML = 'Ropsten Testnet is selected';
  document.getElementById('vermetamask_net_pic').src = okSrc;

  currentUser.account = accounts[0];
  console.log(`Wallet address: ${currentUser.account}`);
  document.getElementById('vermetamask_addr').className = 'green-text';
  document.getElementById('vermetamask_addr').innerHTML = `Wallet address: ${currentUser.account}`;
  document.getElementById('vermetamask_addr_pic').src = okSrc;

  const balance = await getBalance(currentUser.account);
  const ether = parseFloat(web3.fromWei(balance, 'ether'));
  console.log(`Ether balance: ${ether}`);
  document.getElementById('vermetamask_bal').className = 'green-text';
  document.getElementById('vermetamask_bal').innerHTML = `Ether balance: ${ether}`;
  document.getElementById('vermetamask_bal_pic').src = okSrc;

  return true;
}
