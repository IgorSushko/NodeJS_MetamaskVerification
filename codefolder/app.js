const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/withapi');
const indexRoutes = require('./routes/index2');
const downloadRoutes = require('./routes/downloadlink');
const io1 = require('./src/socketio');
const utils = require('./src/utils');
const etheriumtest = require('./src/workWithEthereum');

const app = express();
const server = app.listen(8080);
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
    return approve;
  } catch (error2) {
    console.log('-!!!!!!!!!!!!!!!-');
    console.log('async function takeTransactionApproveServer: ', error2);
  }
}

app.use(bodyParser.json()); // bodyParser.urlencoded({ extended: false })
// Required to all static files.
app.set('view engine', 'ejs');
app.set('views', 'templates'); // set folder that include *.ejs files
app.use(express.static('templates'));

app.use('/', indexRoutes);

app.use('/restapi', feedRoutes);

app.use('/downloadbook', downloadRoutes);

io1.getIO().on('connection', function (socket) {

  socket.on('Receipt', function (basicData) {
    let data = JSON.parse(JSON.stringify(basicData));
    if (data.Receipt) data = data.Receipt;
    console.log('');
    console.log('FromClient:', basicData);
    const transHash = utils.transactionHash(data);
    const blockNumber = utils.blockNumber(data);
    const index = utils.transactionIndex(data);

    takeBalanceserver().then((tempdata) => {socket.emit('Balance', { Balance: tempdata });});

    takeTransactionApproveServer(transHash).then((transdata) => {
      let serverCheck = JSON.parse(JSON.stringify(transdata));
      if (utils.blockNumber(serverCheck)==blockNumber && utils.transactionIndex(serverCheck)==index){
        socket.emit('TransactionDetails', { TransactionDetails:'Transaction approved by server' })
        console.log('Transaction approved by server ');
      } else {
        socket.emit('TransactionDetails', { TransactionDetails:'Transaction is NOT approved by server' })
        console.log('Transaction is NOT approved by server ');
      }
    })
  }); })

app.use((req, res, next) => {
  console.log('In the 404 middleware44!');
  const path404 = path.join(__dirname, 'templates', 'error404.html');
  res.status(404).sendFile(path404);
});
