const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/withapi');
const indexRoutes = require('./routes/index2');
const io1 = require('./src/socketio');
const utils = require('./src/utils');
const etheriumtest = require('./src/workWithEthereum');

const app = express();
const server = app.listen(8080);
//const io = require('socket.io')(server);
const io = require('./src/socketio').init(server);
io.on('connection', socket => {
console.log('Client connected');
});


async function takeBalanceserver() {
  const balancce = await etheriumtest.returnBalance();
  console.log('takeBalanceserver() :', balancce);
  return balancce;
}

async function takeTransactionApproveServer(hash) {
    try {
  const approve = await etheriumtest.readTransactionCorrect(hash);
  console.log('takeTransactionApproveServer(hash)hash :', hash);
  console.log('takeTransactionApproveServer(hash) :', approve);
  return approve;
  } catch (error2) {
    console.log('async function takeTransactionApproveServer: ', error2);
  }
}
async function takeTransactionApproveServerBlock(blockHashOrNumber,index) {
  try {
    const approve = await etheriumtest.readTransactionCorrectBlock(blockHashOrNumber, index);
    console.log('takeTransactionApproveServerBlock(blockHash)blockHash :', blockHashOrNumber);
    console.log('takeTransactionApproveServerBlock(blockHash)Result :', approve);
    return approve;
  } catch (error) {
    console.log('-!!!!!!!!!!!!!!!-');
    console.log('async function takeTransactionApproveServer: ', error);
    console.log('blockHashOrNumber', blockHashOrNumber)
    console.log('index', index)
  }
}

app.use(bodyParser.json()); // bodyParser.urlencoded({ extended: false })
// Required to all static files.
app.set('view engine', 'ejs');
app.set('views', 'templates'); // set folder that include *.ejs files
app.use(express.static('templates'));

app.use('/', indexRoutes);

app.use('/restapi', feedRoutes);

io1.getIO().on('connection', function (socket) {

  socket.on('Receipt', function (basicData) {
    let data = JSON.parse(JSON.stringify(basicData));
    if (data.Receipt) data = data.Receipt;
    console.log('');
    console.log('FromClient:', basicData);
    const transHash = utils.transactionHash(data);
    const blockNumber = utils.blockNumber(data);
    const index = utils.transactionIndex(data);
    console.log('FromClient transHash: ', transHash);
    console.log('FromClient blockNumber: ', blockNumber);
    console.log('FromClient index: ', index);


    //const serverside = etheriumtest.returnTransDetails(transHash).then(console.log);
    takeBalanceserver().then((tempdata) => {socket.emit('Balance', { Balance: tempdata });});

    takeTransactionApproveServerBlock(blockNumber,index).then((transdata) => {
      socket.emit('TransactionDetails', { TransactionDetails: transdata })
    })

    // console.log('Serverside: ',serverside);
    //console.log("Balance from server", balance);


  }); })

app.use((req, res, next) => {
  console.log('In the 404 middleware44!');
  const path404 = path.join(__dirname, 'templates', 'error404.html');
  res.status(404).sendFile(path404);
});

//io1.getIO().on('Receipt', function (data) {
  //console.log(data);
//});


//const server = http.createServer(app);
//server.listen(8080);}
