const currentUser = {
  account: '',
  publicKey: 'loading',
  privateKey: 'loading',
};

async function init() {
  if (typeof web3 !== 'undefined') {
    console.log('web3 is enabled');
    document.getElementById('vermetamask').className = "green-text";
    document.getElementById('vermetamask').innerHTML = "Metamask already installed";
    document.getElementById('decisionpic').src = "OKgreen.png"; 
    if (web3.currentProvider.isMetaMask === true) {
      console.log('MetaMask is active');
    } else {
      console.log('MetaMask is not available');
    }
  } else {
    console.log('web3 is not found');
  }
  //*************************************************** */
  await ethereum.enable();
  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      console.error(err);
    } else if (!accounts || accounts.length == 0 || !accounts[0]) {
      console.log('accounts', accounts);
    } else {
      //document.getElementById('loadingCheck2').className = "material-icons tiny check green-text";
      //document.getElementById('loadingText2').className = "green-text";
      web3.version.getNetwork((err, network) => {
        if (err) {
          console.error(err);
        } else if (network != 3) {
          console.log('network', network);
        } else { console.log("Network :"+network);
           document.getElementById('vermetamasknet').className = "green-text";
           document.getElementById('vermetamasknet').innerHTML = "Ropsten Testnet already selected";
           document.getElementById('decisionpicrop').src = "OKgreen.png"; 
          currentUser.account = accounts[0];
          console.log("Account  " +currentUser.account);
        }
      });
    }
  });

   //await web3.eth.getBalance("0x237Fd58d3c3482126c6cC55fDDa035876E3791aA", (balance) => { console.log(web3.fromWei(balance,'ether')) });
   //web3.eth.getBalance("0x237Fd58d3c3482126c6cC55fDDa035876E3791aA").then((balance) => { console.log(web3.fromWei(balance,'ether')) });
   
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

  getBalance("0x237Fd58d3c3482126c6cC55fDDa035876E3791aA").then((result) => {
    console.log(web3.fromWei(result.c[0], 'ether'));
    const ar=result.c[0]
    console.log(web3.utils.isBigNumber(result.c[0]));
    
  });





}

//check Metamask accounts should be unlocked
//check Ropsten Testnet should be selected 