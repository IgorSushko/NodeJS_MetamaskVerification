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
  const approve = await etheriumtest.readTransactionCorrect(hash);
  console.log('takeTransactionApproveServer(hash)hash :', hash);
  console.log('takeTransactionApproveServer(hash) :', approve);
  return approve;
}

app.use(bodyParser.json()); // bodyParser.urlencoded({ extended: false })
// Required to all static files.
app.set('view engine', 'ejs');
app.set('views', 'templates'); // set folder that include *.ejs files
app.use(express.static('templates'));

app.use('/', indexRoutes);

app.use('/restapi', feedRoutes);

io1.getIO().on('connection', function (socket) {
  
  socket.on('Receipt', function (data) {
    const transHash = utils.taketransactionHash(data);
    console.log('FromClient: ', transHash);
    //const serverside = etheriumtest.returnTransDetails(transHash).then(console.log);
    takeBalanceserver().then((tempdata) => {socket.emit('Balance', { Balance: tempdata });});
    takeTransactionApproveServer(transHash).then((transdata) => {socket.emit('TransactionDetails', { TransactionDetails: transdata })})
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